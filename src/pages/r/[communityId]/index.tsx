/* eslint-disable react-hooks/exhaustive-deps */
import { GetServerSidePropsContext } from "next";
import * as React from "react";
import { doc, getDoc } from "firebase/firestore";
import { firestore } from "@/src/firebase/clientApp";
import {
  Community,
  communityState,
} from "../../../recoilAtoms/communitiesAtom";
import safeJsonStringify from "safe-json-stringify";
import NotFound from "@/src/components/Community/NotFound";
import CommunityPageHeader from "@/src/components/Community/Header";
import PageContent from "@/src/components/Layout/PageContent";
import CreatePostLink from "@/src/components/Community/CreatePostLink";
import Posts from "@/src/components/Post/Posts";
import { useSetRecoilState } from "recoil";
import About from "@/src/components/Community/About";
interface ICommunityPageProps {
  communityData: Community;
}

const CommunityPage: React.FunctionComponent<ICommunityPageProps> = ({
  communityData,
}) => {
  const setCommunityStateValue = useSetRecoilState(communityState);

  React.useEffect(() => {
    setCommunityStateValue((prev) => ({
      ...prev,
      currentCommunity: communityData,
    }));
  }, [communityData]);

  if (!communityData) return <NotFound />;
  return (
    <>
      <CommunityPageHeader communityData={communityData}></CommunityPageHeader>
      <PageContent>
        <>
          <CreatePostLink />
          <Posts communityData={communityData} />
        </>
        <>
          <About communityData={communityData} />
        </>
      </PageContent>
    </>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  // Getting community data
  try {
    const communityDocRef = doc(
      firestore,
      "communities",
      context.query.communityId as string
    );
    const communityDoc = await getDoc(communityDocRef);
    return {
      props: {
        communityData: communityDoc.exists()
          ? JSON.parse(
              safeJsonStringify({ id: communityDoc.id, ...communityDoc.data() })
            )
          : "",
      }, // will be passed to the page component as props
    };
  } catch (error: any) {
    console.log("getServersideprops error", error);
  }
}

export default CommunityPage;
