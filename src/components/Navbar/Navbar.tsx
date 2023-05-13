import { Flex, Image } from "@chakra-ui/react";
import * as React from "react";
import SearchInput from "./SearchInput";
import RightContent from "./RightContent/RightContent";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/src/firebase/clientApp";
import { User } from "firebase/auth";
import Directory from "./Directory";
import { useRouter } from "next/router";

interface INavbarProps {}

const Navbar: React.FunctionComponent<INavbarProps> = (props) => {
  const [user] = useAuthState(auth);
  const router = useRouter();
  return (
    <Flex
      bg="white"
      height="44px"
      padding="6px 12px"
      justifyContent="space-between"
    >
      <Flex
        align="center"
        width={{ base: "40px", md: "auto" }}
        mr={{ base: 0, md: 2 }}
        cursor="pointer"
        onClick={() => {
          router.push("/");
        }}
      >
        <Image src="/images/redditFace.svg" height="30px" alt="Reddit" />
        <Image
          display={{ base: "none", md: "unset" }}
          src="/images/redditText.svg"
          height="46px"
          alt="Reddit"
        />
      </Flex>
      {user && <Directory />}
      <SearchInput user={user} />
      <RightContent user={user as User} />
    </Flex>
  );
};

export default Navbar;
