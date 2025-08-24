import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronDown, Menu, X, User } from "lucide-react";
import DarkLogo from "../assets/imgs/Sergio.svg";
import LightLogo from "../assets/imgs/Sergio_logo_white.png";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "react-i18next";

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  const { user, logout } = useAuth();
  const isLoggedIn = user && user.id;

  const { t, i18n } = useTranslation("common");
  const isArabic = i18n.language === "ar";

  const toggleLanguage = () => {
    i18n.changeLanguage(isArabic ? "en" : "ar");
    setGalleryOpen(false);
  };

  const navItems = [
    { name: t("navbar.home"), path: "/" },
    { name: t("navbar.about"), path: "/about" },
    { name: t("navbar.products"), path: "/products" },
    { name: t("navbar.contact"), path: "/contact" },
    { name: t("navbar.certificate"), path: "/certificate" },
    {
      name: t("navbar.gallery"),
      path: "#",
      dropdown: [
        { name: t("navbar.photos"), path: "/gallery/photos" },
        { name: t("navbar.videos"), path: "/gallery/videos" },
      ],
    },
  ];

  const isActive = (path) => location.pathname === path;
  const isGalleryActive = () => location.pathname.startsWith("/gallery/");

  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY;
      const ninetyVh = window.innerHeight * 0.9;
      setIsScrolled(scrollPos > ninetyVh);
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
  };

  // Update HTML dir for RTL/LTR
  useEffect(() => {
    document.documentElement.dir = isArabic ? "rtl" : "ltr";
  }, [isArabic]);

  return (
    <header
      className={`w-full font-itim fixed top-0 z-50 transition-colors duration-300 ${
        isHomePage
          ? isScrolled
            ? `bg-white text-text shadow-md`
            : `bg-transparent text-white`
          : `bg-white text-text shadow-md`
      }`}
    >
      <div className="flex items-center justify-between gap-4 px-6 py-3 max-w-[1400px] mx-auto">
        {/* Logo */}
        <div>
          <img
            src={isHomePage && !isScrolled ? LightLogo : DarkLogo}
            alt="Logo"
            className="logo-img"
          />
        </div>

        {/* Desktop Menu */}
        <nav
          className={`hidden lg:flex items-center gap-10 text-[16px] font-roboto-regular`}
        >
          {navItems.map((item, idx) =>
            item.dropdown ? (
              <div
                key={idx}
                className="relative"
                onMouseEnter={() => setGalleryOpen(true)}
                onMouseLeave={() => setGalleryOpen(false)}
              >
                <button
                  className={`flex items-center gap-1 hover:text-primary transition ${
                    isGalleryActive() ? "text-primary font-bold" : ""
                  }`}
                >
                  {item.name} <ChevronDown size={16} />
                </button>
                {galleryOpen && (
                  <div className="absolute top-full left-0 bg-white text-text shadow-md py-2 w-40 z-50">
                    {item.dropdown.map((sub, subIdx) => (
                      <Link
                        key={subIdx}
                        to={sub.path}
                        className={`block px-4 py-2 hover:bg-gray-100 ${
                          isActive(sub.path) ? "text-primary font-bold" : ""
                        }`}
                      >
                        {sub.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link
                key={idx}
                to={item.path}
                className={`${
                  isActive(item.path) ? "text-primary font-bold" : ""
                } hover:text-primary transition`}
              >
                {item.name}
              </Link>
            )
          )}

          {/* User Menu */}
          {isLoggedIn ? (
            <div
              className="relative"
              onMouseEnter={() => setUserMenuOpen(true)}
              onMouseLeave={() => setUserMenuOpen(false)}
            >
              <button className="flex items-center gap-1 hover:text-primary transition focus:outline-none">
                <User size={20} />
                <ChevronDown size={16} />
              </button>
              {userMenuOpen && (
                <div className="absolute right-0 bg-white shadow-md py-2 w-40 z-50 rounded-md">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 hover:bg-gray-100 text-text"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    {t("navbar.profile")}
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-text"
                  >
                    {t("navbar.logout")}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className={`hover:text-primary transition ${
                isActive("/login") ? "text-primary font-bold" : ""
              }`}
            >
              {t("navbar.login")}
            </Link>
          )}

          {/* Language Switch + CTA */}
          <button
            onClick={toggleLanguage}
            className="text-sm font-bold hover:text-primary"
          >
            {isArabic ? "EN" : "AR"}
          </button>
          <Link
            to="/quotations"
            className="bg-primary text-white px-5 py-2 rounded-md font-bold text-sm"
          >
            {t("navbar.quotations")}
          </Link>
        </nav>

        {/* Mobile Menu Icon */}
        <button
          className="lg:hidden z-50"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Slide-in Menu */}
      <div
        className={`fixed top-0 ${
          isArabic ? "left-0" : "right-0"
        } h-full w-64 bg-white shadow-md transform transition-transform duration-300 ease-in-out z-40 ${
          mobileOpen
            ? "translate-x-0"
            : isArabic
            ? "-translate-x-full"
            : "translate-x-full"
        } px-5 pt-20 pb-6 space-y-4 text-text text-sm font-roboto-regular`}
      >
        {navItems.map((item, idx) =>
          item.dropdown ? (
            <details key={idx} className="group" open={isGalleryActive()}>
              <summary
                className={`flex items-center justify-between cursor-pointer ${
                  isGalleryActive() ? "text-primary font-bold" : ""
                }`}
              >
                {item.name} <ChevronDown size={16} />
              </summary>
              <div className="ml-4 mt-2 space-y-2">
                {item.dropdown.map((sub, subIdx) => (
                  <Link
                    key={subIdx}
                    to={sub.path}
                    className={`block ${
                      isActive(sub.path) ? "text-primary font-bold" : ""
                    }`}
                  >
                    {sub.name}
                  </Link>
                ))}
              </div>
            </details>
          ) : (
            <Link
              key={idx}
              to={item.path}
              className={`block ${
                isActive(item.path) ? "text-primary font-bold" : ""
              }`}
            >
              {item.name}
            </Link>
          )
        )}

        {/* User Menu in Mobile */}
        {isLoggedIn ? (
          <details className="group">
            <summary className="flex items-center justify-between cursor-pointer">
              <User size={20} />
              <ChevronDown size={16} />
            </summary>
            <div className="ml-4 mt-2 space-y-2">
              <Link
                to="/profile"
                className="block"
                onClick={() => setMobileOpen(false)}
              >
                {t("navbar.profile")}
              </Link>
              <button
                onClick={() => {
                  handleLogout();
                  setMobileOpen(false);
                }}
                className="block text-left w-full"
              >
                {t("navbar.logout")}
              </button>
            </div>
          </details>
        ) : (
          <Link
            to="/login"
            className={`block ${
              isActive("/login") ? "text-primary font-bold" : ""
            }`}
          >
            {t("navbar.login")}
          </Link>
        )}

        <Link
          to="/quotations"
          className="block bg-primary text-white px-4 py-2 rounded-md text-center font-bold"
        >
          {t("navbar.quotations")}
        </Link>

        <button
          onClick={toggleLanguage}
          className="block text-sm font-bold hover:text-primary text-center w-full mt-4"
        >
          {isArabic ? "EN" : "AR"}
        </button>
      </div>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-30"
          onClick={() => setMobileOpen(false)}
        />
      )}
    </header>
  );
};

export default Header;
