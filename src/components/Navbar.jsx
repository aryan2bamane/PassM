import React from "react";

const Navbar = () => {
  return (
    <nav className="text-white flex items-center justify-between h-20 px-20">
      <div className="logo font-bold text-xl">PassM</div>
      <ul className="nav-items flex items-center justify-around gap-x-5 text-lg">
        <li>
          <a href="/">Home</a>
        </li>
        <li>
          {" "}
          <a href="/about">About</a>
        </li>
        <li>
          {" "}
          <a href="/contact">Contact</a>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
