import { Form, redirect, useNavigation, Link } from 'react-router-dom';
import Wrapper from '../assets/wrappers/RegisterAndLoginPage';
import customFetch from '../utils/customFetch';
import { Logo, FormRow } from '../components';

export const action = async ({ request }) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);

  try {
    // We don't need a variable cause in the front-end we won't use the registered user and the server is not sending it. It sends just a message
    await customFetch.post('/auth/register', data);
    // redirect is only used within react-router actions
    return redirect('/login');
  } catch (error) {
    console.log(error);
    return error;
  }
};

function Register() {
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
        <button className='btn btn-block'>Submit</button>
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
