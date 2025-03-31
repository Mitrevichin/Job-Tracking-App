import Wrapper from '../assets/wrappers/Navbar';
import { FaAlignLeft } from 'react-icons/fa';
import Logo from './Logo';
import { useDashboardContext } from '../pages/DashboardLayout';
import LogoutContainer from './LogoutContainer';
import ThemeContainer from './ThemeContainer';

function Navbar() {
  const { toggleSidebar } = useDashboardContext();

  return (
    <Wrapper>
      <div className='nav-center'>
        <button className='toggle-btn' onClick={toggleSidebar}>
          <FaAlignLeft />
        </button>

        <div>
          <Logo />
          <h4>Dashboard</h4>
        </div>

        <div className='btn-container'>
          <ThemeContainer />
          <LogoutContainer />
        </div>
      </div>
    </Wrapper>
  );
}

export default Navbar;
