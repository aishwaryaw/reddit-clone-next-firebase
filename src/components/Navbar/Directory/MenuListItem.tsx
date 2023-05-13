import useDirectory from "@/src/hooks/useDirectory";
import { Flex, MenuItem, Image, Icon } from "@chakra-ui/react";
import * as React from "react";
import { IconType } from "react-icons";

interface IMenuListItemProps {
  displayText: string;
  icon: IconType;
  imageURL?: string;
  iconColor: string;
  link: string;
}

const MenuListItem: React.FunctionComponent<IMenuListItemProps> = ({
  displayText,
  icon,
  imageURL,
  iconColor,
  link,
}) => {
  const { onSelectMenuItem } = useDirectory();
  return (
    <MenuItem
      width="100%"
      fontSize="10pt"
      _hover={{ bg: "gray.100" }}
      onClick={() =>
        onSelectMenuItem({ displayText, link, icon, iconColor, imageURL })
      }
    >
      <Flex align="center">
        {imageURL ? (
          <Image
            src={imageURL}
            borderRadius="full"
            boxSize="18px"
            mr={2}
            alt="communityImage"
          />
        ) : (
          <Icon as={icon} fontSize={20} mr={2} color={iconColor} />
        )}
        {displayText}
      </Flex>
    </MenuItem>
  );
};

export default MenuListItem;
