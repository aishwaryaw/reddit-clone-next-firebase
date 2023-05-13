import { IconType } from "react-icons";
import { TiHome } from "react-icons/ti";
import { atom } from "recoil";

export interface DirectoryMenuItem {
  displayText: string;
  imageURL?: string;
  link: string;
  icon: IconType;
  iconColor: string;
}

interface DirectoryMenuState {
  isOpen: boolean;
  selectedMenuItem: DirectoryMenuItem;
}

export const defaultMenuItem: DirectoryMenuItem = {
  displayText: "Home",
  icon: TiHome,
  iconColor: "black",
  link: "/",
};

const defaultDirectoryState: DirectoryMenuState = {
  isOpen: false,
  selectedMenuItem: defaultMenuItem,
};

export const directoryMenuState = atom<DirectoryMenuState>({
  key: "directoryMenuState",
  default: defaultDirectoryState,
});
