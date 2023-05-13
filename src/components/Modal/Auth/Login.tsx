import { auth } from "@/src/firebase/clientApp";
import { ModalView } from "@/src/recoilAtoms/authModalAtom";
import { Button, Flex, Text } from "@chakra-ui/react";
import * as React from "react";
import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";
import InputItem from "../../Layout/InputItem";
import { FIREBASE_ERRORS } from "@/src/firebase/errors";

interface ILoginProps {
  toggleView: (view: ModalView) => void;
}

const Login: React.FunctionComponent<ILoginProps> = ({ toggleView }) => {
  const [form, setForm] = React.useState({
    email: "",
    password: "",
  });
  const [formError, setFormError] = React.useState("");
  const [signInWithEmailAndPassword, _, loading, error] =
    useSignInWithEmailAndPassword(auth);

  const onChange = ({
    target: { name, value },
  }: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (formError) setFormError("");
    if (!form.email.includes("@")) {
      return setFormError("Please enter a valid email");
    }
    // Valid form inputs
    signInWithEmailAndPassword(form.email, form.password);
  };

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
        Log In
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
          onClick={() => toggleView("signup")}
        >
          SIGN UP
        </Text>
      </Flex>
    </form>
  );
};

export default Login;
