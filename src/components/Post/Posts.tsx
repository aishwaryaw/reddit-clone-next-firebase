/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { query, collection, where, getDocs, orderBy } from "firebase/firestore";
import { auth, firestore } from "../../firebase/clientApp";
import { Community } from "@/src/recoilAtoms/communitiesAtom";
import { Post } from "@/src/recoilAtoms/postAtom";
import { Stack } from "@chakra-ui/react";
import PostItem from "./PostItem";
import PostLoader from "./PostLoader";
import { useAuthState } from "react-firebase-hooks/auth";
import usePosts from "@/src/hooks/usePosts";

interface IPostsProps {
  communityData: Community;
}

const Posts: React.FunctionComponent<IPostsProps> = ({ communityData }) => {
  const [user] = useAuthState(auth);
  const [loading, setLoading] = useState(false);
  const {
    postStateValue,
    setPostStateValue,
    onVote,
    onDeletePost,
    onSelectPost,
  } = usePosts();

  const getPosts = async () => {
    setLoading(true);
    // get posts for this community
    try {
      const postsQuery = query(
        collection(firestore, "posts"),
        where("commmunityId", "==", communityData.id),
        orderBy("createdAt", "desc")
      );
      const postsData = await getDocs(postsQuery);
      const posts = postsData.docs.map((post) => ({
        id: post.id,
        ...post.data(),
      }));

      // Store in post state
      setPostStateValue((prev) => ({
        ...prev,
        posts: posts as Post[],
      }));
      console.log(postStateValue.postVotes);
    } catch (error: any) {
      console.log("getPosts error", error.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    getPosts();
  }, [communityData]);

  return (
    <>
      {loading ? (
        <PostLoader />
      ) : (
        <Stack>
          {postStateValue.posts.map((post: Post) => (
            <PostItem
              key={post.id}
              post={post}
              isUserCreator={post.creatorId === user?.uid}
              onSelectPost={onSelectPost}
              onVote={onVote}
              onDeletePost={onDeletePost}
              userVoteValue={
                postStateValue.postVotes.find((vote) => vote.postId === post.id)
                  ?.voteValue
              }
            />
          ))}
        </Stack>
      )}
    </>
  );
};

export default Posts;
