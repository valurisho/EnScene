import { useEffect, useMemo, useState, type ReactNode } from "react";
import { SearchContext } from "./searchContextValue";

export function SearchProvider({ children }: { children: ReactNode }) {
  const [searchText, setSearchText] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  useEffect(() => {
    // Wait a little before using the search text, so the app does not search on every key press.
    const timeoutId = setTimeout(() => {
      setDebouncedQuery(searchText.trim());
    }, 400);
    return () => clearTimeout(timeoutId);
  }, [searchText]);

  // This is the shared search data that other components can read.
  const value = useMemo(
    () => ({ searchText, setSearchText, debouncedQuery }),
    [searchText, debouncedQuery],
  );

  return (
    <SearchContext.Provider value={value}>{children}</SearchContext.Provider>
  );
}
