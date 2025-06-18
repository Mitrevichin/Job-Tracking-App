import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import {
  HomeLayout,
  Register,
  Login,
  DashBoardLayout,
  Error,
  Landing,
  AddJob,
  AllJobs,
  Stats,
  Profile,
  Admin,
} from './pages';

/*
Actions in React Router are special functions connected to routes that automatically handle form submissions and data changes when a <Form method="post" /> is submitted, without needing manual onSubmit inside the component.
*/
import { action as registerAction } from './pages/Register';
import { action as loginAction } from './pages/Login';
import { action as addJobAction } from './pages/AddJob';

import { loader as dashboardLoader } from './pages/DashboardLayout';

export const checkdefaultTheme = () => {
  const isDarkTheme = localStorage.getItem('darkTheme') === 'true';
  document.body.classList.toggle('dark-theme', isDarkTheme);
  return isDarkTheme;
};

checkdefaultTheme();

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomeLayout />,
    errorElement: <Error />,
    children: [
      {
        index: true,
        element: <Landing />,
      },
      {
        path: 'register',
        element: <Register />,
        action: registerAction,
      },
      {
        path: 'login',
        element: <Login />,
        // The action function always must return something!
        action: loginAction,
      },
      {
        path: 'dashboard',
        element: <DashBoardLayout />,
        // Again this loader function must return something always
        // Loaders are special functions you attach to a route to fetch data BEFORE the page renders.
        loader: dashboardLoader,
        children: [
          {
            index: true,
            element: <AddJob />,
            action: addJobAction,
          },
          {
            path: 'stats',
            element: <Stats />,
          },
          {
            path: 'all-jobs',
            element: <AllJobs />,
          },
          {
            path: 'profile',
            element: <Profile />,
          },
          {
            path: 'admin',
            element: <Admin />,
          },
        ],
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
