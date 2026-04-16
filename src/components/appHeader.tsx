import SearchBar from "./searchBar";
import { useSearch } from "../hooks/useSearch";

export default function AppHeader() {
  const { searchText, setSearchText } = useSearch();

  return (
    <header className="app-header">
      <SearchBar
        onChange={setSearchText}
        placeholder="Search for movies..."
        value={searchText}
        variant="dark"
      />
    </header>
  );
}
