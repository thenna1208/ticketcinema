import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../AuthContext';
import Header from '../Header/Header';
import './BookingPage.css'

const BookingPage = () => {
  const { user } = useAuth();
  const [bookedTickets, setBookedTickets] = useState([]);
  const { userId } = useParams();

  useEffect(() => {
    // Check if the user is logged in before making the API call
    if (!user) {
      // Handle the case where the user is not logged in
      console.log('User is not logged in. Redirect or show a login prompt.');
      return;
    }

    // Fetch booked tickets data for the specific user from the backend
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Authorization: `Bearer ${user.access}`,
      },
    };

    fetch(`http://localhost:8000/api/bookings/${user.id}/`, requestOptions)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log('Bookings fetched successfully:', data);
        setBookedTickets(data); // Update state with fetched data
      })
      .catch(error => {
        console.error('Failed to fetch bookings:', error);
      });
  }, [user, userId]);

  const formatDateTime = dateTimeString => {
    const options = { hour: 'numeric', minute: 'numeric', hour12: true };
    const timeString = new Date(dateTimeString).toLocaleString('en-US', options);

    const dateOptions = { day: '2-digit', month: '2-digit', year: 'numeric' };
    const dateString = new Date(dateTimeString).toLocaleString('en-US', dateOptions);

    return `${timeString} - ${dateString}`;
  };

  return (
    <div className='tickets'>
      <Header />
      <h2>Your Cinematic Journey Awaits – Explore Your Confirmed Movie Experience!</h2>
      {user ? (
        <div className="card-columns">
          {bookedTickets.map(ticket => (
            <div className="card" key={ticket.id}>
              <div className="card-body">
                <div className='ticket-image'>
                  {ticket.movie.image_url && 
                    <img src={ticket.movie.image_url} className="card-img-top" alt={ticket.movie.title} />}
                </div>
                <div className='ticket-details'>
                  <h5 className="card-title">Movie: {ticket.movie.title}</h5>
                  <h6 className="card-subtitle mb-2 text-muted">Show Time: {formatDateTime(ticket.theater.movie_timing)}</h6>
                  <p className="card-text">Theater: {ticket.theater.name}</p>
                  <p className="card-text">Seat Numbers: {ticket.seats.map(seat => seat.seat_number).join(', ')}</p>
                  <p className="card-text">Total Cost: {ticket.total_cost}</p>
                  <p className="card-text">Booking time: {formatDateTime(ticket.booking_time)}</p>
                </div> 
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="login-prompt">
          <h2 ><a href='/login'>Login to view your tickets.</a></h2>
          {/* Add a login link or redirect to the login page */}
        </div>
      )}
    </div>
  );
};

export default BookingPage;
