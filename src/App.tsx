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
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(true);
      }
    }

    loadPokemons();
  }, []);

  function openModal() {
    setIsOpen(true);
    console.log("cheguei");
  }

  return (
    <main>
      {loading && (
        <div>
          <Header />
          <div className="py-10 px-15 bg-bg-base">
            <PokemonCard pokemonList={pokemonList} handleModal={openModal} />
          </div>
        </div>
      )}

      <Modal isOpen={isOpen} onRequestClose={() => setIsOpen(false)}></Modal>
    </main>
  );
}
