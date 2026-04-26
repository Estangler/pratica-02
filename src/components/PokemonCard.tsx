import { type Pokemon } from "../utils/types";
import { chipVariants } from "../utils/styles";

type PokemonCardProps = {
  pokemonList: Pokemon[];
  handleModal: (id: string) => void;
};

export default function PokemonCard({
  pokemonList,
  handleModal,
}: PokemonCardProps) {
  function colectPokemonInfo(id: string) {
    handleModal(id);
  }

  return (
    <div className="grid gap-4 grid-cols-[repeat(auto-fit,minmax(280px,1fr))]  mx-auto">
      {pokemonList.map((pokemon) => {
        const principalType = pokemon.types[0].type.name;

        return (
          <button
            key={pokemon.id}
            className="bg-surface border border-border-base rounded-xl pt-3.5 px-3 pb-2.5 flex flex-col items-center justify-center w-full gap-5 hover:-translate-y-1 duration-150 ease-out cursor-pointer"
            onClick={() => colectPokemonInfo(pokemon.id)}
          >
            <span className="font-mono text-[10px] text-txt-muted">
              #{pokemon.id.padStart(3, "0")}
            </span>
            <div
              className={`h-35 w-35 border rounded-full flex items-center justify-center ${chipVariants[principalType as keyof typeof chipVariants]}`}
            >
              <img
                src={pokemon.sprites.other["official-artwork"].front_default}
                alt={pokemon.name}
                className="animate-float"
              />
            </div>
            <span className="text-sm font-semibold text-txt-primary capitalize">
              {pokemon.name}
            </span>
            <div className="flex gap-2">
              {pokemon.types.map((t, index: number) => (
                <span
                  key={index}
                  className={`${chipVariants[t.type.name as keyof typeof chipVariants]} rounded-[20px] py-1 px-2 text-[10px] font-semibold capitalize`}
                >
                  {t.type.name}
                </span>
              ))}
            </div>
          </button>
        );
      })}
    </div>
  );
}
