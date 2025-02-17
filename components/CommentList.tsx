import React from 'react'
import { CommentDetail } from '.';

interface Props {
    comments: Comment[]|null;
}

const CommentList = ({ comments }: Props) => {
    return (
        <div className='postlist min-h-[1024px]'>
            <ul className="post-list">
                {comments?.map((comment) => (
                    <CommentDetail key={comment.id} {...comment} />
                ))}
            </ul>
        </div>
    )
}

export default CommentList
