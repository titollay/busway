import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import logo from "../assets/img/logo.png";
import { Link } from "react-router-dom";

const navItems = [
  { href: "/index", icon: "fa-solid fa-gauge", label: "Dashboard" },

  { href: "/index/users", icon: "fa-solid fa-users", label: "Users" },

  {
    href: "/index/categories",
    icon: "fa-solid fa-layer-group",
    label: "Categories",
  },

  {
    href: "/index/products",
    icon: "fa-solid fa-boxes-stacked",
    label: "Products ",
  },

  {
    href: "/index/product",
    icon: "fa-solid fa-box",
    label: "Product ",
  },

  { href: "/index/orders", icon: "fa-solid fa-cart-shopping", label: "Orders" },

  {
    href: "/index/addresses",
    icon: "fa-solid fa-location-dot",
    label: "Addresses",
  },
  { href: "/index/newsletter", icon: "fa-solid fa-paper-plane", label: "Newsletter" },
  { href: "/index/settings", icon: "fa-solid fa-gear", label: "Settings" },
];

export default function SideBar({ activePath = "", collapsed, setCollapsed }) {
  // state removed to be managed by parent IndexAdmin

  return (
    <>
      <style>{`
        .sidebar-root {
          font-family: 'DM Sans', sans-serif;
          background: #0a0a0a;
          border-right: 1px solid rgba(255,255,255,0.05);
          height: 100dvh;
          display: flex;
          flex-direction: column;
          transition: width 0.35s cubic-bezier(0.22,1,0.36,1), transform 0.35s cubic-bezier(0.22,1,0.36,1);
          overflow: hidden;
          flex-shrink: 0;
          position: relative;
          z-index: 100;
        }

        /* Mobile specific */
        @media (max-width: 761px) {
          .sidebar-root {
            position: fixed;
            left: 0;
            top: 0;
            width: 200px !important;
            transform: translateX(-100%);
          }
          .sidebar-root.mobile-open {
            transform: translateX(0);
            box-shadow: 20px 0 50px rgba(0,0,0,0.5);
          }
        }

        /* Nav item */
        .sb-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 11px 16px;
          font-size: 0.78rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.4);
          text-decoration: none;
          border-left: 2px solid transparent;
          transition: all 0.25s ease;
          white-space: nowrap;
          overflow: hidden;
        }

        .sb-item:hover {
          color: rgba(255,255,255,0.9);
          background: rgba(255,255,255,0.04);
          border-left-color: rgba(252,140,6,0.4);
        }

        .sb-item.active {
          color: #FC8C06;
          background: rgba(252,140,6,0.07);
          border-left-color: #FC8C06;
        }

        .sb-item i {
          font-size: 0.9rem;
          width: 18px;
          text-align: center;
          flex-shrink: 0;
          transition: color 0.25s ease;
        }

        .sb-item.active i { color: #FC8C06; }

        /* Collapse toggle */
        .sb-toggle {
          position: absolute;
          top: 50%;
          right: -12px;
          transform: translateY(-50%);
          width: 24px; height: 24px;
          background: #0a0a0a;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          color: rgba(255,255,255,0.4);
          font-size: 0.6rem;
          transition: all 0.25s ease;
          z-index: 10;
        }

        .sb-toggle:hover {
          border-color: #FC8C06;
          color: #FC8C06;
          background: rgba(252,140,6,0.08);
        }

        /* Logout */
        .sb-logout {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 11px 16px;
          font-size: 0.78rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.3);
          cursor: pointer;
          border: none;
          background: transparent;
          width: 100%;
          text-align: left;
          border-top: 1px solid rgba(255,255,255,0.05);
          transition: all 0.25s ease;
          white-space: nowrap;
          overflow: hidden;
        }

        .sb-logout:hover {
          color: #ef4444;
          background: rgba(239,68,68,0.06);
        }

        .sb-logout i {
          font-size: 0.9rem;
          width: 18px;
          text-align: center;
          flex-shrink: 0;
        }

        /* Section label */
        .sb-section {
          font-size: 0.55rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.18);
          padding: 0 18px;
          margin-bottom: 4px;
          white-space: nowrap;
          overflow: hidden;
        }

        /* Divider */
        .sb-divider {
          height: 1px;
          background: rgba(255,255,255,0.05);
          margin: 8px 0;
        }

        /* Backdrop */
        .sb-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.5);
          backdrop-filter: blur(2px);
          z-index: 90;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.3s ease;
        }
        .sb-backdrop.show {
          opacity: 1;
          pointer-events: auto;
        }
      `}</style>

      {/* ── Backdrop for Mobile ── */}
      <div 
        className={`sb-backdrop ${!collapsed ? 'show' : ''}`} 
        style={{ display: typeof window !== 'undefined' && window.innerWidth > 761 ? 'none' : undefined }}
        onClick={() => setCollapsed(true)}
      />

      <motion.div
        className={`sidebar-root ${!collapsed ? 'mobile-open' : ''}`}
        animate={{ width: collapsed ? 56 : 200 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* ── Collapse toggle (Disabled manually per USER edit) ── */}
        {/* <button
          className="sb-toggle"
          onClick={() => setCollapsed(!collapsed)}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <i
            className={`fa-solid ${
              collapsed ? "fa-chevron-right" : "fa-chevron-left"
            }`}
          ></i>
        </button> */}

        {/* ── Logo ── */}
        <div className="flex justify-center py-4 px-2 border-b border-white/5">
          <a href="/">
            <img
              src={logo}
              className="h-9 object-contain"
              alt="logo"
              style={{ minWidth: 24 }}
            />
          </a>
        </div>

        {/* ── Nav ── */}
        <nav className="flex-1 pt-4 overflow-y-auto overflow-x-hidden">
          <AnimatePresence>
            {!collapsed && (
              <motion.p
                className="sb-section mb-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                Main Menu
              </motion.p>
            )}
          </AnimatePresence>

          <ul className="flex flex-col">
            {navItems.map((item) => {
              const isActive = activePath === item.href;
              return (
                <li key={item.href}>
                  <Link
                    to={item.href}
                    className={`sb-item ${isActive ? "active" : ""}`}
                    title={collapsed ? item.label : ""}
                    onClick={() => {
                      // Close sidebar on mobile after clicking a link
                      if (window.innerWidth < 761) setCollapsed(true);
                    }}
                  >
                    <i className={item.icon}></i>
                    <AnimatePresence>
                      {!collapsed && (
                        <motion.span
                          initial={{ opacity: 0, width: 0 }}
                          animate={{ opacity: 1, width: "auto" }}
                          exit={{ opacity: 0, width: 0 }}
                          transition={{ duration: 0.2 }}
                          style={{ overflow: "hidden", display: "block" }}
                        >
                          {item.label}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* ── Logout ── */}
        <div>
          <div className="sb-divider" />
          <button
            className="sb-logout"
            onClick={() => {
              // TODO: clear session/token then redirect
              window.location.href = "/login";
            }}
            title={collapsed ? "Logout" : ""}
          >
            <i className="fa-solid fa-right-from-bracket"></i>
            <AnimatePresence>
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.2 }}
                  style={{ overflow: "hidden", display: "block" }}
                >
                  Logout
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </motion.div>
    </>
  );
}
