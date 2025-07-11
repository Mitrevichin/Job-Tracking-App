import { FormRow, SubmitBtn } from '../components';
import Wrapper from '../assets/wrappers/DashboardFormPage';
import { redirect, useOutletContext } from 'react-router-dom';
import { Form } from 'react-router-dom';
import customFetch from '../utils/customFetch';
import { toast } from 'react-toastify';

export const action =
  queryClient =>
  async ({ request }) => {
    const formData = await request.formData();

    const file = formData.get('avatar');
    if (file && file.size > 500000) {
      toast.error('Image size too large');
      return null;
    }

    try {
      await customFetch.patch('/users/update-user', formData);
      queryClient.invalidateQueries(['user']);
      toast.success('Profile updated successfully');
      return redirect('/dashboard');
    } catch (error) {
      toast.error(error?.response?.data?.message);
      return null;
    }
  };

function Profile() {
  const { user } = useOutletContext();
  const { name, lastName, email, location } = user;

  return (
    <Wrapper>
      {/* The encType attribute in HTML is short for "encoding type", and it's used in <form> elements to specify how form data should be encoded when it is sent to the server. multipart/form-data: Required when uploading files. Sends form data as separate parts, so binary data (like images) can be sent. 
      Yes, the server will receive raw form data because of encType='multipart/form-data'. Which is a native FormData object — not JSON, not URL-encoded.
      */}
      <Form method='post' className='form' encType='multipart/form-data'>
        <h4 className='form-title'>Profile</h4>

        <div className='form-center'>
          <div className='form-row'>
            <label htmlFor='avatar' className='form-label'>
              Select an image file (max 0.5 MB)
            </label>
            <input
              type='file'
              name='avatar'
              id='avatar'
              accept='image/*'
              className='form-input'
            />
          </div>
          <FormRow type='text' name='name' defaultValue={name} />
          <FormRow
            type='text'
            name='lastName'
            labelText='last name'
            defaultValue={lastName}
          />
          <FormRow type='email' name='email' defaultValue={email} />
          <FormRow type='text' name='location' defaultValue={location} />

          <SubmitBtn formBtn />
        </div>
      </Form>
    </Wrapper>
  );
}

export default Profile;
