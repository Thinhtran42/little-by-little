import * as repository from "./catalog.repository.js";
import { createHash } from "node:crypto";
/** @param {{ db: import('../../db/types.js').Database }} dependencies */
export function createCatalogService({ db }) {
  async function getCatalog() {
    const topics = (await repository.listTopics(db)).rows.map((r) => r.content),
      phrases = (await repository.listPhrases(db)).rows.map((r) => ({
        ...r.content,
        revision: r.revision,
      })),
      scenarios = (await repository.listScenarios(db)).rows.map(
        (r) => r.content,
      );
    const result = { topics, phrases, scenarios },
      etag =
        '"' +
        createHash("sha256")
          .update(JSON.stringify(result))
          .digest("hex")
          .slice(0, 20) +
        '"';
    return { result, etag };
  }
  return { getCatalog };
}
