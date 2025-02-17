"use client"

import React, { useState } from 'react'
import { useRouter } from "next/navigation";
import { FaEdit, FaTrash } from "react-icons/fa"; // Import icons
import { DeleteConfirmation } from '.';
import Link from "next/link";

interface Props extends Post {
    showActions?: boolean;
}

const PostDetail: React.FC<Props> = ({ id, title, category, content, author, comments, showActions = false }) => {
    const router = useRouter();
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

    const handleEdit = () => {
        router.push(`/mypost/edit/${id}`);
    };

    const handleDelete = () => {
        console.log("Deleted Post:", id);
        setIsDeleteOpen(true);
        // You can replace this with an API call to delete the post
    };

    const handleConfirmDelete = async () => {
        try {
            // Make a DELETE request to the server to delete the post
            const apiUrl = process.env.REACT_APP_API_URL || process.env.NEXT_PUBLIC_API_URL;

            const response = await fetch(`${apiUrl}/posts/${id}`, {
                method: 'DELETE',
            });

            // console.log("response",response)

            if (response.ok) {
                // console.log(`Post ${id} deleted`);
                // Optionally, you can redirect the user or update the UI
                setIsDeleteOpen(false);
                window.location.reload()
            } else {
                console.error("Failed to delete the post");
                // Handle error, e.g., show a message to the user
            }
        } catch (error) {
            console.error("An error occurred:", error);
            // Handle network or other errors
        }
    };


    return (
        <>
            <div className='mx-4'>
                <div className='flex items-center w-full'>
                    {/* {id} */}
                    <div className="flex items-center space-x-4">
                        <img
                            src={"/default-avatar.png"}
                            alt={author}
                            className="w-10 h-10 rounded-full border border-gray-300"
                        />
                        <div>
                            <h4 className="font-semibold text-gray-800">{author}</h4>
                        </div>
                    </div>
                    {showActions && (
                        <div className="flex gap-4 ml-auto">
                            <button
                                onClick={handleEdit}
                                className="text-[--green300] hover:text-[--green700]"
                            >
                                <FaEdit />
                            </button>
                            <button
                                onClick={handleDelete}
                                className="text-[--green300] hover:text-[--green700]"
                            >
                                <FaTrash />
                            </button>
                        </div>
                    )}
                </div>
                <div className='mt-2'>
                    {/* <button> */}
                    <span className="text-sm bg-gray-200 text-gray-700 px-2 py-1 rounded-md">{category}</span>
                    {/* </button> */}
                </div>

                <h2 className="text-lg font-bold text-gray-900 mt-4 hover:text-[--gray300] transition">
                    <Link href={`/posts/${id}`}>{title}</Link>
                </h2>
                <p className="text-gray-700 text-sm mt-2 line-clamp-3">{content}</p>

                {/* Comments & Interactions */}
                <div className="flex items-center justify-between mt-4 text-[--gray100] text-sm">
                    <Link href={`/posts/${id}`}>
                        <button className="flex items-center space-x-2 hover:text-[--gray300] transition">
                            <span>💬 {comments} Comments</span>
                        </button>
                    </Link>
                </div>

                {/* Divider Line */}
                <hr className="my-4 border-gray-300" />
            </div>
            <DeleteConfirmation
                isOpen={isDeleteOpen}
                onClose={() => setIsDeleteOpen(false)}
                onConfirm={handleConfirmDelete}
            />
        </>

    )
}

export default PostDetail
