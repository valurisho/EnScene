import { createContext } from "react";

export type SearchContextValue = {
  searchText: string;
  setSearchText: (value: string) => void;
  debouncedQuery: string;
};

export const SearchContext = createContext<SearchContextValue | null>(null);
