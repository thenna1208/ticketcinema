// FilterComponent.js

import React, { useState } from 'react';
import './Filter.css'

const Filter = ({ onFilter }) => {
  const [filters, setFilters] = useState({
    genre: '',
    language: '',
    location: '',
    rating: '',
  });

  const handleFilterChange = (filterType, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [filterType]: value,
    }));
  };

  const handleApplyFilters = () => {
    onFilter(filters);
  };

  const handleClearFilters = () => {
    setFilters({
      genre: '',
      language: '',
      location: '',
      rating: '',
    });
    onFilter({});
  };

  return (
    <div className="filter-container">
      <div className='filter-dropdown'>
        <label htmlFor="genre">Genre:</label>
        &nbsp;
        <select
          id="genre"
          value={filters.genre}
          onChange={(e) => handleFilterChange('genre', e.target.value)}
        >
          <option value="">All Genres</option>
          <option value="Action">Action</option>
          <option value="Drama">Drama</option>
          <option value="Crime">Crime</option>
          <option value="Romance">Romance</option>
          {/* Add more genres as needed */}
        </select>
      </div>
      <div className='filter-dropdown'>
        <label htmlFor="language">Language:</label> &nbsp;
        <select
          id="language"
          value={filters.language}
          onChange={(e) => handleFilterChange('language', e.target.value)}
        >
          <option value="">All Languages</option>
          <option value="English">English</option>
          <option value="Spanish">Spanish</option>
         
          {/* Add more languages as needed */}
        </select>
      </div>
      
      <div className='filter-dropdown'>
        <label htmlFor="rating">Rating:</label> &nbsp;
        <select
          id="rating"
          value={filters.rating}
          onChange={(e) => handleFilterChange('rating', e.target.value)}
        >
          <option value="">All Ratings</option>
          <option value="PG-13">PG-13</option>
          <option value="R">R</option>
          {/* Add more ratings as needed */}
        </select>
      </div>
      <div className="filter-buttons">
        <button className='apply-button' onClick={handleApplyFilters}>Apply Filters</button>
        <button className='clear-button' onClick={handleClearFilters}>Clear Filters</button>
      </div>
    </div>
  );
};

export default Filter;
