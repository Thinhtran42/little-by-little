// getRandomValues also works when a local-network preview is opened over HTTP.
export const eventKey = () =>
  Array.from(crypto.getRandomValues(new Uint8Array(16)), (n) =>
    n.toString(16).padStart(2, "0"),
  ).join("");
