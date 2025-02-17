"use client"

import { CommentList } from "@/components";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";

const Post = () => {

  const { id } = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [allComments, setAllComments] = useState<Comment[] | null>([])
  const [authorId, setAuthorId] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [commentText, setCommentText] = useState<string>(""); // Store comment text
  const router = useRouter();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768); // Adjust for mobile screen width
    };

    handleResize(); // Initial check
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);


  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setAuthorId(parsedUser.id); // Set authorId from localStorage user object
    }
    // If no user data is found, redirect to the /sign-in page
    // else {
    //   router.push("/sign-in");
    // }
  }, []);

  useEffect(() => {
    if (!id) return;

    const fetchPost = async () => {
      try {
        const apiUrl = process.env.REACT_APP_API_URL || process.env.NEXT_PUBLIC_API_URL;
        const response = await fetch(`${apiUrl}/posts/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch post");
        }
        const data = await response.json();
        // console.log("data", data)
        setPost(data);
        setAllComments(data.comments || []);
      } catch (error) {
        console.error("Error fetching post:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  if (!post) {
    return <div className="text-center text-red-500">Post not found</div>;
  }

  const handleSubmitComment = async (event: React.FormEvent) => {
    event.preventDefault();

    // Redirect if the user is not logged in
    if (!authorId) {
      alert('Please login before comment')
      router.push(`/sign-in?callbackUrl=${encodeURIComponent(window.location.href)}`);
      return;
    }

    // const commentContent = (event.target as HTMLFormElement).elements.namedItem("comment") as HTMLTextAreaElement;

    if (!commentText) {
      alert("Comment cannot be empty!");
      return;
    }

    try {
      const apiUrl = process.env.REACT_APP_API_URL || process.env.NEXT_PUBLIC_API_URL;

      const response = await fetch(`${apiUrl}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          postId: post?.id,  // Make sure post exists
          authorId: authorId,
          content: commentText,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit comment");
      }

      const newComment = await response.json();

      // Update comments list
      setAllComments((prevComments) => [...(prevComments || []), newComment]);

      // Clear textarea
      // commentText.value = "";
      setCommentText("")

      // Hide comment form
      setShowCommentForm(false);

    } catch (error) {
      console.error("Error submitting comment:", error);
    }
  };

  return (
    <div className="bg-white rounded-lg p-6 transition lg:ml-20">

      <button
        type="button"
        onClick={() => window.history.back()}
        // onClick={() => router.push('/')} // 👈 Navigates to the previous page
        className="text-[--green500] bg-[--green100] hover:bg-[--gray100] focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center me-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
      >
        <svg
          className="w-5 h-5"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 14 10"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M13 5H1m0 0l4-4M1 5l4 4"
          />
        </svg>
        <span className="sr-only">Back</span>
      </button>

      {/* Post Header */}
      <div className="flex items-center space-x-4 mt-6">
        <img
          src="/default-avatar.png"
          alt="User Avatar"
          className="w-10 h-10 rounded-full border border-gray-300"
        />
        <div>
          <h4 className="font-semibold text-gray-800">{post.author.username}</h4>
        </div>
        <span className="text-sm text-[--gray300] py-1 rounded-xl">
          {post.createdAt ? formatDistanceToNow(new Date(post.createdAt), { addSuffix: true }) : "No Date"}
        </span>
      </div>

      <div className="mt-2">
        <span className="text-sm bg-gray-200 text-gray-700 px-2 py-1 rounded-xl">
          {post.category.name}
        </span>
      </div>

      {/* Post Content */}
      <h2 className="text-lg font-bold text-gray-900 mt-4">{post.title}</h2>
      <p className="text-gray-700 text-sm mt-2">
        {post.content}
      </p>

      {/* Comments & Interactions */}
      <div className="flex items-center justify-between mt-4 text-[--gray100] text-sm">
        <button className="flex items-center space-x-2 hover:text-[--gray300] transition">
          <span>💬 {post.comments?.length || 0} Comments</span>
        </button>
        {/* <button className="text-blue-600 hover:underline">Read More →</button> */}
      </div>

      {/* Divider */}
      {/* <hr className="my-4 border-gray-300" /> */}


      {!showCommentForm && (
        <div className="mt-6">
          <button
            type="button"
            onClick={() => setShowCommentForm(!showCommentForm)}
            className="text-green-700 hover:text-white border border-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-xl text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-green-500 dark:text-green-500 dark:hover:text-white dark:hover:bg-green-600 dark:focus:ring-green-800">
            Add Comments
          </button>
        </div>
      )}

      {showCommentForm && !isMobile && (
        <div className="mx-auto bg-white mt-6">
          <form className="space-y-4" onSubmit={handleSubmitComment}>
            <div>
              <textarea
                name="comment"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="w-full p-2 border rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none"
                placeholder="Enter your message"
                rows={4}
              ></textarea>
            </div>

            <button
              type="button"
              onClick={() => setShowCommentForm(false)}
              className="text-green-700 hover:text-white border border-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-xl text-sm px-5 py-2.5 text-center me-2 mb-2">
              Cancel
            </button>

            <button
              type="submit"
              className="bg-green-700 text-white hover:text-white border border-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-xl text-sm px-5 py-2.5 text-center me-2 mb-2"
            >
              Submit
            </button>
          </form>
        </div>
      )}

      {/* Mobile Popup Modal */}
      {showCommentForm && isMobile && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded-lg shadow-lg w-11/12">
            <h2 className="text-lg font-semibold mb-2 ml-1">Add Comment</h2>
            <textarea
              name="comment"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="w-full p-2 border rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none"
              placeholder="Enter your message"
              rows={4}
            ></textarea>

            <div className="flex flex-col justify-end gap-2 mt-4">
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
            </div>

          </div>
        </div>
      )}

      {/* Comments Section  */}
      <CommentList comments={allComments} />

    </div>
  );
};

export default Post;
