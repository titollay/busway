import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "../assets/logo.png";

const MotionDiv = motion.div;

const navLinks = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Services", href: "#services", page: "/suivi-bus" },
  { label: "About Us", href: "" },
  { label: "Services", href: "/services", page: "/suivi-bus" },
  { label: "Testimonials", href: "#testimonial" },
  { label: "Contact", href: "/contact" },
  
];

export default function NavBar({ className = "" }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // Smart anchor/page navigation
  const handleAnchorClick = (e, link) => {
    const { href, page } = link;
    if (!href.startsWith("#")) return; // regular <Link> handled by router
    e.preventDefault();

    // If this link has a dedicated page (e.g. Categories → /items)
    // and we are NOT already on the home page, go to that page directly.
    if (page && location.pathname !== "/") {
      navigate(page);
      setMenuOpen(false);
      return;
    }

    // Otherwise: scroll to anchor on home page
    if (location.pathname === "/") {
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    } else {
      // Navigate to home first, then scroll
      navigate("/");
      setTimeout(() => {
        const el = document.querySelector(href);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 400);
    }
    setMenuOpen(false);
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setMenuOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const fab = [
    {
      label: "login",
      href: "/login",
      icon: <i className="fa-regular text-amber-50 fa-circle-user"></i>,
    },
  ];

  return (
    <header
      className={`font-['DM_Sans',sans-serif] fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        scrolled
          ? "bg-black/60 backdrop-blur-xl border-b border-white/5 shadow-2xl"
          : "bg-transparent"
      } ${className}`}
    >
      <div className="flex justify-around items-center px-6 sm:px-10 xl:px-14 xl:py-0 py-2">
        {/* Logo */}
        <a href="#">
          <img
            src={logo}
            className="w-26 sm:w-28 xl:w-32 2xl:w-36 h-auto object-contain"
            alt="busway Logo"
          />
        </a>

        <nav className="hidden lg:block">
          <ul className="flex flex-row items-center text-xs xl:text-sm 2xl:text-base md:text-xs gap-2 xl:gap-2 md:gap-4 sm:gap-3 text-shadow-2xs font-bold justify-around space-x-11">
            {navLinks.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  className="relative text-[0.8rem] tracking-[0.12em] uppercase text-white/70 no-underline pb-[3px] transition-colors duration-200 hover:text-blue-500   after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-px after:bg-blue-500 after:transition-all after:duration-300 hover:after:w-full"
                  onClick={(e) => handleAnchorClick(e, link)}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Desktop right */}
        <div className="hidden lg:block">
          <div className="flex items-center gap-2">
            {fab.map((s, i) => (
              <a
                key={i}
                href={s.href}
                onClick={s.onClick || undefined}
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 text-white/70 transition-all duration-300 relative hover:bg-blue-500/10 hover:border-blue-500/40 hover:text-blue-500 hover:-translate-y-[2px]"
                aria-label={s.label}
                style={{ cursor: "pointer" }}
              >
                {s.icon}
              </a>
            ))}
            {location.pathname === "/" && (
              <div className="relative inline-block group px-3 py-2 overflow-hidden rounded-lg border border-blue-500 bg-transparent">
                <span className="absolute top-0 left-0 w-0 h-full bg-blue-500 transition-all duration-500 group-hover:w-full"></span>
                <a
                  className="relative z-10 text-xs xl:text-sm shadow-2xl text-shadow-2xs 2xl:text-base sm:text-sm text-blue-500 font-semibold group-hover:text-white transition-colors"
                  href="/suivi-bus"
                >
                  Suivi Bus
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Hamburger */}
        <button
          className="lg:hidden flex flex-col justify-center items-center gap-[5px] w-9 h-9 relative z-50"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span
            className="block w-[22px] h-[1.5px] bg-white/85 transition-all duration-300 origin-center"
            style={{
              transform: menuOpen ? "translateY(6.5px) rotate(45deg)" : "none",
              background: menuOpen ? "blue" : undefined,
            }}
          />
          <span
            className="block w-[22px] h-[1.5px] bg-white/85 transition-all duration-300 origin-center"
            style={{
              opacity: menuOpen ? 0 : 1,
              transform: menuOpen ? "scaleX(0)" : "none",
            }}
          />
          <span
            className="block w-[22px] h-[1.5px] bg-white/85 transition-all duration-300 origin-center"
            style={{
              transform: menuOpen ? "translateY(-6.5px) rotate(-45deg)" : "none",
              background: menuOpen ? "bleu" : undefined,
            }}
          />
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <MotionDiv
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="lg:hidden text-center overflow-hidden bg-black/90 backdrop-blur-xl border-t border-white/5"
          >
            <div className="px-6 py-4">
              {navLinks.map((link, i) => (
                <MotionDiv
                  key={link.label}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06, duration: 0.3 }}
                >
                  <a
                    href={link.href}
                    className="font-['DM_Sans',sans-serif] text-[0.75rem] tracking-[0.18em] uppercase text-white/65 no-underline py-[14px] border-b border-white/5 block transition-all duration-200 hover:text-[#FC8C06] hover:pl-2"
                    onClick={(e) => {
                      handleAnchorClick(e, link);
                    }}
                  >
                    {link.label}
                  </a>
                </MotionDiv>
              ))}

              <MotionDiv
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: navLinks.length * 0.06 + 0.05 }}
                className="pt-5 pb-2 flex flex-col gap-4 items-center justify-center"
              >
                <a 
                  href="/login" 
                  className="font-['DM_Sans',sans-serif] text-[0.75rem] tracking-[0.18em] uppercase text-white/65 no-underline py-[14px] border-b border-white/5 block transition-all duration-200 hover:text-[#FC8C06] hover:pl-2 w-full text-center"
                >
                  Login
                </a>

                {location.pathname === "/" && (
                  <div className="relative group px-3 py-2 overflow-hidden rounded-lg border w-full text-center block border-blue-500 bg-transparent">
                    <span className="absolute top-0 left-0 w-0 h-full bg-blue-500 transition-all duration-500 group-hover:w-full"></span>
                    <a
                      className="relative z-10 text-xs xl:text-sm shadow-2xl text-shadow-2xs w-full text-center block 2xl:text-base sm:text-sm text-blue-500 font-semibold group-hover:text-white transition-colors"
                      href="/items"
                    >
                     Suivi Bus
                    </a>
                  </div>
                )}
              </MotionDiv>
            </div>
          </MotionDiv>
        )}
      </AnimatePresence>
    </header>
  );
}
