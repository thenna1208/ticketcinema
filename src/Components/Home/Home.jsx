import React, { useEffect, useState } from 'react';
import Header from '../Header/Header';
import Moviecard from '../Moviecard/Moviecard';
import './Home.css';
import Filter from '../Filters/Filter';

function Home() {
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [filters, setFilters] = useState({});

  useEffect(() => {
    fetch("http://localhost:8000/api/movies/")
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setMovies(data);
        setFilteredMovies(data); // Initialize filteredMovies with all movies
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const handleFilter = (newFilters) => {
    setFilters(newFilters);

    // Apply filters to the movies
    const filtered = movies.filter((movie) => {
      return (
        (!newFilters.genre || movie.genre === newFilters.genre) &&
        (!newFilters.language || movie.language === newFilters.language) &&
        (!newFilters.location || movie.location === newFilters.location) &&
        (!newFilters.rating || movie.rating === newFilters.rating)
      );
    });

    setFilteredMovies(filtered);
  };

  return (
    <div>
      <Header />
      <div className='tagline'>
        <p>Experience the Magic of Cinema – Your Passport to Unforgettable Movie Moments at Ticket Cinema!</p>
      </div>
      <Filter onFilter={handleFilter} />
      {filteredMovies.length === 0 ? (
        <div className='no-movies-message'>
          <p>There is no Movie in your filtered categories.</p>
        </div>
      ) : (
        <div className='product-container'>
          {filteredMovies.map((movie) => (
            <Moviecard
              key={movie.id}
              item={movie}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;
