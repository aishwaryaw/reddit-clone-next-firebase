import { Button, Flex, Input, Stack, Textarea } from "@chakra-ui/react";

interface ITextInputProps {
  textInputs: {
    title: string;
    body: string;
  };
  handleChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  loading: boolean;
  handleCreatePost: () => void;
}

const TextInput: React.FunctionComponent<ITextInputProps> = ({
  textInputs,
  handleChange,
  loading,
  handleCreatePost,
}) => {
  return (
    <Stack spacing={3} width="100%">
      <Input
        name="title"
        value={textInputs.title}
        placeholder="Title"
        fontSize="10pt"
        borderRadius={4}
        onChange={handleChange}
        _placeholder={{ color: "gray.500" }}
        _focus={{
          outline: "none",
          bg: "white",
          border: "1px solid",
          borderColor: "black",
        }}
      />
      <Textarea
        name="body"
        value={textInputs.body}
        onChange={handleChange}
        fontSize="10pt"
        borderRadius={4}
        height="100px"
        placeholder="Text (optional)"
        _placeholder={{ color: "gray.500" }}
        _focus={{
          outline: "none",
          bg: "white",
          border: "1px solid",
          borderColor: "black",
        }}
      />
      <Flex justify="flex-end">
        <Button
          height="34px"
          padding="0px 30px"
          disabled={!textInputs.title}
          isLoading={loading}
          onClick={handleCreatePost}
        >
          Post
        </Button>
      </Flex>
    </Stack>
  );
};

export default TextInput;
