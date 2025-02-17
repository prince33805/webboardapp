"use client"

import { CreatePost, PostList, Searchbar } from '@/components'
import React, { useEffect, useState } from 'react'

const Home = () => {

  const [allPosts, setAllPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newError, setError] = useState<string | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>(""); // New search state
  // const [fetchCount, setFetchCount] = useState(0); // Counter for fetch calls
  const [editingPost, setEditingPost] = useState<{
    title: string;
    content: string;
  } | undefined>(undefined); // State to track if we're editing a post

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // setSelectedCategoryId(null)
        setLoading(true);
        setError(null); // Reset error state before fetching
        const apiUrl = process.env.REACT_APP_API_URL || process.env.NEXT_PUBLIC_API_URL;
        let url = `${apiUrl}/posts`;
        if (selectedCategoryId) { //with search 
          url = `${apiUrl}/posts/category/${selectedCategoryId}?search=${encodeURIComponent(searchQuery)}`;
        } else if (searchQuery) { // only search
          url = `${apiUrl}/posts?search=${encodeURIComponent(searchQuery)}`;
        }
        const response = await fetch(url);

        // Increment fetch count after the request is made
        // setFetchCount(prevCount => prevCount + 1);

        if (!response.ok) {
          const errorData = await response.json(); // Try to get the error response
          throw new Error(errorData.message || "Failed to fetch posts");
        }

        const data = await response.json();
        // console.log("Fetched Posts:", data); // Debugging

        if (data.length === 0) {
          setError("No posts available.");
          setAllPosts([]); // Ensure empty state
          return;
        } else {
          setAllPosts(data.map((post: { id: { toString: () => any; }; author: { username: any; }; category: { name: any; }; title: any; content: any; comments: string | any[]; }) => ({
            id: post.id.toString(),
            author: post.author?.username || "Unknown Author",  // Extract username
            category: post.category?.name || "Uncategorized",  // Extract category name
            title: post.title || "Untitled",
            content: post.content || "No content available",
            comments: post.comments ? post.comments.length.toString() : "0", // Adjust if needed
          })));
          setError(null);
        }
      } catch (error) {
        setError(error.message || "Something went wrong while fetching posts.");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [selectedCategoryId, searchQuery]);

  const handleSave = (post: { title: string; content: string; }) => {
    // console.log("Saved Post:", post);
    setShowCreatePost(false);
    setEditingPost(undefined); // Reset after save
  };

  return (
    <div className="p-6 bg-[--gray100] min-h-screen">
      {!showCreatePost ? (
        <>
          <Searchbar
            onCreateClick={() => setShowCreatePost(true)}
            onCategoryChange={(categoryId) => {
              // console.log("Category ID received in Home:", categoryId);
              setSelectedCategoryId(categoryId);
            }}
            onSearchChange={(query) => {
              // console.log("Search Query:", query);
              setSearchQuery(query);
            }}

          />
          {loading ? (
            <p className="text-center text-gray-500">Loading posts...</p>
          )
            : newError ? (
              <p className="text-center text-red-500 mt-4">{newError}</p>
            )
              // : allPosts.length === 0 ? (
              //   <p className="text-center text-gray-500">No posts available. Create one!</p>
              // )
              : (
                <PostList posts={allPosts} />
              )}
        </>
      ) : (
        <CreatePost
          onClose={() => {
            setShowCreatePost(false)
            setEditingPost(undefined);
          }}
          onSave={handleSave}
          postData={editingPost}
        />
      )}
    </div>
  )
}

export default Home
