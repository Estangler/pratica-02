export async function getPokemonList() {
  const resolve = await fetch("https://pokeapi.co/api/v2/pokemon?limite=151");
  const data = await resolve.json();

  return data.results;
}

export async function getPokemonDetails(url: string) {
  const response = await fetch(url);
  return response.json();
}
