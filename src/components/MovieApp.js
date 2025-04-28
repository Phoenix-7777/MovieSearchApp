import React, { useState } from "react";
import './MovieApp.css';
import { AiOutlineSearch } from "react-icons/ai";
import axios from 'axios';

export default function MovieApp() {
  const [movies, setMovies] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedMovieId, setExpandedMovieId] = useState(null);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };
//SDSDSDSD
  const handleSearchSubmit = async () => {
    try {
      const response = await axios.get('https://www.omdbapi.com/', {
        params: {
          apikey: '9c72c845',
          s: searchQuery,
        },
      });

      if (response.data.Response === "True") {
        const searchResults = response.data.Search;

        // Fetch full details for each movie
        const movieDetailsPromises = searchResults.map(async (movie) => {
          const detailResponse = await axios.get('https://www.omdbapi.com/', {
            params: {
              apikey: '9c72c845',
              i: movie.imdbID,
            },
          });
          return detailResponse.data;
        });

        const moviesWithDetails = await Promise.all(movieDetailsPromises);
        setMovies(moviesWithDetails);

      } else {
        setMovies([]);
        alert(response.data.Error);
      }

    } catch (error) {
      console.error('Error fetching movies', error);
    }
  };

  const toggleDescription = (movieId) => {
    setExpandedMovieId(expandedMovieId === movieId ? null : movieId);
  };

  return (
    <div>
      <h1>MovieHouse</h1>
      <div className='search-bar'>
        <input
          type='text'
          placeholder='Search Movies...'
          value={searchQuery}
          onChange={handleSearchChange}
          className='search-input'
        />
        <button onClick={handleSearchSubmit} className='search-button'>
          <AiOutlineSearch />
        </button>
      </div>

      <div className="movie-wrapper">
        {movies.map((movie) => (
          <div key={movie.imdbID} className="movie">
            <img
              src={movie.Poster !== "N/A" ? movie.Poster : "https://via.placeholder.com/400"}
              alt={movie.Title}
            />
            <h2>{movie.Title}</h2>
            <p className='rating'>IMDb Rating: {movie.imdbRating}</p>
            <p className='rating'>Year: {movie.Year}</p>

            {expandedMovieId === movie.imdbID ? (
              <p>{movie.Plot}</p>
            ) : (
              <p>{movie.Plot.substring(0, 150)}...</p>
            )}

            <button
              onClick={() => toggleDescription(movie.imdbID)}
              className='read-more'
            >
              {expandedMovieId === movie.imdbID ? 'Show Less' : 'Read More'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
