import { Community, communityState } from "@/src/recoilAtoms/communitiesAtom";
import {
  Flex,
  Icon,
  Stack,
  Divider,
  Text,
  Box,
  Button,
  Image,
  Spinner,
  Input,
} from "@chakra-ui/react";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { RiCakeLine } from "react-icons/ri";
import Link from "next/link";
import moment from "moment";
import * as React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, firestore, storage } from "@/src/firebase/clientApp";
import useSelectFile from "@/src/hooks/useSelectFile";
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import { doc, writeBatch } from "firebase/firestore";
import { FaReddit } from "react-icons/fa";
import useCommunityData from "@/src/hooks/useCommunityData";

interface IAboutProps {
  communityData: Community;
}

const About: React.FunctionComponent<IAboutProps> = ({ communityData }) => {
  const [user] = useAuthState(auth);
  const { selectedFile, onSelectFile } = useSelectFile();
  const [uploadingImage, setUploadingImage] = React.useState(false);
  const selectedFileRef = React.useRef<HTMLInputElement>(null);
  const { communityStateValue, setCommunityStateValue } = useCommunityData();
  const onUpdateImage = async () => {
    if (!selectedFile) return;
    setUploadingImage(true);
    try {
      const imageRef = ref(storage, `communities/${communityData.id}/image`);
      await uploadString(imageRef, selectedFile, "data_url");
      const downloadURL = await getDownloadURL(imageRef);
      const communityDoc = doc(firestore, "communities", communityData.id);
      const userCommunitySnippetDoc = doc(
        firestore,
        `users/${user?.uid}/communitySnippets`,
        communityData.id
      );
      const batch = writeBatch(firestore);
      //   updating imageurl in community document
      batch.update(communityDoc, {
        imageURL: downloadURL,
      });
      //   updating imageurl in user's community snippet
      batch.update(userCommunitySnippetDoc, {
        imageURL: downloadURL,
      });
      await batch.commit();

      setCommunityStateValue((prev) => ({
        ...prev,
        currentCommunity: {
          ...prev.currentCommunity,
          imageURL: downloadURL,
        } as Community,
      }));
    } catch (error: any) {
      console.log("Upload image error", error);
    }
    setUploadingImage(false);
  };
  return (
    <Box position="sticky" top="14px">
      <Flex
        justify="space-between"
        align="center"
        bg="blue.400"
        color="white"
        p={3}
        borderRadius="4px 4px 0px 0px"
      >
        <Text fontSize="10pt" fontWeight={700}>
          About Community
        </Text>
        <Icon as={HiOutlineDotsHorizontal} />
      </Flex>
      <Flex direction="column" p={3} bg="white" borderRadius="0px 0px 4px 4px">
        <Stack>
          <Flex width="100%" p={2} fontSize="10pt" fontWeight={700}>
            <Flex direction="column" flexGrow={1}>
              <Text>
                {communityStateValue.currentCommunity
                  ? communityStateValue.currentCommunity.numberOfMembers.toLocaleString()
                  : communityData.numberOfMembers}
              </Text>
              <Text>Members</Text>
            </Flex>
            <Flex direction="column" flexGrow={1}>
              <Text>1</Text>
              <Text>Online</Text>
            </Flex>
          </Flex>
          <Divider />
          <Flex
            align="center"
            width="100%"
            p={1}
            fontWeight={500}
            fontSize="10pt"
          >
            <Icon as={RiCakeLine} fontSize={18} mr={2} />
            {communityData.createdAt && (
              <Text>
                Created{" "}
                {moment(
                  new Date(communityData.createdAt.seconds * 1000)
                ).format("MMM DD, YYYY")}
              </Text>
            )}
          </Flex>
          {user && (
            <Link href={`/r/${communityData.id}/submit`}>
              <Button mt={3} height="30px">
                Create Post
              </Button>
            </Link>
          )}
          {communityData.creatorId === user?.uid && (
            <>
              <Divider />
              <Stack spacing={1} fontSize="10pt">
                <Text fontWeight={600}>Admin</Text>\
                <Flex align="center" justify="space-between">
                  <Text
                    color="blue.500"
                    cursor="pointer"
                    _hover={{ textDecoration: "underline" }}
                    onClick={() => selectedFileRef.current?.click()}
                  >
                    Change Image
                  </Text>
                  {communityData.imageURL || selectedFile ? (
                    <Image
                      src={selectedFile || communityData.imageURL}
                      borderRadius="full"
                      boxSize="40px"
                      alt="Community Image"
                    />
                  ) : (
                    <Icon
                      as={FaReddit}
                      fontSize={40}
                      color="brand.100"
                      mr={2}
                    />
                  )}
                </Flex>
                {selectedFile &&
                  (uploadingImage ? (
                    <Spinner />
                  ) : (
                    <Text cursor="pointer" onClick={onUpdateImage}>
                      Save Changes
                    </Text>
                  ))}
                <Input
                  id="file-upload"
                  type="file"
                  accept="image/x-png,image/gif,image/jpeg"
                  hidden
                  ref={selectedFileRef}
                  onChange={onSelectFile}
                />
              </Stack>
            </>
          )}
        </Stack>
      </Flex>
    </Box>
  );
};

export default About;
