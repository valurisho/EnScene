import { useContext } from "react";
import { SearchContext } from "../context/searchContextValue";

export function useSearch() {
  // This lets components use the search context with one simple hook.
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error("useSearch must be used within SearchProvider");
  }
  return context;
}
