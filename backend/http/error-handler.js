export function registerErrorHandler(app) {
  app.setErrorHandler((error, req, reply) => {
    const status = error.statusCode || (error.code === "23505" ? 409 : 500);
    if (status >= 500) req.log.error({ err: error }, "request_failed");
    reply.code(status).send({
      error: {
        code:
          status === 500 ? "INTERNAL_ERROR" : error.code || "REQUEST_FAILED",
        message:
          status === 500
            ? "Máy chủ gặp sự cố. Vui lòng thử lại."
            : error.code === "23505"
              ? "Email này đã được đăng ký."
              : error.message,
      },
    });
  });
}
