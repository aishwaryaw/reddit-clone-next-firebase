import { auth, firestore } from "@/src/firebase/clientApp";
import { ModalView } from "@/src/recoilAtoms/authModalAtom";
import { Button, Flex, Text } from "@chakra-ui/react";
import * as React from "react";
import {
  useAuthState,
  useCreateUserWithEmailAndPassword,
} from "react-firebase-hooks/auth";
import InputItem from "../../Layout/InputItem";
import { FIREBASE_ERRORS } from "@/src/firebase/errors";
import { addDoc, collection, doc, getDoc, setDoc } from "firebase/firestore";
import { User } from "firebase/auth";
import { useEffect } from "react";

interface ISignupProps {
  toggleView: (view: ModalView) => void;
}

const Signup: React.FunctionComponent<ISignupProps> = ({ toggleView }) => {
  const [form, setForm] = React.useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [formError, setFormError] = React.useState("");
  const [createUserWithEmailAndPassword, _, loading, error] =
    useCreateUserWithEmailAndPassword(auth);
  const [user] = useAuthState(auth);

  const onChange = ({
    target: { name, value },
  }: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (formError) setFormError("");
    if (!form.email.includes("@")) {
      return setFormError("Please enter a valid email");
    }
    if (form.password !== form.confirmPassword) {
      return setFormError("Passwords do not match");
    }

    // Valid form inputs
    await createUserWithEmailAndPassword(form.email, form.password);
  };

  const createUserDocument = async (user: User) => {
    // User is getting created for the first time
    const userRef = doc(firestore, "users", user.uid);
    if (!(await getDoc(userRef)).exists())
      await setDoc(userRef, JSON.parse(JSON.stringify(user)));
    // await addDoc(
    //   collection(firestore, "users"),
    //   JSON.parse(JSON.stringify(user))
    // );
  };

  useEffect(() => {
    if (user) {
      createUserDocument(user);
    }
  }, [user]);

  return (
    <form onSubmit={onSubmit}>
      <InputItem
        name="email"
        placeholder="email"
        type="text"
        mb={2}
        onChange={onChange}
      />
      <InputItem
        name="password"
        placeholder="password"
        type="password"
        mb={2}
        onChange={onChange}
      />
      <InputItem
        name="confirmPassword"
        placeholder="confirm password"
        type="password"
        onChange={onChange}
      />
      <Text textAlign="center" mt={2} fontSize="10pt" color="red">
        {formError ||
          FIREBASE_ERRORS[error?.message as keyof typeof FIREBASE_ERRORS]}
      </Text>
      <Button
        width="100%"
        height="36px"
        mb={2}
        mt={2}
        type="submit"
        isLoading={loading}
      >
        Sign up
      </Button>
      <Flex justifyContent="center" mb={2}>
        <Text fontSize="9pt" mr={1}>
          Forgot your password?
        </Text>
        <Text
          fontSize="9pt"
          color="blue.500"
          cursor="pointer"
          onClick={() => toggleView("resetPassword")}
        >
          Reset
        </Text>
      </Flex>
      <Flex fontSize="9pt" justifyContent="center">
        <Text mr={1}>New here?</Text>
        <Text
          color="blue.500"
          fontWeight={700}
          cursor="pointer"
          onClick={() => toggleView("login")}
        >
          LOG IN
        </Text>
      </Flex>
    </form>
  );
};

export default Signup;
