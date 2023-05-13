import React from "react";

import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  Flex,
  Icon,
  Menu,
  MenuButton,
  MenuList,
  Text,
  Image,
} from "@chakra-ui/react";
import Communities from "./Communities";
import useDirectory from "@/src/hooks/useDirectory";

type DirectoryProps = {};

const Directory: React.FC<DirectoryProps> = () => {
  const { directoryStateValue, toggleMenuOpen } = useDirectory();
  return (
    <Menu isOpen={directoryStateValue.isOpen}>
      <MenuButton
        cursor="pointer"
        padding="0px 6px"
        borderRadius={4}
        mr={2}
        ml={{ base: 0, md: 2 }}
        _hover={{ outline: "1px solid", outlineColor: "gray.200" }}
        onClick={toggleMenuOpen}
      >
        <Flex
          align="center"
          justify="space-between"
          width={{ base: "auto", lg: "200px" }}
        >
          <Flex align="center">
            {directoryStateValue.selectedMenuItem.imageURL ? (
              <Image
                src={directoryStateValue.selectedMenuItem.imageURL}
                borderRadius="full"
                boxSize="24px"
                mr={2}
                alt="Community Image"
              />
            ) : (
              <Icon
                fontSize={24}
                mr={{ base: 1, md: 2 }}
                color={directoryStateValue.selectedMenuItem.iconColor}
                as={directoryStateValue.selectedMenuItem.icon}
              />
            )}
            <Flex display={{ base: "none", lg: "flex" }}>
              <Text fontWeight={600} fontSize="10pt">
                {directoryStateValue.selectedMenuItem.displayText}
              </Text>
            </Flex>
          </Flex>
          <ChevronDownIcon color="gray.500" />
        </Flex>
      </MenuButton>
      <MenuList>
        <Communities />
      </MenuList>
    </Menu>
  );
};
export default Directory;
