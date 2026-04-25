import { useEffect, useState } from "react";
import { type Pokemon, type PokemonDataList } from "./utils/types";
import { getPokemonList, getPokemonDetails } from "./services/pokemonService";
import Modal from "react-modal";
import Header from "./components/Header";
import PokemonCard from "./components/PokemonCard";

Modal.setAppElement("#root");

export default function App() {
  const [loading, setLoading] = useState(true);
  const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);
  const [filteredList, setFilteredList] = useState<Pokemon[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  // VER DEBOUNCE

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

  function openModal() {
    setIsOpen(true);
    console.log("cheguei");
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

  return (
    <main>
      {loading ? (
        "Carregando..."
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
              <p className="text-txt-primary text-center pt-30 text-4xl">
                Nem um pokemon encontrado.
                <button></button>
              </p>
            )}
          </div>
        </div>
      )}

      <Modal isOpen={isOpen} onRequestClose={() => setIsOpen(false)}></Modal>
    </main>
  );
}
