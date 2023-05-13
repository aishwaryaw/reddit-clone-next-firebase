import { auth, firestore } from "@/src/firebase/clientApp";
import { Button, Flex, Image, Text } from "@chakra-ui/react";
import * as React from "react";
import { useAuthState, useSignInWithGoogle } from "react-firebase-hooks/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { User } from "firebase/auth";

interface IOAuthButtonsProps {}

const OAuthButtons: React.FunctionComponent<IOAuthButtonsProps> = (props) => {
  const [signInWithGoogle, _, loading, error] = useSignInWithGoogle(auth);
  const [user] = useAuthState(auth);

  const createUserDocument = async (user: User) => {
    // we are not knowing if user is signing in for the first time or logging up, that's why setDoc is used
    const userRef = doc(firestore, "users", user.uid);
    if (!(await getDoc(userRef)).exists())
      await setDoc(userRef, JSON.parse(JSON.stringify(user)));
  };

  React.useEffect(() => {
    if (user) {
      createUserDocument(user);
    }
  }, [user]);

  return (
    <Flex direction="column" mb={4} width="100%">
      <Button
        variant="oauth"
        mb={2}
        onClick={() => signInWithGoogle()}
        isLoading={loading}
      >
        <Image src="/images/googlelogo.png" height="20px" mr={4} alt="Google" />
        Continue with Google
      </Button>
      <Button variant="oauth">Some Other Provider</Button>
      {error && (
        <Text textAlign="center" fontSize="10pt" color="red" mt={2}>
          {error.message}
        </Text>
      )}
    </Flex>
  );
};

export default OAuthButtons;
