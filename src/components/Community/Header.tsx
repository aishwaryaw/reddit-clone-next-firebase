import useCommunityData from "@/src/hooks/useCommunityData";
import { Community } from "@/src/recoilAtoms/communitiesAtom";
import { Flex, Icon, Button, Text, Box, Image } from "@chakra-ui/react";
import * as React from "react";
import { FaReddit } from "react-icons/fa";

interface ICommunityPageHeaderProps {
  communityData: Community;
}

const CommunityPageHeader: React.FunctionComponent<
  ICommunityPageHeaderProps
> = ({ communityData }) => {
  const { onJoinOrLeaveCommunity, loading, error, communityStateValue } =
    useCommunityData();
  const isJoined = !!communityStateValue.myCommunitySnippets.find(
    (community) => community.communityId === communityData.id
  );

  return (
    <Flex direction="column" width="100%" height="146px">
      <Box height="50%" bg="blue.400" />
      <Flex justify="center" bg="white" flexGrow={1}>
        <Flex width="95%" maxWidth="860px">
          {communityStateValue.currentCommunity?.imageURL ? (
            <Image
              borderRadius="full"
              boxSize="66px"
              src={communityStateValue.currentCommunity.imageURL}
              alt="Dan Abramov"
              position="relative"
              top={-3}
              color="blue.500"
              border="4px solid white"
            />
          ) : (
            <Icon
              as={FaReddit}
              fontSize={64}
              position="relative"
              top={-3}
              color="blue.500"
              border="4px solid white"
              borderRadius="full"
            />
          )}
          <Flex padding="10px 16px">
            <Flex direction="column" mr={6}>
              <Text fontWeight={800} fontSize="16pt">
                {communityData.id}
              </Text>
              <Text fontWeight={600} fontSize="10pt" color="gray.400">
                r/{communityData.id}
              </Text>
            </Flex>
            <Button
              variant={isJoined ? "outline" : "solid"}
              height="30px"
              pr={6}
              pl={6}
              isLoading={loading}
              onClick={() => onJoinOrLeaveCommunity(communityData, isJoined)}
            >
              {isJoined ? "Joined" : "Join"}
            </Button>
            {error && <Text>{error}</Text>}
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default CommunityPageHeader;
