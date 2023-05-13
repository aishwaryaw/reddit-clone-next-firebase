import { atom } from "recoil";

export type ModalView = "login" | "signup" | "resetPassword";

export interface AuthModalState {
  open: boolean;
  view: ModalView;
}

const defaultAuthModalState: AuthModalState = {
  open: false,
  view: "login",
};

export const authModalState = atom({
  key: "authModal",
  default: defaultAuthModalState,
});
