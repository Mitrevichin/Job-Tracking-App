import { FormRow, FormRowSelect, SubmitBtn } from '../components';
import Wrapper from '../assets/wrappers/DashboardFormPage';
import { useOutletContext } from 'react-router-dom';
import { JOB_STATUS, JOB_TYPE } from '../../../utils/constants';
import { Form, redirect } from 'react-router-dom';
import { toast } from 'react-toastify';
import customFetch from '../utils/customFetch';

export const action =
  queryClient =>
  async ({ request }) => {
    const formData = await request.formData();
    // This FormData object is not a regular JS object, but an iterable of key-value pairs. The Object.fromEntries() method converts a list of key-value pairs into a plain JavaScript object.
    // Object.entries(obj)	Converts an object into an array of [key, value] pairs
    const data = Object.fromEntries(formData);

    try {
      await customFetch.post('/jobs', data);
      queryClient.invalidateQueries(['jobs']);
      toast.success('Job added successfully');
      return redirect('all-jobs');
    } catch (error) {
      toast.error(error?.response?.data?.message);
      return error;
    }
  };

function AddJob() {
  const { user } = useOutletContext();

  return (
    <Wrapper>
      <Form method='post' className='form'>
        <h4 className='form-title'>Add a job</h4>
        <div className='form-center'>
          <FormRow type='text' name='position' />
          <FormRow type='text' name='company' />
          <FormRow
            type='text'
            labelText='job location'
            name='jobLocation'
            defaultValue={user?.location}
          />
          <FormRowSelect
            labelText='job status'
            name='jobStatus'
            defaultValue={JOB_STATUS.PENDING}
            list={Object.values(JOB_STATUS)}
          />
          <FormRowSelect
            name='jobType'
            labelText='job type'
            defaultValue={JOB_TYPE.FULL_TIME}
            list={Object.values(JOB_TYPE)}
          />
          <SubmitBtn formBtn />
        </div>
      </Form>
    </Wrapper>
  );
}

export default AddJob;
