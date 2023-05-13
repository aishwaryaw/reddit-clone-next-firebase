import * as React from "react";
import AuthModal from "../../Modal/Auth";
import { Flex } from "@chakra-ui/react";
import AuthButtons from "./AuthButtons";
import { User } from "firebase/auth";
import Icons from "./Icons";
import MenuWrapper from "./ProfileMenu/MenuWrapper";

interface IRightContentProps {
  user?: User;
}

const RightContent: React.FunctionComponent<IRightContentProps> = ({
  user,
}) => {
  return (
    <>
      <AuthModal />
      <Flex justifyContent="space-between" alignItems="center">
        {user ? <Icons /> : <AuthButtons />}
        <MenuWrapper />
      </Flex>
    </>
  );
};

export default RightContent;
