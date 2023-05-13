/* eslint-disable react-hooks/exhaustive-deps */
import { firestore } from "@/src/firebase/clientApp";
import * as React from "react";
import {
  doc,
  writeBatch,
  serverTimestamp,
  Timestamp,
  increment,
  query,
  collection,
  where,
  orderBy,
  getDocs,
} from "firebase/firestore";
import { Post } from "@/src/recoilAtoms/postAtom";
import { User } from "firebase/auth";
import usePosts from "@/src/hooks/usePosts";
import {
  Flex,
  Stack,
  SkeletonCircle,
  SkeletonText,
  Box,
  Text,
} from "@chakra-ui/react";
import CommentItem, { Comment } from "./CommentItem";
import CommentInput from "./CommentInput";

interface ICommentsProps {
  user: User;
  selectedPost: Post | null;
  communityId: string;
}

const Comments: React.FunctionComponent<ICommentsProps> = ({
  user,
  selectedPost,
  communityId,
}) => {
  const [commentText, setCommentText] = React.useState("");
  const [fetchLoading, setFetchLoading] = React.useState(true);
  const [createLoading, setCreateLoading] = React.useState(false);
  const [comments, setComments] = React.useState<Comment[]>([]);
  const { setPostStateValue } = usePosts();
  const [loadingDeleteId, setLoadingDeleteId] = React.useState("");

  const onCreateComment = async () => {
    setCreateLoading(true);
    try {
      const batch = writeBatch(firestore);
      // create a comment document
      const commentDocRef = doc(collection(firestore, "comments"));
      const newComment: Comment = {
        id: commentDocRef.id,
        creatorId: user.uid,
        creatorDisplayText: user.email!.split("@")[0],
        communityId,
        postId: selectedPost?.id!,
        postTitle: selectedPost?.title!,
        text: commentText,
        createdAt: serverTimestamp() as Timestamp,
      };

      batch.set(commentDocRef, newComment);
      newComment.createdAt = { seconds: Date.now() / 1000 } as Timestamp;
      // update post numberOfComments +1
      const postDocRef = doc(firestore, "posts", selectedPost?.id! as string);
      batch.update(postDocRef, {
        numberOfComments: increment(1),
      });

      await batch.commit();
      // update client recoil state
      setCommentText("");
      setComments((prev) => [newComment, ...prev]);
      setPostStateValue((prev) => ({
        ...prev,
        selectedPost: {
          ...prev.selectedPost,
          numberOfComments: prev.selectedPost?.numberOfComments! + 1,
        } as Post,
      }));
    } catch (error) {
      console.log("onCreateComment error", error);
    }
    setCreateLoading(false);
  };

  const onDeleteComment = async (comment: Comment) => {
    setLoadingDeleteId(comment.id);
    try {
      const batch = writeBatch(firestore);
      // delete a comment document
      const commentDocRef = doc(firestore, "comments", comment.id);

      batch.delete(commentDocRef);

      // update post numberOfComments -1
      const postDocRef = doc(firestore, "posts", selectedPost?.id! as string);
      batch.update(postDocRef, {
        numberOfComments: increment(-1),
      });

      await batch.commit();

      // update client recoil state
      setPostStateValue((prev) => ({
        ...prev,
        selectedPost: {
          ...prev.selectedPost,
          numberOfComments: prev.selectedPost?.numberOfComments! - 1,
        } as Post,
      }));
      setComments((prev) =>
        prev.filter((item: Comment) => item.id !== comment.id)
      );
    } catch (error) {
      console.log("onCreateComment error", error);
    }
    setLoadingDeleteId("");
  };

  const getPostComments = async () => {
    setFetchLoading(true);
    try {
      const commentsQuery = query(
        collection(firestore, "comments"),
        where("postId", "==", selectedPost?.id),
        orderBy("createdAt", "desc")
      );
      const commentDocs = await getDocs(commentsQuery);
      const comments = commentDocs.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setComments(comments as Comment[]);
    } catch (error) {
      console.log("getPostComments error", error);
    }
    setFetchLoading(false);
  };

  React.useEffect(() => {
    if (!selectedPost) return;
    getPostComments();
  }, [selectedPost]);

  return (
    <Box bg="white" borderRadius="0px 0px 4px 4px" p={2}>
      <Flex
        direction="column"
        pl={10}
        pr={4}
        mb={6}
        fontSize="10pt"
        width="100%"
      >
        {!fetchLoading && (
          <CommentInput
            commentText={commentText}
            setCommentText={setCommentText}
            user={user}
            createLoading={createLoading}
            onCreateComment={onCreateComment}
          />
        )}
      </Flex>
      <Stack spacing={6} p={2}>
        {fetchLoading ? (
          <>
            {[0, 1, 2].map((item) => (
              <Box key={item} padding="6" bg="white">
                <SkeletonCircle size="10" />
                <SkeletonText mt="4" noOfLines={2} spacing="4" />
              </Box>
            ))}
          </>
        ) : (
          <>
            {comments.length === 0 ? (
              <Flex
                direction="column"
                justify="center"
                align="center"
                borderTop="1px solid"
                borderColor="gray.100"
                p={20}
              >
                <Text fontWeight={700} opacity={0.3}>
                  No Comments Yet
                </Text>
              </Flex>
            ) : (
              <>
                {comments.map((comment) => (
                  <CommentItem
                    key={comment.id}
                    comment={comment}
                    onDeleteComment={onDeleteComment}
                    loadingDelete={loadingDeleteId === comment.id}
                    userId={user?.uid}
                  />
                ))}
              </>
            )}
          </>
        )}
      </Stack>
    </Box>
  );
};

export default Comments;
