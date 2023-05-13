/* eslint-disable react-hooks/exhaustive-deps */
import PostItem from "@/src/components/Post/PostItem";
import { useRouter } from "next/router";
import * as React from "react";
import { doc, getDoc } from "firebase/firestore";
import { auth, firestore } from "@/src/firebase/clientApp";
import usePosts from "@/src/hooks/usePosts";
import { Post } from "@/src/recoilAtoms/postAtom";
import PageContent from "@/src/components/Layout/PageContent";
import { useAuthState } from "react-firebase-hooks/auth";
import useCommunityData from "@/src/hooks/useCommunityData";
import About from "@/src/components/Community/About";
import Comments from "@/src/components/Post/comments/Comments";
import { User } from "firebase/auth";

interface ISinglePostPageProps {}

const SinglePostPage: React.FunctionComponent<ISinglePostPageProps> = (
  props
) => {
  const router = useRouter();
  const { postStateValue, setPostStateValue, onVote, onDeletePost } =
    usePosts();
  const [user] = useAuthState(auth);
  const { communityStateValue } = useCommunityData();

  const fetchPost = async (postId: string) => {
    try {
      const postDocRef = doc(firestore, "posts", postId as string);
      const post = await getDoc(postDocRef);
      if (post.exists()) {
        setPostStateValue((prev) => ({
          ...prev,
          selectedPost: {
            id: post.id,
            ...post.data(),
          } as Post,
        }));
      }
    } catch (error) {
      console.log("fetchPost error", error);
    }
  };

  React.useEffect(() => {
    const { pid } = router.query;
    if (pid && !postStateValue.selectedPost) {
      fetchPost(pid as string);
    }
  }, [router.query, postStateValue.selectedPost]);

  return (
    <PageContent>
      <>
        {postStateValue.selectedPost && (
          <PostItem
            key={postStateValue.selectedPost.id}
            post={postStateValue.selectedPost}
            isUserCreator={postStateValue.selectedPost.creatorId === user?.uid}
            onVote={onVote}
            onDeletePost={onDeletePost}
            userVoteValue={
              postStateValue.postVotes.find(
                (vote) => vote.postId === postStateValue.selectedPost?.id
              )?.voteValue
            }
          />
        )}
        <Comments
          user={user as User}
          selectedPost={postStateValue.selectedPost}
          communityId={postStateValue.selectedPost?.commmunityId as string}
        />
      </>
      <>
        {communityStateValue.currentCommunity && (
          <About communityData={communityStateValue.currentCommunity} />
        )}
      </>
    </PageContent>
  );
};

export default SinglePostPage;
