export type PokemonDataList = {
  name: string;
  url: string;
};

export type Pokemon = {
  id: string;
  name: string;

  height: number;
  weight: number;

  sprites: {
    front_default: string;
  };

  types: {
    type: {
      name: string;
    };
  }[];

  abilities: {
    ability: {
      name: string;
    };
  }[];

  stats: {
    base_stat: number;
    stat: {
      name: string;
    };
  }[];

  moves: {
    move: {
      name: string;
      url: string;
    };
  }[];

  species: {
    name: string;
    url: string;
  };
};

export type ChipVariantsProps = {
  todos: string;
  fire: string;
  normal: string;
  water: string;
  grass: string;
  electric: string;
  psychic: string;
  ghost: string;
  flying: string;
  poison: string;
  bug: string;
};

export type PokemonType =
  | "todos"
  | "fire"
  | "water"
  | "grass"
  | "electric"
  | "psychic"
  | "ghost"
  | "flying"
  | "poison"
  | "bug";
