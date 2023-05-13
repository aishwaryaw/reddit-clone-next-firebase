/* eslint-disable react-hooks/exhaustive-deps */
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { Post, PostVote, postState } from "../recoilAtoms/postAtom";
import {
  doc,
  deleteDoc,
  writeBatch,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { auth, firestore, storage } from "../firebase/clientApp";
import { ref, deleteObject } from "firebase/storage";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import { authModalState } from "../recoilAtoms/authModalAtom";
import { useEffect } from "react";
import { communityState } from "../recoilAtoms/communitiesAtom";

const usePosts = () => {
  const [postStateValue, setPostStateValue] = useRecoilState(postState);
  const setAuthModalState = useSetRecoilState(authModalState);
  const currentCommunity = useRecoilValue(communityState).currentCommunity;
  const router = useRouter();
  const [user] = useAuthState(auth);

  const onVote = async (
    event: React.MouseEvent<SVGElement, MouseEvent>,
    post: Post,
    vote: number,
    communityId: string
  ) => {
    event.stopPropagation();
    // if no user => open auth modal
    if (!user?.uid) {
      setAuthModalState({ open: true, view: "login" });
      return;
    }
    try {
      const { voteStatus } = post; //actual no of votes on post
      const existingVote = postStateValue.postVotes.find(
        (postVote) => postVote.postId === post.id
      ); // vote on the post by currently logged in user
      const updatedPost = { ...post };
      const updatedPosts = [...postStateValue.posts];
      let updatedPostVotes = [...postStateValue.postVotes];
      let voteChange = vote;

      const batch = writeBatch(firestore);
      // New vote
      if (!existingVote) {
        // create a new postVote document
        const postVoteDocRef = doc(
          collection(firestore, "users", `${user?.uid}/postVotes`)
        );
        const newVote: PostVote = {
          id: postVoteDocRef.id,
          postId: post.id!,
          communityId,
          voteValue: vote, //1 or -1
        };
        batch.set(postVoteDocRef, newVote);

        // add/subtract 1 to/from the post.voteStatus
        updatedPost.voteStatus = voteStatus + vote;
        updatedPostVotes = [...updatedPostVotes, newVote];
      }

      // Existing vote - they have voted on the post before
      else {
        const postVoteDocRef = doc(
          firestore,
          "users",
          `${user?.uid}/postVotes/${existingVote.id}`
        );
        // Removing their vote (up => neutral OR down => neutral)
        if (existingVote.voteValue === vote) {
          // add/subtract 1 to/from post.voteStatus
          updatedPost.voteStatus = voteStatus - vote;
          updatedPostVotes = updatedPostVotes.filter(
            (postVote) => postVote.id !== existingVote.id
          );
          // delete the postVote document
          batch.delete(postVoteDocRef);
          voteChange *= -1;
        }

        // Flipping their vote (up => down OR down => up) -3 => -1 , 3 => 1
        else {
          // add/subtract 2 to/from post.voteStatus
          //   const postVoteDocRef = doc(
          //     firestore,
          //     "users",
          //     `${user?.uid}/postVotes`
          //   );
          updatedPost.voteStatus = voteStatus + 2 * vote;
          const postVoteIdx = postStateValue.postVotes.findIndex(
            (postVoteIdx) => postVoteIdx.id === postVoteDocRef.id
          );
          updatedPostVotes[postVoteIdx] = {
            ...existingVote,
            voteValue: vote,
          };
          // updating the existing postVote document
          batch.set(postVoteDocRef, {
            voteValue: vote,
          });
          voteChange = 2 * vote;
        }
      }

      // update state with updated values
      const updatedPostIdx = postStateValue.posts.findIndex(
        (updatedPost) => updatedPost.id === post.id
      );
      updatedPosts[updatedPostIdx] = updatedPost;
      setPostStateValue((prev) => ({
        ...prev,
        postVotes: updatedPostVotes,
        posts: updatedPosts,
      }));

      if (postStateValue.selectedPost) {
        setPostStateValue((prev) => ({
          ...prev,
          selectedPost: updatedPost,
        }));
      }

      // update our post document
      const postDocRef = doc(firestore, "posts", post.id!);
      batch.update(postDocRef, {
        voteStatus: voteStatus + voteChange,
      });

      await batch.commit();
    } catch (error) {
      console.log("onVote error", error);
    }
  };

  const onSelectPost = (post: Post) => {
    setPostStateValue((prev) => ({
      ...prev,
      selectedPost: post,
    }));
    router.push(`/r/${post.commmunityId}/comments/${post.id}`);
  };

  const onDeletePost = async (post: Post): Promise<boolean> => {
    try {
      // check if image, delete if exists
      if (post.imageURL) {
        const imageRef = ref(storage, `posts/${post.id}/image`);
        await deleteObject(imageRef);
      }
      // delete post document from firestore
      const postDocRef = doc(firestore, "posts", post.id!);
      await deleteDoc(postDocRef);

      //update recoil state
      setPostStateValue((prev) => ({
        ...prev,
        posts: prev.posts.filter((item) => item.id !== post.id),
      }));
      return true;
    } catch (error: any) {
      console.log("deletePost error", error);
      return false;
    }
  };

  const getCommunityPostVotes = async (communityId: string) => {
    const postVotesQuery = query(
      collection(firestore, "users", `${user?.uid}/postVotes`),
      where("communityId", "==", communityId)
    );
    const userPostVotes = await getDocs(postVotesQuery);
    const postVotes = userPostVotes.docs.map((postVote) => ({
      id: postVote.id,
      ...postVote.data(),
    }));

    setPostStateValue((prev) => ({
      ...prev,
      postVotes: postVotes as PostVote[],
    }));
  };

  useEffect(() => {
    if (!user || !currentCommunity?.id) return;
    getCommunityPostVotes(currentCommunity.id);
  }, [user, currentCommunity]);

  useEffect(() => {
    if (!user) {
      setPostStateValue((prev) => ({
        ...prev,
        postVotes: [],
      }));
    }
  }, [user]);

  return {
    postStateValue,
    setPostStateValue,
    onVote,
    onSelectPost,
    onDeletePost,
  };
};

export default usePosts;
