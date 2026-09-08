import React, { createContext, useContext, useEffect, useState } from "react";
import { topics, phrases } from "../../../shared/catalog.js";
import { scenarios } from "../../../shared/scenarios.js";
import { api } from "../services/api.js";
const seed = { topics, phrases, scenarios };
function cached() {
  try {
    const c = JSON.parse(localStorage.getItem("little-catalog-v3"));
    return c &&
      Array.isArray(c.phrases) &&
      c.phrases.length &&
      Array.isArray(c.topics) &&
      Array.isArray(c.scenarios)
      ? c
      : seed;
  } catch {
    return seed;
  }
}
const Context = createContext(null);
export function CatalogProvider({ children }) {
  const [catalog, setCatalog] = useState(cached),
    [source, setSource] = useState("cache");
  async function refresh() {
    try {
      const result = await api("/catalog");
      setCatalog(result);
      setSource("server");
      try {
        localStorage.setItem("little-catalog-v3", JSON.stringify(result));
      } catch {}
      return true;
    } catch {
      setSource("offline");
      return false;
    }
  }
  useEffect(() => {
    refresh();
  }, []);
  return (
    <Context.Provider value={{ ...catalog, source, refresh }}>
      {children}
    </Context.Provider>
  );
}
export const useCatalog = () => useContext(Context);
