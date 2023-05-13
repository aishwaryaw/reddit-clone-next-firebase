/* eslint-disable react-hooks/exhaustive-deps */
import { useRecoilState } from "recoil";
import { communityState } from "../recoilAtoms/communitiesAtom";
import { useEffect } from "react";
import {
  DirectoryMenuItem,
  defaultMenuItem,
  directoryMenuState,
} from "../recoilAtoms/directoryAtom";
import { FaReddit } from "react-icons/fa";
import { useRouter } from "next/router";

const useDirectory = () => {
  const [communityStateValue, setCommunityStateValue] =
    useRecoilState(communityState);
  const [directoryStateValue, setDirectoryStateValue] =
    useRecoilState(directoryMenuState);
  const router = useRouter();

  const onSelectMenuItem = (menuItem: DirectoryMenuItem) => {
    setDirectoryStateValue((prev) => ({
      ...prev,
      selectedMenuItem: menuItem,
    }));
    router.push(menuItem.link);
    if (directoryStateValue.isOpen) {
      toggleMenuOpen();
    }
  };

  const toggleMenuOpen = () => {
    setDirectoryStateValue((prev) => ({
      ...prev,
      isOpen: !directoryStateValue.isOpen,
    }));
  };

  useEffect(() => {
    const { currentCommunity } = communityStateValue;
    if (currentCommunity) {
      setDirectoryStateValue((prev) => ({
        ...prev,
        selectedMenuItem: {
          displayText: `r/${currentCommunity.id}`,
          icon: FaReddit,
          iconColor: "blue.500",
          imageURL: currentCommunity.imageURL,
          link: `/r/${currentCommunity.id}`,
        },
      }));
      return;
    }
    setDirectoryStateValue((prev) => ({
      ...prev,
      selectedMenuItem: defaultMenuItem,
    }));
  }, [communityStateValue.currentCommunity]);

  useEffect(() => {
    const { communityId } = router.query;
    if (!communityId) {
      setCommunityStateValue((prev) => ({
        ...prev,
        currentCommunity: undefined,
      }));
      return;
    }
  }, [router.query]);

  return {
    onSelectMenuItem,
    toggleMenuOpen,
    directoryStateValue,
  };
};

export default useDirectory;
