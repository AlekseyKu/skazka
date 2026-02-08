import { NavLink, Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div className="app">
      <main className="app__content">
        <Outlet />
      </main>
      <nav className="app__bottom-nav">
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `nav__item ${isActive ? "nav__item--active" : ""}`
          }
        >
          <span className="nav__icon" aria-hidden>
            <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v3M12 19v3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M2 12h3M19 12h3M4.9 19.1l2.1-2.1M17 7l2.1-2.1" />
            </svg>
          </span>
        </NavLink>
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `nav__item nav__item--primary ${isActive ? "nav__item--active" : ""}`
          }
        >
          <span className="nav__icon" aria-hidden>
            <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">
              <path d="M4 5h11a3 3 0 0 1 3 3v11H7a3 3 0 0 0-3 3V5z" />
              <path d="M7 5v14" />
            </svg>
          </span>
        </NavLink>
        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `nav__item ${isActive ? "nav__item--active" : ""}`
          }
        >
          <span className="nav__icon" aria-hidden>
            <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">
              <circle cx="12" cy="8" r="4" />
              <path d="M4 20c1.6-3.2 4.6-5 8-5s6.4 1.8 8 5" />
            </svg>
          </span>
        </NavLink>
      </nav>
    </div>
  );
}
