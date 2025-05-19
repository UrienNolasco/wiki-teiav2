
"use client";

import { Search } from "lucide-react";
import React from "react";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface FilterOption<V = string> {
  value: V;
  label: React.ReactNode;
}

export interface FilterBarProps<V = string> {
  /** Valor do campo de busca */
  searchValue: string;
  /** Callback ao digitar na busca */
  onSearchChange: (v: string) => void;
  /** Placeholder do input de busca */
  searchPlaceholder?: string;

  /** Valor selecionado no select (opcional) */
  selectValue?: V;
  /** Callback ao mudar o select (opcional) */
  onSelectChange?: (v: V) => void;
  /** Placeholder do select */
  selectPlaceholder?: string;
  /** Lista de opções do select */
  selectOptions?: FilterOption<V>[];

  /** Classes Tailwind extra */
  className?: string;
}

export function FilterBar<V = string>({
  searchValue,
  onSearchChange,
  searchPlaceholder = "Buscar...",
  selectValue,
  onSelectChange,
  selectPlaceholder = "Filtrar...",
  selectOptions = [],
  className = "",
}: FilterBarProps<V>) {
  return (
    <div className={`flex flex-col md:flex-row gap-4 ${className}`}>
      {/* Campo de busca */}
      <div className="relative flex-grow">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder={searchPlaceholder}
          className="pl-10"
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      {/* Select, só renderiza se houver callback e opções */}
      {onSelectChange && selectOptions.length > 0 && (
        <Select
          value={selectValue as string}
          onValueChange={(v) => onSelectChange(v as V)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder={selectPlaceholder} />
          </SelectTrigger>
          <SelectContent>
            {selectOptions.map((opt) => (
              <SelectItem key={String(opt.value)} value={opt.value as string}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  );
}