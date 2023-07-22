import { ReactNode } from 'react';
import { Link } from 'react-router-dom';

import className from './style.module.scss';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => (
  <div className={className.layout}>
    <ul className={className.nav}>
      <li className={className.navItem}>
        <Link to={'/'} className={className.navLink}>
          Home
        </Link>
      </li>
      <li className={className.navItem}>
        <Link to={'/time'} className={className.navLink}>
          Time
        </Link>
      </li>
      <li className={className.navItem}>
        <Link to={'/data'} className={className.navLink}>
          Data
        </Link>
      </li>
      <li className={className.navItem}>
        <Link to={'/images'} className={className.navLink}>
          Images
        </Link>
      </li>
    </ul>
    <div className={className.container}>{children}</div>
  </div>
);

export default Layout;
