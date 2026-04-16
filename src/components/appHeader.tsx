import SearchBar from "./searchBar";
import { useSearch } from "../context/searchContext";

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
