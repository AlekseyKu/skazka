import { NavLink, Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div className="app">
      <main className="app__content">
        <Outlet />
      </main>
      <nav className="app__bottom-nav">
        <NavLink to="/" end>
          Главная
        </NavLink>
        <NavLink to="/collection">Коллекция</NavLink>
        <NavLink to="/profile">Профиль</NavLink>
        <NavLink to="/settings">Настройки</NavLink>
      </nav>
    </div>
  );
}
