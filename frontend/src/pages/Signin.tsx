import React, { useContext, useState } from 'react';
import Heading from '../components/Heading';
import SubHeading from '../components/Subheading';
import InputBox from '../components/InputBox';
import Button from '../components/Button';
import BottomWarning from '../components/BottomWarning';
import axios from 'axios';
import { BASE_URL } from '../config';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/user';

const Signin = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      const res = await axios.post(`${BASE_URL}/user/signin`, formData);
      if (res.status === 200) {
        toast.success('Signed in!');
        navigate('/dashboard', { replace: true });
        setUser({ token: res?.data?.token });
      }
    } catch (error) {
      console.error('Signin failed:', error);
      toast.error(error?.response?.data?.message || 'Signin failed!');
    }
  };

  return (
    <div className='bg-slate-300 h-screen flex justify-center'>
      <div className='flex flex-col justify-center'>
        <div className='rounded-lg bg-white w-80 text-center p-2 h-max px-4'>
          <Heading label={'Sign in'} />
          <SubHeading label={'Enter your infromation to login'} />
          <InputBox
            placeholder='johndoe@gmail.com'
            label={'Email'}
            value={formData.username}
            onChange={(value) => handleChange('username', value)}
          />
          <InputBox
            placeholder='123456'
            label={'Password'}
            value={formData.password}
            onChange={(value) => handleChange('password', value)}
          />
          <div className='pt-4'>
            <Button label={'Sign in'} onClick={handleSubmit} />
          </div>
          <BottomWarning
            label={"Don't have an account?"}
            buttonText={'Sign up'}
            to={'/signup'}
          />
        </div>
      </div>
    </div>
  );
};

export default Signin;
