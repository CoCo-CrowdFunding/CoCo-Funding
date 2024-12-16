import React from "react";
import { Link } from "react-router-dom";
import { ReactComponent as SmallLogo } from "../asset/main-icon.svg";
import Nav from "./Nav";

const Header = () => {
  return (
    <div className="sticky top-0 z-20">
      <header className="flex  backdrop-blur shadow-md py-2 w-full sticky top-0  items-center bg-gradient-to-t">
        <Link to="/" reloadDocument className="flex items-center mb-4 sm:mb-0">
          <SmallLogo className=" mr-0 flex h-16" />
          <p className=" text-xl font-bold">叩叩 | 公益來上門</p>
        </Link>

        <Nav />
      </header>
    </div>
  );
};

export default Header;
