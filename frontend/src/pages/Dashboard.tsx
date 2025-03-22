import React from 'react';
import Appbar from '../components/AppBar';
import { Users } from '../components/Users';

const Dashboard = () => {
  return (
    <div className='p-6'>
      <Appbar></Appbar>
      <Users />
    </div>
  );
};

export default Dashboard;
