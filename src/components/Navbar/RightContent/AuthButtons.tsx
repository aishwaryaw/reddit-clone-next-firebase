import { authModalState } from "@/src/recoilAtoms/authModalAtom";
import { Button } from "@chakra-ui/react";
import * as React from "react";
import { useSetRecoilState } from "recoil";
import AuthModal from "../../Modal/Auth";

interface IAuthButtonsProps {}

const AuthButtons: React.FunctionComponent<IAuthButtonsProps> = (props) => {
  const setAuthModalState = useSetRecoilState(authModalState);
  return (
    <>
      <Button
        variant="outline"
        height="28px"
        display={{ base: "none", md: "flex" }}
        width={{ base: "70px", md: "110px" }}
        mr="2px"
        onClick={() => setAuthModalState({ open: true, view: "login" })}
      >
        Login
      </Button>

      <Button
        variant="solid"
        height="28px"
        display={{ base: "none", md: "flex" }}
        width={{ base: "70px", md: "110px" }}
        mr={2}
        onClick={() => setAuthModalState({ open: true, view: "signup" })}
      >
        Sign Up
      </Button>
      <AuthModal />
    </>
  );
};

export default AuthButtons;
