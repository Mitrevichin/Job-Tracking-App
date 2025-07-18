import { useDashboardContext } from '../pages/DashboardLayout';
import links from '../utils/links';
import { NavLink } from 'react-router-dom';

function NavLinks({ isBigSidebar }) {
  const { toggleSidebar, user } = useDashboardContext();

  return (
    <div className='nav-links'>
      {links.map(link => {
        const { text, path, icon } = link;
        const { role } = user;

        if (role !== 'admin' && path === 'admin') return;

        return (
          <NavLink
            to={path}
            key={text}
            className='nav-link'
            // Null here means when the button is clicked nothing happens
            onClick={isBigSidebar ? null : toggleSidebar}
            end
          >
            <span className='icon'>{icon}</span>
            {text}
          </NavLink>
        );
      })}
    </div>
  );
}

export default NavLinks;
