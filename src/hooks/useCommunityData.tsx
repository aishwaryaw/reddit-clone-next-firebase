/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import {
  Community,
  CommunitySnippet,
  communityState,
} from "../recoilAtoms/communitiesAtom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, firestore } from "../firebase/clientApp";
import {
  doc,
  writeBatch,
  increment,
  getDocs,
  collection,
  getDoc,
} from "firebase/firestore";
import { authModalState } from "../recoilAtoms/authModalAtom";
import { useRouter } from "next/router";

const useCommunityData = () => {
  const [communityStateValue, setCommunityStateValue] =
    useRecoilState(communityState);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const [user] = useAuthState(auth);
  const setAuthModalState = useSetRecoilState(authModalState);

  // join or leave community
  const onJoinOrLeaveCommunity = (
    communityData: Community,
    isJoined: boolean
  ) => {
    if (error) setError("");
    // is the user signed in?
    // if not => open auth modal
    if (!user) {
      setAuthModalState({ open: true, view: "login" });
      return;
    }
    setLoading(true);
    if (isJoined) {
      leaveCommunity(communityData.id);
      return;
    }

    joinCommunity(communityData);
  };

  const joinCommunity = async (communityData: Community) => {
    // batch write
    try {
      const batch = writeBatch(firestore);
      // 1. create community snippet under users document
      const newSnippet: CommunitySnippet = {
        communityId: communityData.id,
        imageURL: communityData.imageURL || "",
        isModerator: user?.uid === communityData.creatorId,
      };
      batch.set(
        doc(
          firestore,
          `users/${user?.uid}/communitySnippets`,
          communityData.id
        ),

        newSnippet
      );
      // 2. increment numberofmembers in community document
      batch.update(doc(firestore, "communities", communityData.id), {
        numberOfMembers: increment(1),
      });

      await batch.commit();

      // update recoil state - communityState.mySnippets
      setCommunityStateValue((prev) => ({
        ...prev,
        currentCommunity: {
          ...prev.currentCommunity,
          numberOfMembers: prev.currentCommunity?.numberOfMembers! + 1,
        } as Community,
        myCommunitySnippets: [...prev.myCommunitySnippets, newSnippet],
      }));
    } catch (error: any) {
      console.log("joinCommunity error", error);
      setError(error.message);
    }
    setLoading(false);
  };

  const leaveCommunity = async (communityId: string) => {
    // batch write
    try {
      const batch = writeBatch(firestore);
      const communityDocRef = doc(firestore, "communities", communityId);

      // remove communitySnippet from users document
      batch.delete(
        doc(firestore, `users/${user?.uid}/communitySnippets`, communityId)
      );

      // decrement numberOfMemebers in Community document
      batch.update(communityDocRef, {
        numberOfMembers: increment(-1),
      });

      await batch.commit();
      // update recoil state - communityState.mySnippets
      setCommunityStateValue((prev) => ({
        ...prev,
        currentCommunity: {
          ...prev.currentCommunity,
          numberOfMembers: prev.currentCommunity?.numberOfMembers! - 1,
        } as Community,
        myCommunitySnippets: prev.myCommunitySnippets.filter(
          (item) => item.communityId !== communityId
        ),
      }));
    } catch (error: any) {
      console.log("leaveCommunity error", error.message);
      setError(error.message);
    }
    setLoading(false);
  };

  const getMyCommunitySnippets = async () => {
    setLoading(true);
    try {
      // get users snippets
      const userSnippets = await getDocs(
        collection(firestore, `users/${user?.uid}/communitySnippets`)
      );
      const snippets = userSnippets.docs.map((snippet) => ({
        ...snippet.data(),
      }));
      setCommunityStateValue((prev) => ({
        ...prev,
        myCommunitySnippets: snippets as CommunitySnippet[],
        snippetsFetched: true,
      }));
    } catch (error: any) {
      console.log("getMySnippets error", error);
      setError(error.message);
    }
    setLoading(false);
  };

  const getCommunityData = async (communityId: string) => {
    try {
      const communityDoc = doc(firestore, "communities", communityId);
      const communityData = await getDoc(communityDoc);
      if (communityData.exists()) {
        setCommunityStateValue((prev) => ({
          ...prev,
          currentCommunity: {
            id: communityDoc.id,
            ...communityData.data(),
          } as Community,
        }));
      }
    } catch (error: any) {
      console.log("getCommunityData", error);
    }
  };

  useEffect(() => {
    if (!user) {
      setCommunityStateValue((prev) => ({
        ...prev,
        myCommunitySnippets: [],
        snippetsFetched: false,
      }));
      return;
    }
    getMyCommunitySnippets();
  }, [user]);

  useEffect(() => {
    const { communityId } = router.query;
    if (communityId && !communityStateValue.currentCommunity) {
      getCommunityData(communityId as string);
    }
    const snippets = [...communityStateValue.myCommunitySnippets];
    const snippetIndex = snippets.findIndex(
      (snippet: CommunitySnippet) => snippet.communityId === communityId
    );
    if (snippetIndex >= 0) {
      snippets[snippetIndex] = {
        ...snippets[snippetIndex],
        imageURL: communityStateValue.currentCommunity?.imageURL,
      };
    }
    setCommunityStateValue((prev) => ({
      ...prev,
      myCommunitySnippets: snippets,
    }));
  }, [router.query, communityStateValue.currentCommunity]);

  return {
    // data and functions
    communityStateValue,
    setCommunityStateValue,
    onJoinOrLeaveCommunity,
    loading,
    error,
  };
};

export default useCommunityData;
