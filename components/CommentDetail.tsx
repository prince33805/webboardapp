import { formatDistanceToNow } from 'date-fns'
import React from 'react'

const CommentDetail = ({ id, content, author, createdAt }: Comment) => {
    return (
        <div className='mx-4'>
            <div className='flex items-center space-x-4'>
                {/* {id} */}
                <img
                    src={"/default-avatar.png"}
                    alt={author.id}
                    className="w-10 h-10 rounded-full border border-gray-300"
                />
                <div>
                    <h4 className="font-semibold text-gray-800">{author.username}</h4>
                </div>
                <span className="text-sm text-[--gray300] py-1 rounded-xl">
                    {createdAt ? formatDistanceToNow(new Date(createdAt), { addSuffix: true }) : "No Date"}
                </span>

            </div>
            <div>
                {/* <button>
                    <span className="text-sm bg-gray-200 text-gray-700 px-2 py-1 rounded-md">category</span>
                </button> */}
            </div>

            {/* <h2 className="text-lg font-bold text-gray-900 mt-4">title</h2> */}
            <p className="text-gray-700 text-sm mt-2 line-clamp-3">{content}</p>

            {/* Comments & Interactions */}
            <div className="flex items-center justify-between mt-4 text-gray-600 text-sm">
                <button className="flex items-center space-x-2 hover:text-gray-900 transition">
                    {/* <span>💬 commentsCount Comments</span> */}
                </button>
                {/* <button className="text-blue-600 hover:underline">Read More →</button> */}
            </div>

            {/* Divider Line */}
            <hr className="my-4 border-gray-300" />
        </div>
    )
}

export default CommentDetail
