/* eslint-disable react-hooks/exhaustive-deps */
import PageContent from "@/src/components/Layout/PageContent";
import NewPostForm from "@/src/components/Post/NewPostForm";
import * as React from "react";
import { Box, Flex, Text } from "@chakra-ui/react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/src/firebase/clientApp";
import useCommunityData from "@/src/hooks/useCommunityData";
import About from "@/src/components/Community/About";
import { useSetRecoilState } from "recoil";
import { authModalState } from "@/src/recoilAtoms/authModalAtom";
import AuthButtons from "@/src/components/Navbar/RightContent/AuthButtons";

interface ISubmitProps {}

const Submit: React.FunctionComponent<ISubmitProps> = (props) => {
  const [user] = useAuthState(auth);
  const { communityStateValue } = useCommunityData();
  const setAuthModalState = useSetRecoilState(authModalState);

  React.useEffect(() => {
    if (!user) {
      if (!user) {
        setAuthModalState({ open: true, view: "login" });
        return;
      }
    }
  }, [user]);

  return (
    <PageContent>
      <>
        <Box p="14px 0px" borderBottom="1px solid" borderColor="white">
          <Text>Create a post</Text>
        </Box>
        {user ? (
          <NewPostForm
            user={user}
            communityImageURL={communityStateValue.currentCommunity?.imageURL}
          />
        ) : (
          <Flex
            align="center"
            justify="space-between"
            borderRadius={2}
            border="1px solid"
            borderColor="gray.100"
            p={4}
          >
            <Text fontWeight={600}>Log in or sign up to create a post </Text>
            <AuthButtons />
          </Flex>
        )}
      </>
      {communityStateValue.currentCommunity && (
        <About communityData={communityStateValue.currentCommunity} />
      )}
    </PageContent>
  );
};

export default Submit;
