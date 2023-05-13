import * as React from "react";
import Navbar from "../Navbar/Navbar";

type LayoutPropTypes = {
  children: any;
};
const Layout: React.FC<LayoutPropTypes> = ({ children }) => {
  return (
    <>
      <Navbar />
      <main>{children}</main>
    </>
  );
};

export default Layout;
