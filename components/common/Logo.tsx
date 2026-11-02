import Image from "next/image";
import Link from "next/link";
import React from "react";

const Logo = () => {
  return (
    <div>
      <Link
        href="/"
        className="text-white text-xl font-bold hover:text-blue transition-colors duration-300"
      >
        <Image
          src={"/assets/Logo/ahmad-tahir-logo.png"}
          alt={"Ahmad Tahir - home"}
          width={120}
          height={35}
        />
      </Link>
    </div>
  );
};

export default Logo;
