"use client"
import React, { useEffect, useState } from 'react';

const Geocoder = React.memo(({ onDataUpdate, initCity }) => {
  const [query, setQuery] = useState(initCity);
  const [suggestions, setSuggestions] = useState([]);

  const handleInputChange = (event) => {
    const inputValue = event.target.value.replace(', United States', '');
    setQuery(inputValue);

    // Call the autocomplete API to get suggestions
    fetchAutocompleteResults(inputValue);
  };

  const fetchAutocompleteResults = async (input) => {
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${input}.json?access_token=pk.eyJ1IjoiY2FzZXltbWlsZXIiLCJhIjoiY2lpeHY1bnJ1MDAyOHVkbHpucnB1dGRmbyJ9.TzUoCLwyeDoLjh3tkDSD4w&type=address&country=us`
      );
      const data = await response.json();

      // Extract suggestions from the response
      const newSuggestions = data.features || [];
      setSuggestions(newSuggestions);
    } catch (error) {
      console.error('Error fetching autocomplete data:', error.message);
    }
  };

  const handleResultSelect = (result) => {
    setQuery(result.place_name.replace(', United States', '')); // Update the input with the selected suggestion
    const longitude = result.center[0];
    const latitude = result.center[1];
    onDataUpdate(longitude, latitude, result.place_name.replace(', United States', ''));

    // Clear suggestions when an item is selected
    setSuggestions([]);
  };

  const handleClearInput = () => {
    setQuery('');
    setSuggestions([]);
  };

  return (
    <div style={{width: '100%'}}>
      <input placeholder="Erie, PA" type="text" value={query.replace(', United States', '')} onChange={handleInputChange} />
      {query && (
        <button 
          onClick={handleClearInput} 
          style={{
            position: 'absolute', 
            right: '-11px',
            transform: 'translateY(-21%)',
            border: 'none',
            background: 'none',
            cursor: 'pointer',
            fontSize: '40px',
            height: '40px',
            width: '40px',
            top: '-5px',
            color: '#000'
          }}
        >
          ⤫
        </button>
      )}
      <ul className="places">
        {suggestions.map((suggestion) => (
          <li key={suggestion.id} onClick={() => handleResultSelect(suggestion)}>
            {suggestion.place_name.replace(', United States', '')}
          </li>
        ))}
      </ul>
    </div>
  );
});

Geocoder.displayName = 'Geocoder';

export default Geocoder;
