import { Outlet } from 'react-router-dom';
import Wrapper from '../assets/wrappers/Dashboard';
import { BigSidebar, Navbar, SmallSidebar } from '../components';
import { createContext, useContext, useState } from 'react';
import { checkdefaultTheme } from '../App';

const DashboardContext = createContext();

function DashboardLayout() {
  // temporary
  const user = { name: 'John' };

  const [showSidebar, setShowSideBar] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(checkdefaultTheme());

  function toggleDarkTheme() {
    // Using this way because this variable is gonna be used several times
    const newDarkTheme = !isDarkTheme;
    setIsDarkTheme(newDarkTheme);

    document.body.classList.toggle('dark-theme', newDarkTheme);
    localStorage.setItem('darkTheme', newDarkTheme);
  }

  function toggleSidebar() {
    setShowSideBar(showSidebar => !showSidebar);
  }

  async function logoutUser() {
    console.log('User logged out!');
  }

  return (
    <DashboardContext.Provider
      value={{
        user,
        showSidebar,
        isDarkTheme,
        toggleSidebar,
        toggleDarkTheme,
        logoutUser,
      }}
    >
      <Wrapper>
        <main className='dashboard'>
          <SmallSidebar />
          <BigSidebar />
          <div>
            <Navbar />
            <div className='dashboard-page'>
              <Outlet />
            </div>
          </div>
        </main>
      </Wrapper>
    </DashboardContext.Provider>
  );
}

export const useDashboardContext = () => useContext(DashboardContext);
export default DashboardLayout;
