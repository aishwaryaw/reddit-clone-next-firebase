/* eslint-disable react-hooks/exhaustive-deps */
import { authModalState } from "@/src/recoilAtoms/authModalAtom";
import {
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Flex,
} from "@chakra-ui/react";
import * as React from "react";
import { useRecoilState } from "recoil";
import OAuthButtons from "./OAuthButtons";
import AuthInputs from "./AuthInputs";
import ResetPassword from "./ResetPassword";
import ModalWrapper from "../ModalWrapper";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/src/firebase/clientApp";
import { useEffect } from "react";

interface IAuthModalProps {}

const AuthModal: React.FunctionComponent<IAuthModalProps> = () => {
  const [modalState, setModalState] = useRecoilState(authModalState);
  const [user] = useAuthState(auth);
  const handleClose = () => {
    setModalState((prev) => ({
      ...prev,
      open: false,
    }));
  };

  const toggleView = (view: String) => {
    setModalState((prev) => ({
      ...prev,
      view: view as typeof modalState.view,
    }));
  };

  useEffect(() => {
    if (user) handleClose();
  }, [user]);

  return (
    <ModalWrapper isOpen={modalState.open} onClose={handleClose}>
      <ModalHeader display="flex" flexDirection="column" alignItems="center">
        {modalState.view === "login" && "Login"}
        {modalState.view === "signup" && "Signup"}
        {modalState.view === "resetPassword" && "Reset Password"}
      </ModalHeader>
      <ModalCloseButton />
      <ModalBody
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        pb={6}
      >
        <Flex
          direction="column"
          alignItems="center"
          justifyContent="center"
          width="70%"
        >
          {modalState.view === "login" || modalState.view === "signup" ? (
            <>
              <OAuthButtons />
              OR
              <AuthInputs toggleView={toggleView} />
            </>
          ) : (
            <ResetPassword toggleView={toggleView} />
          )}
        </Flex>
      </ModalBody>
    </ModalWrapper>
  );
};

export default AuthModal;
