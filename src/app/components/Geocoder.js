"use client"
import React, { useEffect, useState } from 'react';

const Geocoder = ({ onDataUpdate }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  const handleInputChange = (event) => {
    const inputValue = event.target.value;
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
    console.log(result)
    setQuery(result.place_name.replace(', United States', '')); // Update the input with the selected suggestion
    const longitude = result.center[0];
    const latitude = result.center[1];
    onDataUpdate(longitude, latitude, result.place_name);

    // Clear suggestions when an item is selected
    setSuggestions([]);
  };

  return (
    <div>
      <input type="text" value={query} onChange={handleInputChange} />
      <ul>
        {suggestions.map((suggestion) => (
          <li key={suggestion.id} onClick={() => handleResultSelect(suggestion)}>
            {suggestion.place_name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Geocoder;
