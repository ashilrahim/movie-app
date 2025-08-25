import React, { useEffect, useState } from "react";
import Search from "./components/Search";
import Spinner from "./components/Spinner";
import MovieCard from "./components/MovieCard";
import { useDebounce } from "react-use";
import { getTrendingMovies, updatedSearch } from "./appwrite.js";

const App = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [errorMsg, seterrorMsg] = useState("");
  const [movieList, setmovieList] = useState([]);
  const [isTrending, setisTrending] = useState([]);
  const [isLoading, setisLoading] = useState(false);
  const [debounceSearchTerm, setdebounceSearchTerm] = useState("");

  const API_BASE_URL = "https://api.themoviedb.org/3";

  const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

  const API_OPTIONS = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${API_KEY}`,
    },
  };

  useDebounce(() => setdebounceSearchTerm(searchTerm), 500, [searchTerm]);

  const fetchMovies = async (query) => {
    setisLoading(true);
    seterrorMsg("");
    try {
      const endpoint = query
        ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
        : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;

      const res = await fetch(endpoint, API_OPTIONS);

      if (!res.ok) {
        throw new Error("error fetching movies");
      }

      const data = await res.json();

      if (data.Response === "False") {
        seterrorMsg(data.Error || "Failed to fetch movies");
        setmovieList([]);
        return;
      }

      setmovieList(data.results || []);

      if (query && data.results.length > 0) {
        updatedSearch(query, data.results[0]);
      }
    } catch (error) {
      console.error(`error fetching movies, ${error}`);
      seterrorMsg("error fetching details");
    } finally {
      setisLoading(false);
    }
  };

  const loadTrendingMovies = async () => {
    try {
      const result = await getTrendingMovies();
      setisTrending(result);
    } catch (error) {
      console.error("Error fetching trending movies:", error);
    }
  };

  useEffect(() => {
    fetchMovies(debounceSearchTerm);
  }, [debounceSearchTerm]);

  useEffect(() => {
    loadTrendingMovies();
  }, []);

  return (
    <main>
      <div className="pattern" />

      <div className="wrapper">
        <header>
          <img src="/movie-app/hero-img.png" alt="hero-img" />
          <h1>
            Find <span className="text-gradient">Movies</span>You'll enjoy
            without hassles
          </h1>

          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </header>

        {isTrending.length > 0 && (
          <section className="trending">
            <h2>Trending Movies</h2>
            <ul>
              {isTrending.map((movie, index) => (
                <li key={movie.$id}>
                  <p> {index + 1} </p>
                  <img src={movie.poster_url} alt="{movie.title}" />
                </li>
              ))}
            </ul>
          </section>
        )}
        <section className="all-movies">
          <h2 className="text-center">All Movies</h2>
          {isLoading ? (
            <Spinner />
          ) : errorMsg ? (
            <p className="text-red-500">{errorMsg}</p>
          ) : (
            <ul>
              {movieList.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
};

export default App;
