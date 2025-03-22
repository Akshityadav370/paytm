import React, { useState } from 'react';
import Heading from '../components/Heading';
import SubHeading from '../components/Subheading';
import InputBox from '../components/InputBox';
import Button from '../components/Button';
import BottomWarning from '../components/BottomWarning';
import axios from 'axios';
import { BASE_URL } from '../config';
import { ToastContainer, toast } from 'react-toastify';
import { replace, useNavigate } from 'react-router-dom';

const Signup = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    password: '',
  });
  const navigate = useNavigate();

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      const res = await axios.post(`${BASE_URL}/user/signup`, formData);
      if (res.status === 200) {
        toast.success('Signed up!');
        navigate('/signin', { replace: true });
      }
    } catch (error) {
      console.error('Signup failed:', error);
      toast.error(error?.response?.data?.message || 'Signup failed!');
    }
  };

  return (
    <div className='bg-slate-300 h-screen flex justify-center'>
      <div className='flex flex-col justify-center'>
        <div className='rounded-lg bg-white w-80 text-center p-2 h-max px-4'>
          <Heading label={'Sign up'} />
          <SubHeading label={'Enter your infromation to create an account'} />
          <InputBox
            placeholder='John'
            label={'First Name'}
            value={formData.firstName}
            onChange={(value) => handleChange('firstName', value)}
          />
          <InputBox
            placeholder='Doe'
            label={'Last Name'}
            value={formData.lastName}
            onChange={(value) => handleChange('lastName', value)}
          />
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
            <Button label={'Sign up'} onClick={handleSubmit} />
          </div>
          <BottomWarning
            label={'Already have an account?'}
            buttonText={'Sign in'}
            to={'/signin'}
          />
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Signup;
