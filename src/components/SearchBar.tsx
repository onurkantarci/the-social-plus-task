import React from "react";
import { Input } from "../../components/ui/input";

interface SearchBarProps {
  placeholder: string;
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
}

const SearchBar = ({
  placeholder,
  searchQuery,
  setSearchQuery,
}: SearchBarProps) => {
  return (
    <div className="gap-1.5 items-center ml-0 pr-150">
      <Input
        onChange={(e) => setSearchQuery(e.target.value)}
        type="search"
        id="search"
        placeholder={placeholder}
        value={searchQuery}
      />
    </div>
  );
};

export default SearchBar;
