import { useState } from "react";
import { chipVariants } from "../utils/styles";
import { type PokemonType } from "../utils/types";

type HeaderProps = {
  filterByType: (type: string) => void;
  filterByName: (value: string) => void;
};

export default function Header({ filterByType, filterByName }: HeaderProps) {
  const [active, setActive] = useState<PokemonType | null>("todos");
  const [search, setSearch] = useState("");
  const pokemonType: PokemonType[] = [
    "todos",
    "normal",
    "fire",
    "water",
    "grass",
    "electric",
    "psychic",
    "ghost",
    "flying",
    "poison",
    "bug",
    "fighting",
    "rock",
    "ground",
    "ice",
    "dragon",
    "dark",
    "steel",
    "fairy",
  ];

  function handleFilter(type: PokemonType) {
    setActive(type);
    filterByType(type);
    setSearch("");
  }

  function handleInputSearch(value: string) {
    setSearch(value);
    filterByName(value);
    setActive(null);
  }

  return (
    <header className="bg-surface">
      <div className="flex text-2xl gap-4 px-4 py-6 font-inter border-y border-border-base items-center shadow-xl/10">
        <div className="text-txt-primary font-bold leading-1.5">
          Poké
          <span className="text-txt-dex">dex</span>
        </div>
        <input
          value={search}
          onChange={(e) => handleInputSearch(e.target.value)}
          type="text"
          placeholder="Buscar pokémon..."
          className="border border-border-hover outline-none px-4 py-2 rounded-lg bg-surface-el w-5/7 text-base leading-1.5 text-txt-primary font-normal  placeholder:text-txt-muted placeholder:text-[12px] focus:border-txt-dex transition duration-350 ease"
        />
      </div>
      <div className="px-4 py-5 border-b border-border-hover overflow-auto">
        <nav>
          <ul>
            <li className="flex gap-2 items-center">
              {pokemonType.map((type) => (
                <button
                  key={type}
                  className={`${chipVariants[type]}  rounded-[20px] py-1 px-2 text-[10px] font-semibold capitalize hover:opacity-85 transition ease duration-100 ${active === `${type}` && `scale-105  outline border`}`}
                  onClick={() => handleFilter(type)}
                >
                  {type}
                </button>
              ))}
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
