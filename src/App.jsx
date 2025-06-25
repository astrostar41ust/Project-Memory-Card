  import { useEffect, useState } from "react";
  import { fetchData } from "./utils";
  import "./App.css";

  const pokemonApiUrl = "https://pokeapi.co/api/v2/pokemon?limit=12&offset=0";

  function App() {
    const [allPokemons, setAllPokemons] = useState([]);
    const [clickedPokemons, setClickedPokemons] = useState(new Set());
    const [currentScore, setCurrentScore] = useState(0);
    const [bestScore, setBestScore] = useState(0);

    useEffect(() => {
      async function getPokemon() {
        const data = await fetchData(pokemonApiUrl);
        
        const fullPokemonData = data.results.map(async (pokemon) => {
          const data = await fetchData(pokemon.url)
          
          return {
            name: data.name,
            sprites: data.sprites.front_default
          }
        
        })
        
        setAllPokemons(await Promise.all(fullPokemonData));
      }

      getPokemon();
    }, []);


    function shuffleArray(array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    }

    function handleCardPick(pokemonName) {
      if (clickedPokemons.has(pokemonName)) {
        if (currentScore > bestScore) {
          setBestScore(currentScore);
        }
        setCurrentScore(0);
        setClickedPokemons(new Set());
        return;
      }

      setCurrentScore((prevScore) => prevScore + 1);
      setClickedPokemons(new Set([...clickedPokemons, pokemonName]));
      setAllPokemons(shuffleArray([...allPokemons]));
    }



    return (
      <div className="app-container">
        <header className="header">
          <div className="header-content">
            <span className="header-icon" role="img" aria-label="gamepad">🎮</span>
            <span className="header-title">Pokémon Memory Game</span>
          </div>
          <div className="header-subtitle">
            Click each Pokémon only once to score points!
          </div>
          <div className="scores">
            <span className="score-box">Score: <span style={{marginLeft: '0.5rem'}}>{currentScore}</span></span>
            <span className="score-box best">Best: <span style={{marginLeft: '0.5rem'}}>{bestScore}</span></span>
          </div>
        </header>
        <main>
          <div className="card-grid">
            {allPokemons.map((pokemon) => {
          
              return (
                <div
                  className="card"
                  key={pokemon.name}
                  onClick={() => handleCardPick(pokemon.name)}
                >
                  <img src={pokemon.sprites} alt={pokemon.name} className="card-img" />
                  <div className="card-name">{pokemon.name}</div>
                </div>
              );
            })}
          </div>
        </main>
    
      </div>
    );
  }

  export default App;
