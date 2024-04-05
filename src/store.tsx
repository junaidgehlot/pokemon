import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from "react";
import { Pokemon } from "./types";

function usePokemonSource(): {
  pokemon: Pokemon[];
  search: string;
  setSearch: (search: string) => void;
} {
  type PokemonState = {
    pokemon: Pokemon[];
    search: string;
  };

  type PokemonAction =
    | {
        type: "setPokemon";
        payload: Pokemon[];
      }
    | {
        type: "setSearch";
        payload: string;
      };

  const [{ pokemon, search }, dispatch] = useReducer(
    (state: PokemonState, action: PokemonAction) => {
      switch (action.type) {
        case "setPokemon":
          return { ...state, pokemon: action.payload };
        case "setSearch":
          return { ...state, search: action.payload };
      }
    },
    {
      pokemon: [],
      search: "",
    } as PokemonState
  );

  useEffect(() => {
    fetch("/pokemon.json")
      .then((res) => res.json())
      .then((data) => dispatch({ type: "setPokemon", payload: data }));
  }, []);

  const filteredPokemon = useMemo(
    () =>
      pokemon.filter((p) =>
        p.name.toLocaleLowerCase().includes(search.toLowerCase())
      ),
    [pokemon, search]
  );

  const sortedPokemon = useMemo(
    () => [...filteredPokemon].sort((a, b) => a.name.localeCompare( b.name)),
    [filteredPokemon]
  );

  const setSearch = useCallback((search: string) => {
    dispatch({
      type: "setSearch",
      payload: search,
    });
  }, []);

  return {
    pokemon: sortedPokemon,
    search,
    setSearch,
  };
}

export function usePokemon() {
  return useContext(PokemonContext);
}

const PokemonContext = createContext<ReturnType<typeof usePokemonSource>>(
  {} as unknown as ReturnType<typeof usePokemonSource>
);

export const PokemonProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <PokemonContext.Provider value={usePokemonSource()}>
      {children}
    </PokemonContext.Provider>
  );
};
