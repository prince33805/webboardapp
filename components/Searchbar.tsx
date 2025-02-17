"use client"

import React, { useEffect, useState } from 'react'

interface SearchbarProps {
  onCreateClick: () => void; // Define the function type
  onCategoryChange: (categoryId: number | null) => void;
  onSearchChange: (searchTerm: string | null) => void
}

const Searchbar: React.FC<SearchbarProps> = ({ onCreateClick, onCategoryChange, onSearchChange }) => {

  // console.log("Searchbar Props:", { onCreateClick, onCategoryChange, onSearchChange });

  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const apiUrl = process.env.REACT_APP_API_URL || process.env.NEXT_PUBLIC_API_URL;
        const response = await fetch(`${apiUrl}/categories`);
        if (!response.ok) throw new Error("Failed to fetch categories");
        const data = await response.json();
        setCategories(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleSearch = (event: any) => {
    const value = event.target.value;
    setSearchTerm(value);
    if (typeof onSearchChange === 'function') { // ✅ Check if it's a function
      onSearchChange(value);
    } else {
      console.error("onSearchChange is not a function");
    }
  };

  return (
    <div className='flex justify-between'>
      <div className='content-center md:w-1/2'>
        {/* <label for="first_name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">First name</label> */}
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={handleSearch}
          className="disabled:opacity-75 bg-[--gray100] border border-white text-black text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
      </div>

      <div className='content-center'>
        <select
          onChange={(e) => {
            const selectedId = e.target.value ? Number(e.target.value) : null;
            // console.log("Selected Category ID:", selectedId);

            if (onCategoryChange) {
              onCategoryChange(selectedId);
            } else {
              // console.error("onCategoryChange is undefined!");
            }
          }}
          className="bg-[--gray100] text-black font-medium text-sm p-2.5 rounded-xl"
        >

          <option value="">Select Community</option>
          {loading ? (
            <option disabled>Loading...</option>
          ) : error ? (
            <option disabled>{error}</option>
          ) : (
            categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))
          )}
        </select>
      </div>

      <div>
        <button
          onClick={onCreateClick}
          className="bg-green-700 hover:bg-green-800 text-white font-medium text-sm text-center me-2 m-2 py-2.5 px-5 rounded-xl">
          Create +
        </button>
      </div>
    </div >
  )
}

export default Searchbar
