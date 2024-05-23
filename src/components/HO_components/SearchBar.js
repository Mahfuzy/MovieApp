import React, { useState } from 'react';
import { FaSearch } from 'react-icons/fa';

const Search = ({ onSearchSubmit }) => {
  const [query, setQuery] = useState('');

  const handleSearch = (event) => {
    setQuery(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault(); // Prevent the default form submission behavior
    if (!query.trim()) return; // Ensure query is not empty
    onSearchSubmit(query); // Pass the search query to the parent component
  };

  return (
    <div className="search-container">
      <form onSubmit={handleSubmit} className="flex items-center">
        <input
          type="text"
          value={query}
          onChange={handleSearch}
          placeholder="Search..."
          className="rounded-lg px-2 text-black"
        />
        <button
          type="submit"
          className="mr-4 ml-2"
        >
          <FaSearch />
        </button>
      </form>
    </div>
  );
};

export default Search;
