import * as repository from "./auth.repository.js";
import { randomUUID } from "node:crypto";
import {
  hashPassword,
  verifyPassword,
  token,
  hashToken,
  csrfFor,
  safeUser,
} from "../../common/security.js";
import { initialState } from "../../../shared/progress.js";
import { fail, text, validateEmail } from "../../common/errors.js";
/** @param {{ db: import('../../db/types.js').Database }} dependencies */
export async function createAuthService({ db }) {
  const dummy = await hashPassword(token());
  async function session(tx, userId) {
    const raw = token();
    await repository.insertSession(tx, {
      tokenHash: hashToken(raw),
      userId: userId,
      expiresAt: new Date(Date.now() + 7 * 86400000),
    });
    return raw;
  }
  async function register({ input } = {}) {
    const address = validateEmail(input?.email),
      password = text(input?.password, "Mật khẩu", { min: 12, max: 128 }),
      name = text(input?.name || "", "Tên", { min: 0, max: 40 }),
      hashed = await hashPassword(password),
      recoveryCode = token(),
      id = randomUUID();
    const raw = await db.transaction(async (tx) => {
      await repository.insertPasswordUser(tx, {
        id: id,
        email: address,
        passwordHash: hashed,
        recoveryHash: hashToken(recoveryCode),
      });
      const d = initialState();
      d.profile.name = name;
      await repository.insertSettings(tx, {
        userId: id,
        profile: JSON.stringify(d.profile),
        audio: JSON.stringify(d.audio),
      });
      return session(tx, id);
    });

    return {
      sessionToken: raw,
      user: { id, email: address, role: "learner" },
      csrf: csrfFor(raw),
      recoveryCode,
    };
  }
  async function login({ input } = {}) {
    const address = validateEmail(input?.email),
      password = text(input?.password, "Mật khẩu", { max: 128 });
    const user = (await repository.findByEmail(db, { email: address })).rows[0];
    const valid = await verifyPassword(password, user?.password_hash || dummy);
    if (!user || !valid)
      fail(401, "Email hoặc mật khẩu chưa đúng.", "BAD_CREDENTIALS");
    const raw = await db.transaction((tx) => session(tx, user.id));

    return { sessionToken: raw, user: safeUser(user), csrf: csrfFor(raw) };
  }
  async function logout({ sessionToken } = {}) {
    await repository.deleteSession(db, { tokenHash: hashToken(sessionToken) });

    return { ok: true };
  }
  async function recover({ input } = {}) {
    const address = validateEmail(input?.email),
      code = text(input?.recoveryCode, "Mã khôi phục", {
        min: 20,
        max: 100,
      }),
      password = text(input?.password, "Mật khẩu mới", {
        min: 12,
        max: 128,
      }),
      newHash = await hashPassword(password),
      replacement = token();
    await db.transaction(async (tx) => {
      const user = (
        await repository.lockRecoveryUser(tx, {
          email: address,
          recoveryHash: hashToken(code),
        })
      ).rows[0];
      if (!user)
        fail(400, "Email hoặc mã khôi phục chưa đúng.", "RECOVERY_FAILED");
      await repository.replaceRecoveryPassword(tx, {
        userId: user.id,
        passwordHash: newHash,
        recoveryHash: hashToken(replacement),
      });
      await repository.deleteUserSessions(tx, { userId: user.id });
      await repository.insertAudit(tx, {
        id: randomUUID(),
        actorId: user.id,
        action: "password_recovered",
      });
    });

    return { ok: true, recoveryCode: replacement };
  }
  async function changePassword({ input, actor, sessionToken } = {}) {
    const old = text(input?.currentPassword, "Mật khẩu hiện tại", {
        max: 128,
      }),
      next = text(input?.newPassword, "Mật khẩu mới", { min: 12, max: 128 });
    const user = (await repository.findPassword(db, { userId: actor.id }))
      .rows[0];
    if (!(await verifyPassword(old, user.password_hash)))
      fail(401, "Mật khẩu hiện tại chưa đúng.");
    const hashed = await hashPassword(next);
    await db.transaction(async (tx) => {
      await repository.updatePassword(tx, {
        userId: actor.id,
        passwordHash: hashed,
      });
      await repository.deleteOtherSessions(tx, {
        userId: actor.id,
        tokenHash: hashToken(sessionToken),
      });
    });
    return { ok: true };
  }
  async function deleteAccount({ input, actor } = {}) {
    const password = text(input?.password, "Mật khẩu", { max: 128 });
    const user = (await repository.findPassword(db, { userId: actor.id }))
      .rows[0];
    if (!(await verifyPassword(password, user.password_hash)))
      fail(401, "Mật khẩu chưa đúng.");
    await repository.deleteUser(db, { userId: actor.id });

    return { ok: true };
  }
  async function loginGoogle(profile) {
    const address = validateEmail(profile.email),
      name = text(profile.name || "", "Tên", { max: 40 });
    const raw = await db.transaction(async (tx) => {
      let user = (
        await repository.findGoogleIdentity(tx, { subject: profile.sub })
      ).rows[0];
      if (!user)
        user = (await repository.findByEmail(tx, { email: address })).rows[0];
      if (!user) {
        const id = randomUUID();
        const passwordHash = await hashPassword(token());
        user = (
          await repository.insertGoogleUser(tx, {
            id: id,
            email: address,
            passwordHash: passwordHash,
            subject: profile.sub,
          })
        ).rows[0];
        const d = initialState();
        d.profile.name = name;
        await repository.insertSettings(tx, {
          userId: id,
          profile: JSON.stringify(d.profile),
          audio: JSON.stringify(d.audio),
        });
      } else {
        await repository.linkGoogleIdentity(tx, {
          userId: user.id,
          subject: profile.sub,
        });
      }
      return session(tx, user.id);
    });
    return raw;
  }
  return {
    register,
    login,
    logout,
    recover,
    changePassword,
    deleteAccount,
    loginGoogle,
  };
}
