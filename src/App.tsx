import { useEffect, useState } from "react";
import {
  type Pokemon,
  type PokemonDataList,
  type PokemonSpecies,
} from "./utils/types";
import {
  getPokemonList,
  getPokemonDetails,
  getPokemonSpecie,
} from "./services/pokemonService";
import LogoSvg from "./assets/logo.svg";

import Header from "./components/Header";
import PokemonCard from "./components/PokemonCard";
import PokemonModal from "./components/PokemonModal";

export default function App() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);
  const [filteredList, setFilteredList] = useState<Pokemon[]>([]);
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null);
  const [captureRate, setCaptureRate] = useState<number | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    async function loadPokemons() {
      setLoading(true);
      setError(null);

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
        console.error("Erro ao carregar pokémons:", error);
        setError("Falha ao carregar pokémons. Tente recarregar a página.");
      } finally {
        setLoading(false);
      }
    }

    loadPokemons();
  }, []);

  async function openModal(id: string) {
    setIsOpen(true);
    const pokemon = pokemonList.find((pokemon) => pokemon.id === id) ?? null;
    setSelectedPokemon(pokemon);

    if (pokemon?.species.url) {
      const specieData: PokemonSpecies = await getPokemonSpecie(
        pokemon.species.url,
      );
      setCaptureRate(specieData.capture_rate);
    }
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
      ) : error ? (
        <div className="flex flex-col items-center justify-center h-screen w-full text-center gap-4">
          <p className="text-txt-primary text-2xl">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="text-txt-dex text-base underline hover:cursor-pointer hover:opacity-90"
          >
            Recarregar página
          </button>
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

      <PokemonModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        pokemon={selectedPokemon}
        captureRate={captureRate}
      />
    </main>
  );
}
