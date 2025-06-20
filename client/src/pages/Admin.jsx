import { FaSuitcaseRolling, FaCalendarCheck } from 'react-icons/fa';

import { useLoaderData, redirect } from 'react-router-dom';
import customFetch from '../utils/customFetch';
import Wrapper from '../assets/wrappers/StatsContainer';
import { toast } from 'react-toastify';

export const loader = async () => {
  try {
    const response = await customFetch.get('/users/admin/app-stats');
    return response.data;
  } catch (error) {
    toast.error('You are not authorize to view this page');
    return redirect('/dashboard');
  }
};

function Admin() {
  const { users, jobs } = useLoaderData();

  return (
    <Wrapper>
      <h1>Admin Page</h1>
    </Wrapper>
  );
}

export default Admin;
