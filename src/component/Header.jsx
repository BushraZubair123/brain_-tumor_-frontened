import { Link, useLocation, useNavigate } from "react-router-dom";
import { disablePageScroll, enablePageScroll } from "scroll-lock";

import { brainwaveSymbol } from "../assets";
import { navigation } from "../constants";
import Button from "./Button";
import MenuSvg from "../assets/svg/MenuSvg";
import { HamburgerMenu } from "./design/Header";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

const Header = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [openNavigation, setOpenNavigation] = useState(false);

  const toggleNavigation = () => {
    if (openNavigation) {
      setOpenNavigation(false);
      enablePageScroll();
    } else {
      setOpenNavigation(true);
      disablePageScroll();
    }
  };

  const handleClick = () => {
    if (!openNavigation) return;
    enablePageScroll();
    setOpenNavigation(false);
  };

  const handleLogout = () => {
    logout();
    handleClick();
    navigate("/");
  };

  const linkClass = (active) =>
    `block relative font-code text-2xl uppercase text-n-1 transition-colors hover:text-color-1 px-6 py-6 md:py-8 lg:-mr-0.25 lg:text-xs lg:font-semibold ${
      active ? "z-2 lg:text-n-1" : "lg:text-n-1/50"
    } lg:leading-5 lg:hover:text-n-1 xl:px-12`;

  return (
    <div
      className={`fixed top-0 left-0 w-full z-50  border-b border-n-6 lg:bg-n-8/90 lg:backdrop-blur-sm ${
        openNavigation ? "bg-n-8" : "bg-n-8/90 backdrop-blur-sm"
      }`}
    >
      <div className="flex items-center px-5 lg:px-7.5 xl:px-10 max-lg:py-4">
        <Link className="flex items-center gap-3 w-[12rem] xl:mr-8" to="/">
          <img src={brainwaveSymbol} width={40} height={40} alt="TumorTech" />
          <span className="font-semibold text-lg">TumorTech</span>
        </Link>

        <nav
          className={`${
            openNavigation ? "flex" : "hidden"
          } fixed top-[5rem] left-0 right-0 bottom-0 bg-n-8 lg:static lg:flex lg:mx-auto lg:bg-transparent`}
        >
          <div className="relative z-2 flex flex-col items-center justify-center m-auto lg:flex-row">
            {navigation.map((item) =>
              item.url.startsWith("/#") ? (
                <a key={item.id} href={item.url} onClick={handleClick} className={linkClass(false)}>
                  {item.title}
                </a>
              ) : (
                <Link
                  key={item.id}
                  to={item.url}
                  onClick={handleClick}
                  className={linkClass(item.url === pathname)}
                >
                  {item.title}
                </Link>
              )
            )}

            {/* Auth link for mobile menu */}
            {user ? (
              <button onClick={handleLogout} className={`${linkClass(false)} lg:hidden`}>
                Logout
              </button>
            ) : (
              <Link to="/login" onClick={handleClick} className={`${linkClass(false)} lg:hidden`}>
                Login
              </Link>
            )}
          </div>

          <HamburgerMenu />
        </nav>

        {user && (
          <span className="hidden lg:block mr-5 text-sm text-n-3 truncate max-w-[10rem]">
            {user.full_name || user.email}
          </span>
        )}

        {user ? (
          <Button className="hidden lg:flex" onClick={handleLogout}>
            Logout
          </Button>
        ) : (
          <Button className="hidden lg:flex" href="/login">
            Login
          </Button>
        )}

        <Button className="ml-auto lg:hidden" px="px-3" onClick={toggleNavigation}>
          <MenuSvg openNavigation={openNavigation} />
        </Button>
      </div>
    </div>
  );
};

export default Header;
