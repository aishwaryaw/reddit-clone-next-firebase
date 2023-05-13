import { InputGroup, InputLeftElement, Input, Flex } from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import * as React from "react";
import { User } from "firebase/auth";

interface ISearchInputProps {
  user?: User | null;
}

const SearchInput: React.FunctionComponent<ISearchInputProps> = ({ user }) => {
  return (
    <Flex
      flexGrow={1}
      maxWidth={user ? "auto" : "600px"}
      mr={2}
      alignItems="center"
    >
      <InputGroup>
        <InputLeftElement pointerEvents="none" color="gray.400">
          <SearchIcon mb="2px" />
        </InputLeftElement>
        <Input
          placeholder="Search Reddit"
          fontSize="10pt"
          _placeholder={{ color: "gray.500" }}
          _hover={{
            bg: "white",
            border: "1px solid",
            borderColor: "blue.500",
          }}
          _focus={{
            outline: "none",
            border: "1px solid",
            borderColor: "blue.500",
          }}
          height="34px"
          bg="gray.50"
        />
      </InputGroup>
    </Flex>
  );
};

export default SearchInput;
