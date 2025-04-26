// useNavigation is only for use inside a React Router app. It depends on React Router's internal navigation state.
import { Form, redirect, useNavigation, Link } from 'react-router-dom';
import Wrapper from '../assets/wrappers/RegisterAndLoginPage';
import customFetch from '../utils/customFetch';
import { Logo, FormRow } from '../components';
import { toast } from 'react-toastify';

/* 
React Router action is a way to handle form submissions and server communication directly inside the routing system.
An action is a function you define for a route.
It runs when a form is submitted with <Form method="post" /> (or other HTTP methods like PUT, DELETE).
*/
export const action = async ({ request }) => {
  // When you use formData() — the name attribute of the input is the key in the key-value pairs that get created.
  const formData = await request.formData();
  const data = Object.fromEntries(formData);

  try {
    // We don't need a variable cause in the front-end we won't use the registered user and the server is not sending it. It sends just a message
    await customFetch.post('/auth/register', data);
    // redirect is only used within react-router actions
    toast.success('Registration successful.');
    return redirect('/login');
  } catch (error) {
    console.log(error);
    toast.error(error?.response?.data?.message);
    return error;
  }
};

function Register() {
  const navigation = useNavigation();
  console.log(navigation);
  const isSubmitting = navigation.state === 'submitting';

  return (
    <Wrapper>
      <Form method='post' className='form'>
        <Logo />
        <h4>Register</h4>
        <FormRow type='text' name='name' defaultValue='John' />
        <FormRow
          type='text'
          name='lastName'
          labelText='last name'
          defaultValue='Smith'
        />
        <FormRow type='text' name='location' defaultValue='earth' />
        <FormRow type='email' name='email' defaultValue='john@gmail.com' />
        <FormRow type='password' name='password' defaultValue='secret123' />
        <button className='btn btn-block' disabled={isSubmitting}>
          {isSubmitting ? 'Submitting' : 'Submit'}
        </button>
        <p>
          Already a member?
          <Link to='/login' className='member-btn'>
            Login
          </Link>
        </p>
      </Form>
    </Wrapper>
  );
}

export default Register;
