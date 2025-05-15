import { Search } from "lucide-react";
import React from "react";

import { Input } from "@/components/ui/input";

const SearchBar: React.FC = () => {
  return (
    <div className="relative max-w-md w-full">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
      <Input
        type="text"
        placeholder="Buscar workshops, capacitações..."
        className="pl-10 bg-white dark:bg-gray-800"
      />
    </div>
  );
};

export default SearchBar;
