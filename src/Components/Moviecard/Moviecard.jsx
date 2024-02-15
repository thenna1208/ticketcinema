
import React from 'react';
import './Moviecard.css';
import { Link } from 'react-router-dom';


function Moviecard({ item }) {


  return (
    <div className="card">
      <Link to={`/individualmoviecard?id=${item.id}`}>
        <img src={item.image_url} className="card-img-top" alt="..." />
      </Link>
      <hr />
      <div className="card-body">
        <div className="product-card">
          <h5 className="card-title ">{item.title}</h5>
        </div>
        <div className="description">
          <p>{item.description}</p>
        </div>
        <hr />
       
      </div>
    </div>
  );
}

export default Moviecard;

