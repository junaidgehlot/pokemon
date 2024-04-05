import "./App.css";
import { PokemonProvider, usePokemon } from "./store";

export const PokemonList = () => {
  const { pokemon } = usePokemon();
  return (
    <div>
      {pokemon.map((p) => (
        <div key={p.id}>{p.name}</div>
      ))}
    </div>
  );
};

const SearchBox = () => {
  const { search, setSearch } = usePokemon();
  return (
    <input
      type="text"
      placeholder="Search"
      value={search}
      onChange={(e) => setSearch(e.target.value)}
    />
  );
};

export function App() {
  return (
    <PokemonProvider>
      <div className="mx-auto max-w-3xl">
        <SearchBox />
        <PokemonList />;
      </div>
    </PokemonProvider>
  );
}
export default App;
