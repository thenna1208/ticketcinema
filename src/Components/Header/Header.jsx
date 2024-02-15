import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../AuthContext';
import './Header.css';



function Header() {
    const { isLoggedIn, user, logout } = useAuth();
    const navigate = useNavigate()

    const handleLogout = () => {
      logout();
      
      navigate('/');
    };
  
    return (
      <div>
        <nav className="navbar navbar-light">
          <div className="container-fluid">
            <a href='/' id="anchor" className="navbar-brand">
              <span className='ticket'>Ticket</span><span className='Cinema'>Cinema</span>
            </a>
  
            <div className='button-container'>
            <div className='booking-cls'> 
                <button type="button" className="btn btn-light booking">
                  <Link className='cart' to='/booking/:user.id/'> My Bookings </Link> &nbsp;
                </button>
              </div>
              &nbsp; &nbsp; &nbsp; &nbsp;

              {isLoggedIn ? (
                <div className="dropdown">
                     
                  <button className="nav-item btn btn-light dropdown-toggle username dropdown-btn" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-person-circle" viewBox="0 0 16 16">
                      <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
                      <path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z" />
                    </svg>&nbsp;&nbsp;
                    {user.username} &nbsp;
                   
                  </button>
                  <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                  <li><button className="dropdown-item" onClick={handleLogout}>Logout</button></li>
                </ul>
                </div>
              ) : (
                <div className="dropdown">
                  <button className="nav-item btn btn-light dropdown-toggle dropdown-btn" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-person-circle" viewBox="0 0 16 16">
                      <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
                      <path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z" />
                    </svg> &nbsp;
                    Login/Sign Up
                  </button>
                  <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                    <li><a className="dropdown-item" href="/signup">Sign Up</a></li>
                    <li><a className="dropdown-item" href="/login">Login</a></li>
                  </ul>
                </div>
              )}
  
              
  
              
            </div>
          </div>
        </nav>
      </div>
    );
  }
  
  export default Header;
  
