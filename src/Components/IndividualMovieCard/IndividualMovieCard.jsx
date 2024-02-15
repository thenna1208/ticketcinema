  import React, { useEffect, useState } from 'react';
  import './IndividualMovieCard.css';
  import { Link, useLocation } from 'react-router-dom';
  import Header from '../Header/Header';
  import { useAuth } from '../../AuthContext';
  import HashLoader  from "react-spinners/HashLoader";

  function formatTime(dateTimeString, timeZone) {
    const options = { hour: 'numeric', minute: 'numeric', hour12: true };
    return new Date(dateTimeString).toLocaleTimeString(undefined, options);
  }

  function IndividualMovieCard() {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const id = searchParams.get('id');

    const { isLoggedIn } = useAuth();

    const [movie, setMovie] = useState(null);
    const [theaters, setTheaters] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      // Fetch movie details
      fetch(`http://localhost:8000/api/movies/${id}`)
        .then((response) => response.json())
        .then((data) => {
          setMovie(data);

          // Fetch related theaters if the user is logged in
          if (isLoggedIn) {
            fetch(`http://localhost:8000/api/movies/${id}/theaters/`)
              .then((theaterResponse) => theaterResponse.json())
              .then((theaterData) => {
                setTheaters(theaterData);
                setLoading(false); // Set loading to false once data is fetched
              })
              .catch((theaterError) => {
                console.error(theaterError);
              });
          } else {
            setLoading(false); // Set loading to false if the user is not logged in
          }
        })
        .catch((error) => {
          console.error(error);
        });
    }, [id, isLoggedIn]);

    if (loading) {
      return  <HashLoader 
      color={"#36d7b7"}
      loading={loading}
      className='spinner'
      size={100}
      aria-label="Loading Spinner"
      data-testid="loader"
    />
    }

    if (!movie) {
      return <p>Movie not found.</p>;
    }

    return (
      <>
        <Header />
        <div className='indi-page'>
          <div className="individual-card">
            {movie.image_url && <img src={movie.image_url} alt={movie.title} />}
            <div className='info-card'>
            <h2>{movie.title}</h2>
            <div className="movie-info">
              <label>Genre:</label>
              <span>{movie.genre}</span>
            </div>
            <div className="movie-info">
              <label>Language:</label>
              <span>{movie.language}</span>
            </div>
            <div className="movie-info">
              <label>Director:</label>
              <span>{movie.director}</span>
            </div>
            <div className="movie-info">
              <label>Runtime:</label>
              <span>{movie.runtime} minutes</span>
            </div>
            <div className="movie-info">
              <label>Rating:</label>
              <span>{movie.rating}</span>
            </div>
            <div className="movie-info">
              <label>Actors:</label>
              <span>{movie.actors}</span>
            </div>
            </div>
          </div>
          {isLoggedIn ? (
            <div className="theater-card">
              <h3>Theaters playing this movie</h3>
              <ul className='theater-name'>
                {theaters.map((theater) => (
                  <li key={theater.id}>
                    <Link to={`/seat-selection/${theater.id}/${movie.id}`}>
                      {theater.name} - {theater.city} -  {formatTime(theater.movie_timing,'America/New_York')}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p className='login'><a href='/login'>Login to view theaters and book seats.</a></p>
          )}
        </div>
      </>
    );
  }

  export default IndividualMovieCard;
