import { Flex, Stack, Button, Image } from "@chakra-ui/react";
import { useRef } from "react";

interface IImageUploadProps {
  selectedFile?: string;
  setSelectedFile: (value: string) => void;
  setSelectedTab: (value: string) => void;
  onSelectImage: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const ImageUpload: React.FunctionComponent<IImageUploadProps> = ({
  selectedFile,
  setSelectedFile,
  setSelectedTab,
  onSelectImage,
}) => {
  const selectedFileRef = useRef<HTMLInputElement>(null);
  return (
    <Flex direction="column" justify="center" align="center" width="100%">
      {selectedFile ? (
        <>
          <Image
            src={selectedFile}
            maxWidth="400px"
            maxHeight="400px"
            alt="Post Image"
          />
          <Stack direction="row" mt={4}>
            <Button height="28px" onClick={() => setSelectedTab("Post")}>
              Back to Post
            </Button>
            <Button
              variant="outline"
              height="28px"
              onClick={() => setSelectedFile("")}
            >
              Remove
            </Button>
          </Stack>
        </>
      ) : (
        <Flex
          justify="center"
          align="center"
          p={20}
          border="1px dashed"
          borderColor="gray.200"
          width="100%"
          borderRadius={4}
        >
          <Button
            variant="outline"
            height="28px"
            onClick={() => selectedFileRef.current?.click()}
          >
            Upload
          </Button>
          <input
            ref={selectedFileRef}
            type="file"
            hidden
            onChange={onSelectImage}
          />
          <img src={selectedFile} alt="image" />
        </Flex>
      )}
    </Flex>
  );
};

export default ImageUpload;
