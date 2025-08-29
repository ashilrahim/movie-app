import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Spinner from "./components/Spinner";


const MovieDetails = () => {
  const { id } = useParams();
  // const [movie, setmovie] = useState(null)
  const [loading, setloading] = useState(false);
  const [Errmsg, setErrmsg] = useState("");
  const [movieDetails, setmovieDetails] = useState(null);

  const API_BASE_URL = "https://api.themoviedb.org/3";

  const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

  const API_OPTIONS = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${API_KEY}`,
    },
  };

  const fetchMovieDetails = async () => {
    setloading(false);
    setErrmsg("");
    try {
      const endpoint = `${API_BASE_URL}/movie/${id}`;

      const res = await fetch(endpoint, API_OPTIONS);

      const data = await res.json();

      setmovieDetails(data);
    } catch (error) {
      console.error("error fetching Detais", error);
    } finally {
      setloading(false);
    }
  };

  useEffect(() => {
    fetchMovieDetails();
  }, []);

  if (!movieDetails) {
    return <Spinner />; // Or some other loading indicator
  }

  const {
    title,
    status,
    release_date,
    overview,
    revenue,
    vote_average,
    genres,
    production_companies,
    original_language,
    budget,
    poster_path,
    runtime,
    production_countries,
    spoken_languages,
    backdrop_path
  } = movieDetails;

  return (
    
   <div className="bg-[#0f0d23] text-white max-w-6xl mx-auto p-6 rounded-2xl shadow-xl">
    <div className="flex items-start justify-between">
      <div>
        <h1 className="text-3xl font-bold"> {title} </h1>
        <p className="text-gray-400 mt-1">{release_date} · {original_language} · {Math.floor(runtime/60)}h {runtime%60}m</p>
      </div>
      <div className="flex items-center gap-3">
        <span className="flex items-center gap-1 bg-gray-800 px-3 py-2 rounded-lg text-sm">
          ⭐ {vote_average.toFixed(1)}/10
        </span>
        <button className="bg-gray-800 p-2 rounded-lg">❤️</button>
      </div>
    </div>

    {/* <!-- Media --> */}
  <div className="grid md:grid-cols-3  mt-6">
  <img src={`https://image.tmdb.org/t/p/w500/${poster_path}`} alt="Poster" className="rounded-lg shadow-lg object-cover h-[250px] md:h-[350px] md:col-span-1" />
    <div className="relative md:col-span-2">
      <img src={`https://image.tmdb.org/t/p/original/${backdrop_path}`} alt="Trailer" className="rounded-lg w-full h-[250px] md:h-[350px] object-cover" />
      <button className="absolute flex items-end inset-0 justify-start rounded-lg  p-4">
        <img src="/pause.svg"alt="" /><span className="ml-2">Trailer · 0:31</span>
      </button>
    </div>
  </div>

  {/* <!-- Genres --> */}
  {
    genres && genres.length > 0 && (
      <div className="flex gap-2 mt-6 flex-wrap">
        {genres.map((genre) => (
          <span key={genre.id} className="bg-purple-800 px-3 py-1 rounded-lg text-sm">
            {genre.name}
          </span>
        ))}
      </div>
    )
  }
  

  {/* <!-- Overview --> */}
  { overview && (
    <div className="mt-6">
      <h2 className="text-lg font-semibold mb-2">Overview</h2>
      <p className="text-gray-300 leading-relaxed">
        {overview}
      </p>
    </div>
  )}
  

  {/* <!-- Movie Details --> */}
  { (release_date || status || production_companies?.length > 0 || budget || revenue || runtime || production_countries?.length > 0) || spoken_languages?.length > 0 ? (
      <div className="grid sm:grid-cols-1 gap-6 mt-6 text-sm">
        <div>
          <p><span className="text-lg font-semibold">Release date: </span>{release_date.split("-")[0]}</p>
        <p><span className="text-lg font-semibold">Countries: </span>{production_countries?.map(country => country.name).join(" , ")}</p>
        <p><span className="text-lg font-semibold">Status: </span> {status}</p>
      </div>
      <div>
        <p><span className="text-lg font-semibold">Language: </span>{spoken_languages?.map((lang) => lang.name).join(", ")}</p>
        <p><span className="text-lg font-semibold">Budget: </span>${Math.floor(budget/1000000)} million</p>
        <p><span className="text-lg font-semibold">Revenue: </span>${Math.floor(revenue/1000000)} million</p>

        <p><span className="text-lg font-semibold">Production Companies: </span> {production_companies?.map(company => company.name).join(", ")}</p>
      </div>
    </div>
    ) : (
      <p>No additional information available.</p>
    )}

    {/* <!-- Footer --> */}
  <div className="flex items-center justify-between mt-6">
    <Link to="/" className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-lg transition">
      Visit Homepage →
    </Link>
      
    
  </div>
</div>

  );
};

export default MovieDetails;
