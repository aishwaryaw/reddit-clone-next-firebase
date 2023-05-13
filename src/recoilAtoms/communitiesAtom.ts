import { atom } from "recoil";
import { Timestamp } from "firebase/firestore";

export type PrivacyType = "public" | "private" | "restricted";

export interface Community {
  id: string;
  creatorId: string;
  numberOfMembers: number;
  privacyType: PrivacyType;
  createdAt: Timestamp;
  imageURL: string;
}

export interface CommunitySnippet {
  communityId: string;
  isModerator?: boolean;
  imageURL?: string;
}

interface CommunityState {
  currentCommunity?: Community;
  myCommunitySnippets: CommunitySnippet[];
  snippetsFetched: boolean;
}

const defaultCommunityState: CommunityState = {
  myCommunitySnippets: [],
  snippetsFetched: false,
};

export const communityState = atom<CommunityState>({
  key: "communityState",
  default: defaultCommunityState,
});
