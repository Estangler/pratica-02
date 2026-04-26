import { useEffect, useState } from "react";
import { type Pokemon, type PokemonDataList } from "./utils/types";
import { getPokemonList, getPokemonDetails } from "./services/pokemonService";
import { chipVariants } from "./utils/styles";
import { MAX_STATS } from "./utils/baseStats";
import { statsVariant } from "./utils/styles";
import LogoSvg from "./assets/logo.svg";

import Modal from "react-modal";
import Header from "./components/Header";
import PokemonCard from "./components/PokemonCard";

Modal.setAppElement("#root");

export default function App() {
  const [loading, setLoading] = useState(true);
  const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);
  const [filteredList, setFilteredList] = useState<Pokemon[]>([]);
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon[] | null>(
    null,
  );
  const [modalTabs, setModalTabs] = useState("sobre");

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    async function loadPokemons() {
      setLoading(true);

      try {
        const pokemonDataList: PokemonDataList[] = await getPokemonList();
        const details = await Promise.all(
          pokemonDataList.map(async (pokemon) => {
            const data = await getPokemonDetails(pokemon.url);
            return {
              id: data.id.toString(),
              name: data.name,
              height: data.height,
              weight: data.weight,
              sprites: data.sprites,
              types: data.types,
              abilities: data.abilities,
              stats: data.stats,
              moves: data.moves,
              species: data.species,
            };
          }),
        );

        setPokemonList(details);
        setFilteredList(details);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }

    loadPokemons();
  }, []);

  function openModal(id: string) {
    setIsOpen(true);
    const pokemon = pokemonList.filter((pokemon) => pokemon.id === id) ?? null;
    setSelectedPokemon(pokemon);
  }

  function handleFilterByType(type: string) {
    if (type === "todos") {
      setFilteredList(pokemonList);
      return;
    }
    const filtered = pokemonList.filter((pokemon) =>
      pokemon.types.some((t) => t.type.name === type),
    );

    setFilteredList(filtered);
  }

  function handleFilterByName(value: string) {
    const filtered = pokemonList.filter((pokemon) =>
      pokemon.name
        .toLocaleLowerCase()
        .trim()
        .includes(value.toLocaleLowerCase().trim()),
    );

    setFilteredList(filtered);
  }

  function handleResetSearch() {
    handleFilterByName("");
    handleFilterByType("todos");
  }

  return (
    <main>
      {loading ? (
        <div className="flex flex-col items-center justify-center h-screen w-full text-center">
          <h1 className="text-8xl text-txt-primary">
            CARREGANDO PÁGINA, AGUARDE...
          </h1>
          <img src={LogoSvg} alt="logo" className="animate-spin" />
        </div>
      ) : (
        <div>
          <Header
            filterByType={handleFilterByType}
            filterByName={handleFilterByName}
          />
          <div className="py-10 px-15">
            {filteredList.length > 0 ? (
              <PokemonCard pokemonList={filteredList} handleModal={openModal} />
            ) : (
              <div className="flex flex-col items-center gap-4 pt-30">
                <p className="text-txt-primary text-center pt-30 text-4xl">
                  Nem um pokemon encontrado.
                </p>
                <button
                  className="text-txt-dex text-base underline hover:cursor-pointer hover:opacity-90"
                  onClick={() => handleResetSearch()}
                >
                  Limpar busca
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <Modal
        isOpen={isOpen}
        onRequestClose={() => setIsOpen(false)}
        className={`p-0 m-0`}
        style={{
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.75)",
            zIndex: 50,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          },
          content: {
            position: "relative",
            inset: "auto",
            padding: 0,
            border: "none",
            borderRadius: "16px",
            background: "transparent",
            width: "100%",
            maxWidth: "600px",
            overflow: "hidden",
          },
        }}
      >
        {selectedPokemon?.map((pokemon) => {
          const principalType = pokemon.types[0].type.name;
          const infoButtons = ["sobre", "stats", "evolucão", "moves"];

          return (
            <div
              key={pokemon.name}
              className={`${chipVariants[principalType as keyof typeof chipVariants]}`}
            >
              <header className="py-10 px-5">
                <span className="font-mono text-base text-txt-muted">
                  #{pokemon.id.padStart(3, "0")}
                </span>
                <p className="text-2xl font-semibold text-txt-primary capitalize">
                  {pokemon.name}
                </p>
                <div className="flex gap-2">
                  {pokemon.types.map((types) => (
                    <span
                      key={types.type.name}
                      className={`${chipVariants[types.type.name as keyof typeof chipVariants]} border rounded-[20px] py-1 px-2 text-xs font-semibold capitalize`}
                    >
                      {types.type.name}
                    </span>
                  ))}
                </div>
              </header>

              <div className="flex flex-col items-center mb-5">
                <div
                  className={`h-65 w-65 border rounded-full flex items-center justify-center ${chipVariants[principalType as keyof typeof chipVariants]}`}
                >
                  <img
                    src={
                      pokemon.sprites.other["official-artwork"].front_default
                    }
                    alt={pokemon.name}
                    className="animate-float h-65 w-65"
                  />
                </div>
              </div>

              <div className="bg-surface rounded-xl border-t border-t-txt-muted py-5 px-5">
                <div className="w-full flex gap-1">
                  {infoButtons.map((info) => (
                    <button
                      className={`bg-surface-el px-3 py-2 text-sm rounded-sm text-txt-muted font-semibold capitalize ${modalTabs === info && `bg-txt-dex text-txt-primary`}`}
                      onClick={() => setModalTabs(info)}
                    >
                      {info}
                    </button>
                  ))}
                </div>
                <div className="flex gap-2 items-center justify-center pt-3">
                  <div className="bg-surface-el rounded-sm text-txt-muted py-1 px-5 uppercase text-[12px] flex-1">
                    <p>Altura</p>
                    <span className="font-bold text-txt-primary">
                      {pokemon.height / 10} m
                    </span>
                  </div>
                  <div className="bg-surface-el text-sm rounded-sm text-txt-muted py-1 px-5 uppercase text-[12px] flex-1">
                    <p>Peso</p>
                    <span className="font-bold text-txt-primary">
                      {pokemon.weight / 10} kg
                    </span>
                  </div>
                  <div className="bg-surface-el text-sm rounded-sm text-txt-muted py-1 px-5 uppercase text-[12px] flex-1">
                    <p>Habilidades</p>
                    <span className="font-bold text-txt-primary text-[11px]">
                      {pokemon.abilities[0].ability.name}
                    </span>
                  </div>
                  <div className="bg-surface-el text-sm rounded-sm text-txt-muted py-1 px-5 uppercase text-[12px] flex-1">
                    <p>Habilidades</p>
                    <span className="font-bold text-txt-primary text-[11px]">
                      {pokemon.species.name}
                    </span>
                  </div>
                </div>
                <div>
                  {pokemon.stats.map((stats) => {
                    const max =
                      MAX_STATS[stats.stat.name as keyof typeof MAX_STATS];
                    const value = (stats.base_stat / max) * 100;

                    return (
                      <div className="w-full mt-2" key={stats.stat.name}>
                        <div className="flex justify-between ">
                          <span
                            className={`text-txt-muted text-[12px] ${stats.stat.name === `hp` ? `uppercase` : `capitalize`}`}
                          >
                            {stats.stat.name}
                          </span>
                          <span className="text-txt-primary text-sm">
                            {stats.base_stat}
                          </span>
                        </div>
                        <div className="w-full h-1 bg-txt-muted rounded-full">
                          <div
                            className={`${statsVariant[stats.stat.name as keyof typeof statsVariant]} h-1 rounded-full `}
                            style={{ width: `${value}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </Modal>
    </main>
  );
}
