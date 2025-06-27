import { Outlet, redirect, useLoaderData, useNavigate } from 'react-router-dom';
import Wrapper from '../assets/wrappers/Dashboard';
import { BigSidebar, Navbar, SmallSidebar } from '../components';
import { createContext, useContext, useState } from 'react';
import { checkdefaultTheme } from '../App';
import customFetch from '../utils/customFetch';
import { toast } from 'react-toastify';

export const loader = async () => {
  try {
    const { data } = await customFetch.get('/users/current-user');
    return data.user;
  } catch (error) {
    return redirect('/');
  }
};

const DashboardContext = createContext();

function DashboardLayout() {
  const user = useLoaderData();
  console.log('Loader data:', useLoaderData());

  const navigate = useNavigate();

  const [showSidebar, setShowSideBar] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(checkdefaultTheme());

  // ✅ This is a safe use of document.body because:
  // - We're only toggling a global class for theming
  // - React does not manage <body>, so manual control is needed

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
    navigate('/');
    await customFetch.get('/auth/logout');
    toast.success('Logging out...');
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
              {/* This context is provided by default by react router 6 and above. It's similar to the manual creation of a context */}
              <Outlet context={{ user }} />
            </div>
          </div>
        </main>
      </Wrapper>
    </DashboardContext.Provider>
  );
}

export const useDashboardContext = () => useContext(DashboardContext);
export default DashboardLayout;
