import { ModalView, authModalState } from "@/src/recoilAtoms/authModalAtom";
import { Flex } from "@chakra-ui/react";
import * as React from "react";
import { useRecoilValue } from "recoil";
import Login from "./Login";
import Signup from "./Signup";

interface IAuthInputsProps {
  toggleView: (view: ModalView) => void;
}

const AuthInputs: React.FunctionComponent<IAuthInputsProps> = ({
  toggleView,
}) => {
  const modalState = useRecoilValue(authModalState);
  return (
    <Flex direction="column" alignItems="center" width="100%" mt={4}>
      {modalState.view === "login" ? (
        <Login toggleView={toggleView} />
      ) : (
        <Signup toggleView={toggleView} />
      )}
    </Flex>
  );
};

export default AuthInputs;
