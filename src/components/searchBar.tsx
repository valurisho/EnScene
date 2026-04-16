type SearchBarProps = {
  variant?: "header" | "dark";
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  id?: string;
};

export default function SearchBar({
  variant = "header",
  value,
  onChange,
  placeholder = "Search for movies...",
  id = "app-search",
}: SearchBarProps) {
  return (
    <label className={`search-bar search-bar--${variant}`} htmlFor={id}>
      <span className="search-bar__icon" aria-hidden="true">
        <svg fill="none" height="20" viewBox="0 0 24 24" width="20">
          <path
            d="M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z"
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth="2"
          />
          <path
            d="M16.5 16.5 21 21"
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth="2"
          />
        </svg>
      </span>
      <input
        autoComplete="off"
        className="search-bar__input"
        id={id}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        type="search"
        value={value}
      />
    </label>
  );
}
