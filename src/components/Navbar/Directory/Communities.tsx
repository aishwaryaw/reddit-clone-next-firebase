import * as React from "react";
import CreateCommunityModal from "../../Modal/Community/CreateCommunity";
import { Box, Flex, Icon, MenuItem, Text } from "@chakra-ui/react";
import { useState } from "react";
import { FaReddit } from "react-icons/fa";
import { GrAdd } from "react-icons/gr";
import MenuListItem from "./MenuListItem";
import useCommunityData from "@/src/hooks/useCommunityData";

interface ICommunitiesProps {}

const Communities: React.FunctionComponent<ICommunitiesProps> = (props) => {
  const [open, setOpen] = useState(false);
  const { communityStateValue } = useCommunityData();
  return (
    <>
      <CreateCommunityModal isOpen={open} handleClose={() => setOpen(false)} />
      <Box mt={3} mb={4}>
        <Text pl={3} mb={1} fontSize="7pt" fontWeight={500} color="gray.500">
          MODERATING
        </Text>
        {communityStateValue.myCommunitySnippets
          .filter((mySnippet) => mySnippet.isModerator)
          .map((snippet) => (
            <MenuListItem
              key={snippet.communityId}
              icon={FaReddit}
              displayText={`r/${snippet.communityId}`}
              link={`/r/${snippet.communityId}`}
              iconColor="brand.100"
              imageURL={snippet.imageURL}
            />
          ))}
      </Box>
      <Box mt={3} mb={4}>
        <Text pl={3} mb={1} fontSize="7pt" fontWeight={500} color="gray.500">
          MY COMMUNITIES
        </Text>
        <MenuItem
          width="100%"
          fontSize="10pt"
          _hover={{ bg: "gray.100" }}
          onClick={() => setOpen(true)}
        >
          <Flex align="center">
            <Icon fontSize={20} mr={2} as={GrAdd} />
            Create Community
          </Flex>
        </MenuItem>
        {communityStateValue.myCommunitySnippets.map((snippet) => (
          <MenuListItem
            key={snippet.communityId}
            icon={FaReddit}
            displayText={`r/${snippet.communityId}`}
            link={`/r/${snippet.communityId}`}
            iconColor="blue.500"
            imageURL={snippet.imageURL}
          />
        ))}
      </Box>
    </>
  );
};

export default Communities;
