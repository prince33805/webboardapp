"use client"

import { CreatePost, PostList, Searchbar } from '@/components';
import { useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react'

const page = () => {

    const [allPosts, setAllPosts] = useState([]);
    const [authorId, setAuthorId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
    const [newError, setError] = useState<string | null>(null);
    const [showCreatePost, setShowCreatePost] = useState(false);
    const [searchQuery, setSearchQuery] = useState<string>(""); // New search state  
    const hasAlerted = useRef(false); // Prevent multiple alerts();
    // const [fetchCount, setFetchCount] = useState(0); // Counter for fetch calls
    const [editingPost, setEditingPost] = useState<{
        title: string;
        content: string;
    } | undefined>(undefined); // State to track if we're editing a post

    const router = useRouter(); // Initialize the router for redirection

    useEffect(() => {
        if (hasAlerted.current) return; // If already alerted, return
        hasAlerted.current = true; // Mark as alerted

        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setAuthorId(parsedUser.id); // Set authorId from localStorage user object
        } else {
            alert("Please Login")
            // window.history.replaceState(null, "", "/");            
            // If no user data is found, redirect to the /sign-in page
            router.push(`/sign-in?callbackUrl=${encodeURIComponent(window.location.href)}`);
        }
    }, []);

    useEffect(() => {
        const fetchPosts = async () => {
            if (!authorId) {
                setError('Author ID is missing or invalid.');
                setLoading(false);
                return;
            }
            setLoading(true);
            setError(null); // Reset error state before fetching
            try {
                const apiUrl = process.env.REACT_APP_API_URL || process.env.NEXT_PUBLIC_API_URL;
                let url = `${apiUrl}/posts/author/${authorId}`;
                if (selectedCategoryId) { //with search ???
                    url = `${apiUrl}/posts/author/${authorId}/category/${selectedCategoryId}?search=${encodeURIComponent(searchQuery)}`;
                } else if (searchQuery) {
                    url = `${apiUrl}/posts/author/${authorId}?search=${encodeURIComponent(searchQuery)}`;
                }
                // console.log("url", url)
                const response = await fetch(url);

                // setFetchCount(prevCount => prevCount + 1);

                // const response = await fetch(`http://localhost:3001/posts/author/${authorId}`);
                if (!response.ok) {
                    const errorData = await response.json(); // Try to get the error response
                    throw new Error(errorData.message || "Failed to fetch posts");
                }

                const data = await response.json();
                // console.log("Fetched Posts:", data); // Debugging

                if (data.length === 0) {
                    setError("No posts available.");
                    setAllPosts([]); // Ensure empty state
                    // return;
                } else {
                    setAllPosts(data.map((post: { id: { toString: () => any; }; author: { username: any; }; category: { name: any; }; title: any; content: any; comments: string | any[]; }) => ({
                        id: post.id.toString(),
                        author: post.author?.username || "Unknown Author",  // Extract username
                        category: post.category?.name || "Uncategorized",  // Extract category name
                        title: post.title || "Untitled",
                        content: post.content || "No content available",
                        comments: post.comments ? post.comments.length.toString() : "", // Adjust if needed
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
    }, [authorId, selectedCategoryId, searchQuery]);

    const handleSave = (post: { title: string; content: string; }) => {
        // console.log("Saved Post:", post);
        setShowCreatePost(false);
        setEditingPost(undefined); // Reset after save
    };

    return (
        <div className="p-6 bg-[--gray100] min-h-screen">
            {/* {fetchCount} */}
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
                            //     <p className="text-center text-gray-500">No posts available. Create one!</p>
                            // )
                            : (
                                // <div></div>
                                <PostList posts={allPosts} showActions={true} />

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
            {/* <Searchbar
                onCreateClick={() => setShowCreatePost(true)} />
            <PostList posts={allPosts} showActions={true} /> */}
        </div>
    )
}

export default page
