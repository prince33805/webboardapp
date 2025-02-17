import React from 'react'
import { PostDetail } from '.';

interface Props {
  posts: Post[];
  showActions?: boolean;
}

const PostList: React.FC<Props> = ({ posts, showActions = false }) => {
  return (
    <div className="postlist min-h-[1024px]">
      <ul className="post-list">
        {posts.map((post) => (
          <PostDetail key={post.id} {...post} showActions={showActions} />
        ))}
      </ul>
    </div>
  );
};

export default PostList
