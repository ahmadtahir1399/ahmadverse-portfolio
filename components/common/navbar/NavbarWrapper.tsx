"use client";

import Navbar from "./Navbar";
import HamburgerMenu from "./HamburgerMenu";
import { useMenu } from "@/context/MenuContext";

const NavbarWrapper = () => {
  const { isMenuOpen, setIsMenuOpen } = useMenu();

  return (
    <>
      <Navbar onMenuClick={() => setIsMenuOpen(true)} />
      <HamburgerMenu isOpen={isMenuOpen} setIsOpen={setIsMenuOpen} />
    </>
  );
};

export default NavbarWrapper;
