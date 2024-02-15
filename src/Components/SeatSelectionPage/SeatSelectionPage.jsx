import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../AuthContext';
import Header from '../Header/Header';
import './SeatSelectionPage.css'; // Import your custom CSS file for styling


const SeatSelectionPage = () => {
  const { movieId, theaterId } = useParams();
  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    // Fetch seat data from the backend
    fetch(`http://localhost:8000/api/seats/?movie_id=${movieId}&theater_id=${theaterId}`)
      .then(response => response.json())
      .then(data => {
        setSeats(data);
      })
      .catch(error => {
        console.error(error);
      });
  }, [movieId, theaterId]);

  const handleSeatClick = seatId => {
    if (!seats.find(seat => seat.id === seatId).is_reserved) {
      if (!selectedSeats.includes(seatId)) {
        setSelectedSeats([...selectedSeats, seatId]);
      } else {
        setSelectedSeats(selectedSeats.filter(id => id !== seatId));
      }
    }
  };

  const handleBookNow = () => {
    // Prepare data for booking
    const theaterIdInt = parseInt(theaterId, 10);
    const movieIdInt = parseInt(movieId, 10);
    
    const bookingData = {
      user_id: user.id,
      // access_token: user.access,
      theater_id: theaterIdInt,
      selected_seats: selectedSeats,
      movie_id: movieIdInt,
    };
    console.log('Booking Data:', bookingData);
  
    // Implement logic to send bookingData to the backend for booking
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bookingData),
    };
  
    fetch(`http://localhost:8000/api/bookings/create/`, requestOptions)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log('Booking successful:', data);
        // Redirect to the booking page
        navigate(`/booking/${user.id}/`);
      })
      .catch(error => {
        console.error('Failed to create booking:', error);
      });
  };
  

  return (
    /*<div>
      <Header />
      <div className="seat-selection-container">
        <h5>Select. Sit. Enjoy. Your Perfect Seat Awaits</h5>
        
        <div className="seat-container">
          {seats.map(seat => (
            <div
              key={seat.id}
              className={`seat ${seat.is_reserved ? 'reserved' : selectedSeats.includes(seat.id) ? 'selected' : ''}`}
              onClick={() => handleSeatClick(seat.id)}
            >
              {seat.seat_number}
            </div>
          ))}
        </div>
        <div className="screen">
          <img src='https://assetscdn1.paytm.com/movies_new/_next/static/media/screen-icon.8dd7f126.svg' alt='screen'/>
        </div>
        <button onClick={handleBookNow} disabled={selectedSeats.length === 0}>
          Book Now
        </button>
      </div>
    </div>
  );*/
  <div>
      <Header />
      <div className="seat-selection-container">
        <h5>Select. Sit. Enjoy. Your Perfect Seat Awaits</h5>

        

        <div className="seat-container">
          {seats.map(seat => (
            <div
              key={seat.id}
              className={`seat ${seat.is_reserved ? 'reserved' : selectedSeats.includes(seat.id) ? 'selected' : ''}`}
              onClick={() => handleSeatClick(seat.id)}
            >
              {seat.seat_number}
            </div>
          ))}
        </div>
        <div className="screen">
          <img src="https://assetscdn1.paytm.com/movies_new/_next/static/media/screen-icon.8dd7f126.svg" alt="screen" />
        </div>
        <div className="legend">
          <div className="legend-item">
            <div className="seat available"></div>
            <div className="legend-label">Available</div>
          </div>
          <div className="legend-item">
            <div className="seat selected"></div>
            <div className="legend-label">Selected</div>
          </div>
          <div className="legend-item">
            <div className="seat reserved"></div>
            <div className="legend-label">Reserved</div>
          </div>
        </div>
        <button onClick={handleBookNow} disabled={selectedSeats.length === 0}>
          Book Now
        </button>
      </div>
    </div>
  );
};

export default SeatSelectionPage;





