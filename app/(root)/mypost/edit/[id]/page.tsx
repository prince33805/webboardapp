"use client"

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { CreatePost } from "@/components";

const EditPostPage = () => {
    const { id } = useParams(); // Get post ID from URL
    const [postData, setPostData] = useState<{ title: string; content: string; category: any } | null>(null);
    const [authorId, setAuthorId] = useState<string | null>(null);
    const router = useRouter(); // Initialize the router for redirection
    const [newError, setNewError] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setAuthorId(parsedUser.id); // Set authorId from localStorage user object
        } else {
            // If no user data is found, redirect to the /sign-in page
            router.push(`/sign-in?callbackUrl=${encodeURIComponent(window.location.href)}`);
        }
    }, []);

    useEffect(() => {
        if (!id || !authorId) return; // Ensure authorId is available before running
        // console.log("authorId", authorId)
        // Simulating fetching post data from an API
        const fetchPost = async () => {
            try {
                const apiUrl = process.env.REACT_APP_API_URL || process.env.NEXT_PUBLIC_API_URL;
                const response = await fetch(`${apiUrl}/posts/${id}/author/${authorId}`);
                // If response is not OK, handle error
                if (!response.ok) {
                    const errorData = await response.json();
                    setNewError(errorData.message || "An error occurred while fetching the post.")
                    return
                    // throw new Error(errorData.message || "An error occurred while fetching the post.");
                }

                const data = await response.json();
                setPostData(data);
                // console.log("data", data)
            } catch (error) {
                console.error("Failed to fetch post:", error);
                setNewError(error.message);
            }
        };
        fetchPost();
    }, [id, authorId]);

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            {newError ? (
                <div className="text-center text-red-600 bg-red-100 p-4 rounded-md">
                    <p>{newError}</p>
                    <button
                        onClick={() => window.history.back()}
                        className="mt-2 px-4 py-2 bg-[--gray300] text-white rounded-md"
                    >
                        Go Back
                    </button>
                </div>
            ) : postData ? (
                <CreatePost
                    postData={postData}
                    onClose={() => window.history.back()}
                    onSave={(updatedPost) => {
                        // console.log("Updated Post:", updatedPost);
                        // Call API to update the post
                    }}
                />
            ) : (
                <p className="text-center text-gray-500">Loading...</p>
            )
            }

        </div>
    );
};

export default EditPostPage;
