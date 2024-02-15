import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import SignUp from './Components/SignUp/SignUp';
import Login from './Components/Login/Login';
import Home from './Components/Home/Home';
import IndividualMovieCard from './Components/IndividualMovieCard/IndividualMovieCard';
import SeatSelectionPage from './Components/SeatSelectionPage/SeatSelectionPage';
import BookingPage from './Components/BookingPage/BookingPage';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path='/signup' element={<SignUp/>}></Route>
          <Route path='/login' element={<Login/>}></Route>
          <Route path='/' element={<Home/>}></Route>
          <Route path='/individualmoviecard' element={<IndividualMovieCard/>}></Route>
          <Route path='/seat-selection/:theaterId/:movieId' element={<SeatSelectionPage />} />
          <Route path="/booking/:userId/" element={<BookingPage />}></Route>

        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
