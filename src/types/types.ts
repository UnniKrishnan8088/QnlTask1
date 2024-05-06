import { ReactNode } from "react";

export type FormData = {
  email: string;
  password: string;
  password2?: string;
};

export type ChildrenProps = {
  children: ReactNode;
};
