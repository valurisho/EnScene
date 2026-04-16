import { useEffect, useMemo, useState, type ReactNode } from "react";
import { SearchContext } from "./searchContextValue";

export function SearchProvider({ children }: { children: ReactNode }) {
  const [searchText, setSearchText] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedQuery(searchText.trim());
    }, 400);
    return () => clearTimeout(timeoutId);
  }, [searchText]);

  const value = useMemo(
    () => ({ searchText, setSearchText, debouncedQuery }),
    [searchText, debouncedQuery],
  );

  return (
    <SearchContext.Provider value={value}>{children}</SearchContext.Provider>
  );
}
