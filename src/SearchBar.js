import React, { useState } from "react";
const SearchBar = (props) => {
    const [search, setSearch] = useState('');

    const handleSearch = (e) => {
        const searchText = e.target.value.toLowerCase();
        setSearch(searchText);
        props.handleSearch(searchText);
    }

    return (
        <div className="w-[500px] flex items-center justify-center">
            <input
                className="w-11/12 relative h-10 px-4 bg-slate-500 rounded-lg text-white focus:outline-none pl-10"
                type="text"
                placeholder="Search..."
                value={search}
                onChange={handleSearch}
            />
        </div>
    );
};

export default SearchBar;
