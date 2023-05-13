import { Alert, AlertIcon, Flex, Icon, Text } from "@chakra-ui/react";
import { useState } from "react";
import { BsLink45Deg, BsMic } from "react-icons/bs";
import { BiPoll } from "react-icons/bi";
import { IoDocumentText, IoImageOutline } from "react-icons/io5";
import TabItem from "./TabItem";
import { User } from "firebase/auth";
import TextInput from "./PostForm/TextInput";
import ImageUpload from "./PostForm/ImageUpload";
import useSelectFile from "@/src/hooks/useSelectFile";
import { Post } from "@/src/recoilAtoms/postAtom";
import { useRouter } from "next/router";
import {
  serverTimestamp,
  Timestamp,
  addDoc,
  collection,
  updateDoc,
} from "firebase/firestore";
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import { firestore, storage } from "@/src/firebase/clientApp";

interface INewPostFormProps {
  user: User;
  communityImageURL?: string;
}

const formTabs: TabItemType[] = [
  {
    title: "Post",
    icon: IoDocumentText,
  },
  {
    title: "Images & Video",
    icon: IoImageOutline,
  },
  {
    title: "Link",
    icon: BsLink45Deg,
  },
  {
    title: "Poll",
    icon: BiPoll,
  },
  {
    title: "Talk",
    icon: BsMic,
  },
];

export type TabItemType = {
  title: string;
  icon: typeof Icon.arguments;
};

const NewPostForm: React.FunctionComponent<INewPostFormProps> = ({
  user,
  communityImageURL,
}) => {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState(formTabs[0].title);

  const [textInputs, setTextInputs] = useState({
    title: "",
    body: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const { selectedFile, setSelectedFile, onSelectFile } = useSelectFile();

  const handleTextInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const {
      target: { name, value },
    } = event;
    setTextInputs((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCreatePost = async () => {
    // create post object
    if (error) setError(false);
    const newPost: Post = {
      commmunityId: router.query.communityId as string,
      communityImageURL: communityImageURL || "",
      creatorId: user.uid,
      creatorDisplayName: user.email!.split("@")[0],
      title: textInputs.title,
      body: textInputs.body,
      numberOfComments: 0,
      voteStatus: 0,
      createdAt: serverTimestamp() as Timestamp,
    };
    setLoading(true);
    try {
      // store post in post document in db
      const postDocRef = await addDoc(collection(firestore, "posts"), newPost);
      // check for selectedFile,  check if image is there, store it in storage
      if (selectedFile) {
        // store in storage => getDownloadURL (return imageURL)
        const imageRef = ref(storage, `posts/${postDocRef.id}/image`);
        await uploadString(imageRef, selectedFile, "data_url");
        const downloadURL = await getDownloadURL(imageRef);
        // update post doc by adding imageURL
        await updateDoc(postDocRef, {
          imageURL: downloadURL,
        });
      }
      // redirect the user back to the communityPage using the router
      router.back();
    } catch (error: any) {
      console.log("handleCreatePost error", error.message);
      setError(true);
    }
    setLoading(false);
  };

  return (
    <Flex direction="column" bg="white" borderRadius={4} mt={2}>
      <Flex width="100%">
        {formTabs.map((tabItem) => (
          <TabItem
            key={tabItem.title}
            item={tabItem}
            selected={tabItem.title === selectedTab}
            setSelectedTab={setSelectedTab}
          />
        ))}
      </Flex>
      <Flex p={4}>
        {selectedTab === "Post" && (
          <TextInput
            textInputs={textInputs}
            handleChange={handleTextInputChange}
            loading={loading}
            handleCreatePost={handleCreatePost}
          />
        )}

        {selectedTab === "Images & Video" && (
          <ImageUpload
            selectedFile={selectedFile}
            setSelectedFile={setSelectedFile}
            onSelectImage={onSelectFile}
            setSelectedTab={setSelectedTab}
          />
        )}
      </Flex>
      {error && (
        <Alert status="error">
          <AlertIcon />
          <Text mr={2}>Error creating post</Text>
        </Alert>
      )}
    </Flex>
  );
};

export default NewPostForm;
