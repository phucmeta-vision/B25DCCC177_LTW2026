import { Outlet } from 'react-router-dom';
import NavBar from './NavBar';

const Layout = () => (
  <div className="app">
    <NavBar />
    <main className="page">
      <Outlet />
    </main>
  </div>
);

export default Layout;
