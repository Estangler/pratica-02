const API_BASE_URL = "https://pokeapi.co/api/v2"; // Guarda o endereço "base" da API.
const POKEMON_LIMIT = 151; // Define o limite de requisoções.

interface PokemonListResponse {
  results: Array<{ name: string; url: string }>;
}

interface PokemonDetailsResponse {
  id: number;
  name: string;
  height: number;
  weight: number;
  sprites: {
    front_default: string;
    other: {
      "official-artwork": {
        front_default: string;
      };
    };
  };
  types: Array<{
    type: {
      name: string;
    };
  }>;
  abilities: Array<{
    ability: {
      name: string;
    };
  }>;
  stats: Array<{
    base_stat: number;
    stat: {
      name: string;
    };
  }>;
  moves: Array<{
    move: {
      name: string;
      url: string;
    };
  }>;
  species: {
    name: string;
    url: string;
  };
}

interface PokemonSpeciesResponse {
  capture_rate: number;
  name: string;
  url: string;
}

//Função assincrona responsável por fazer o primeiro contato com a API, recebe uma tipagem genérica definindo que o retorno dessa função será uma promisse.
async function fetchFromApi<T>(url: string): Promise<T> {
  const response = await fetch(url); // Guarda o retorno da API.
  if (!response.ok) {
    throw new Error(`Erro ao buscar dados: ${response.status}`);
  }
  return response.json(); // Linha 58 até 61: checka se o retorno da API foi bem sucedido, caso não tenha sido bem sucedido "atira" um erro com o status da resposta da API. Caso o retorno seja bem sucedido a função retorna a resposta da API já convertida em json.
}

//Função assincrona responsavel por capturar a lista com url e nome dos pokemons, nessa função chamamos a nossa função fetchFromApi passando como parametro a url base da api juntamente com o limite de requisoções que desejamos. Posteriormente esses dados serão guardados em uma variável aonde iremos disponibilizar o consumo (desses dados) para o restante da aplicação. Foi projetada dessa forma para já mostrar um conteudo para o usuário permitindo também que ela possa interagir com a aplicação.
export async function getPokemonList() {
  try {
    const data = await fetchFromApi<PokemonListResponse>(
      `${API_BASE_URL}/pokemon?limit=${POKEMON_LIMIT}`,
    ); // Linha 67 até 69 executa a função e recebe tipagem referente ao conteudo que vira da chamada.
    return data.results; //Retorna o array com os dados da lista.
  } catch (error) {
    console.error("Erro ao buscar lista de pokémons:", error);
    throw error; // tratamento de erros, caso algo de errado o catch disponibiliza no console a mensagem do erro.
  }
}

//Função assincrona responsável por capturar os dados necessários para a aplicação. Essa função também recebe uma URL como parametro, ela é chamada assim que o react monta os componentes juntamente com a getPokemonList. Essas duas em particular compõe o combustivel da aplicação. getPokemonDetails é responsável por disponibilizar todo o conteudo referente a cada pokemon.
export async function getPokemonDetails(url: string) {
  try {
    return await fetchFromApi<PokemonDetailsResponse>(url);
  } catch (error) {
    console.error("Erro ao buscar detalhes do pokémon:", error);
    throw error;
  }
}

//Função assincrona responsável por capturar a especie do pokemon selecionado. Essa função é utilizada por uma feature da aplicação. Serve para alimentarmos o modal da aplicação disponibilizando detalhes refente ao pokemon selecionado pelo usuário.
export async function getPokemonSpecie(url: string) {
  try {
    return await fetchFromApi<PokemonSpeciesResponse>(url);
  } catch (error) {
    console.error("Erro ao buscar informações da espécie:", error);
    throw error;
  }
}

//Melhorias: Aqui foi misturado um pouco da lógica, vejo que eu poderia melhorar esse código fazendo um hook customizado responsável pela lógica do consumo da API.
