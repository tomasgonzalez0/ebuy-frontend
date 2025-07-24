import { useState } from "react";
import { NavLink } from "react-router-dom";
import Styles from "./Leftbar.module.css";

export default function Leftbar({ rol }) {
  const [open, setOpen] = useState(false);

  const menuItems = rol === "Employee"
    ? [
        { id: 'home', label: '🏠 Home' },
        { id: 'publish', label: '📦 Publish Product' },
        { id: 'place-order', label: '🛒 Place an order' },
        { id: 'register-sale', label: '💰 Register a Sale' },
        { id: 'view-products', label: '👀 View Products' },
      ]
    : [
        { id: 'home', label: '🏠 Home' },
        { id: 'publish', label: '📦 Publish a Product' },
        { id: 'view-products', label: '👀 View Products' },
      ];

  return (
    <aside className={`${Styles.leftbar} ${open ? Styles.open : ""}`}>
      <button
        className={Styles.menuToggle}
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen(!open)}
      >
        {open ? "✖" : "☰"}
      </button>
      <nav className={Styles.menu} aria-label={`${rol} menu`} tabIndex={open ? 0 : -1}>
        <h5 className={Styles.menuTitle}>{rol} Menu</h5>
        <ul className={Styles.menuList}>
          {menuItems.map(({ id, label }) => (
            <li key={id}>
              <NavLink
                to={`/${rol}/${id}`}
                className={({ isActive }) =>
                  `${Styles.linkItem} ${isActive ? Styles.active : ""}`
                }
                tabIndex={open ? 0 : -1}
              >
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
        <hr className={Styles.divider} />
        <NavLink
          to="/"
          onClick={() => {localStorage.clear();}}
          className={({ isActive }) =>
            `${Styles.linkItem} ${isActive ? Styles.active : ""}`
          }
          tabIndex={open ? 0 : -1}
        >
          ⬅️ Log out
        </NavLink>
      </nav>
    </aside>
  );
}