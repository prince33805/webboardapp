"use client"

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

interface Props {
    onClose: () => void;
    onSave: (post: { title: string; content: string; }) => void;
    postData?: {
        id?: any; title: string; content: string; category?: any 
} | null; // Optional for edit mode
}

const CreatePost: React.FC<Props> = ({ onClose, onSave, postData }) => {
    const [title, setTitle] = useState(postData?.title || "");
    const [content, setContent] = useState(postData?.content || "");
    const [categoryId, setCategoryId] = useState(postData?.category?.id || "");
    const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
    const [authorId, setAuthorId] = useState<string | null>(null);
    const hasAlerted = useRef(false); // Prevent multiple alerts();
    const pathname = usePathname(); // Get the current path
    const router = useRouter(); // Initialize the router for redirection

    useEffect(() => {
        if (postData?.category?.id) {
            setCategoryId(Number(postData.category.id)); // Ensure it's a string
        }
    }, [postData]); // Runs when postData changes

    useEffect(() => {
        if (hasAlerted.current) return; // If already alerted, return
        hasAlerted.current = true; // Mark as alerted

        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setAuthorId(parsedUser.id); // Set authorId from localStorage user object
        } else {
            // If no user data is found, redirect to the /sign-in page
            alert("Please login before create a post!");
            router.push(`/sign-in?callbackUrl=${encodeURIComponent(window.location.href)}`);
        }
    }, []);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const apiUrl = process.env.REACT_APP_API_URL || process.env.NEXT_PUBLIC_API_URL;

                const response = await fetch(`${apiUrl}/categories`);
                if (response.ok) {
                    const data = await response.json();
                    setCategories(data);
                } else {
                    console.error("Failed to fetch categories");
                }
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };

        fetchCategories();
    }, []);

    const handleSubmit = async () => {
        if (!authorId || !title || !content || !categoryId) {
            // console.error("All fields are required");
            alert("All fields are required");
            return; // Return early if any field is missing
        }

        const postPayload = {
            title,
            content,
            authorId, // You can retrieve this dynamically based on the logged-in user
            categoryId,
        };

        // API call to create or edit the post
        try {
            const apiUrl = process.env.REACT_APP_API_URL || process.env.NEXT_PUBLIC_API_URL;

            const url = postData
                ? `${apiUrl}/posts/${postData.id}` // Edit mode: Use existing post ID
                : `${apiUrl}/posts`; // Create mode: Default posts endpoint

            const method = postData ? "PATCH" : "POST"; // Edit -> PUT, Create -> POST

            const response = await fetch(url, {
                method, // POST request for creating a new post
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(postPayload), // Send the post data in the request body
            });

            if (response.ok) {
                const result = await response.json();
                // console.log(postData ? "Post updated successfully:" : "Post created successfully:", result);
                onSave(postPayload); // Notify the parent component
                onClose(); // Close the modal
                // console.log("pn", pathname)
                // Redirect based on where we came from
                if (pathname.startsWith("/mypost/edit")) {
                    // console.log("1")
                    router.push("/mypost"); // Go back to the post list after editing
                } else {
                    window.location.reload()
                }
            } else {
                console.error("Failed to create post");
            }
        } catch (error) {
            console.error("Error creating post:", error);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
            <div className="bg-white p-6 rounded-2xl shadow-xl lg:min-w-[750px] h-[650px] lg:h-[550px] mx-4 ">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">{postData ? "Edit Post" : "Create Post"}</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        ✖
                    </button>
                </div>
                <select
                    className="w-full p-2 border border-green-500 rounded-lg mb-4 text-green-500 text-center bg-white"
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                >
                    <option value="">Choose a community</option>
                    {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                            {category.name}
                        </option>
                    ))}
                </select>
                <input
                    type="text"
                    className="w-full p-2 border rounded-lg mb-4"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
                <textarea
                    className="w-full p-2 border rounded-lg h-80 lg:h-72"
                    placeholder="What’s on your mind..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                ></textarea>


                {/* <div className="flex flex-col justify-end gap-2 mt-4">
                    <button
                        type="button"
                        onClick={() => setShowCommentForm(false)}
                        className="text-gray-600 hover:text-red-600 rounded-lg border border-gray-400 px-4 py-2">
                        Cancel
                    </button>

                    <button
                        type="submit"
                        onClick={handleSubmitComment}
                        className="bg-green-700 hover:bg-[--green300] text-white px-4 py-2 rounded-lg">
                        Submit
                    </button>
                </div> */}

                <div className="flex flex-col lg:flex-row justify-end gap-2 mt-4">
                    <button onClick={onClose} className="px-4 py-2 rounded-lg border border-gray-400 text-gray-600 hover:text-red-600">
                        Cancel
                    </button>
                    <button onClick={handleSubmit} className="px-4 py-2 rounded-lg bg-green-600 hover:bg-[--green300] text-white">
                        {postData ? "Save Changes" : "Post"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default CreatePost