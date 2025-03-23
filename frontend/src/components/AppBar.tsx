import React, { useContext } from 'react';
import { UserContext } from '../context/user';

const Appbar = () => {
  const { user } = useContext(UserContext);

  return (
    <div className='shadow h-14 flex justify-between'>
      <div className='flex flex-col justify-center h-full ml-4'>PayTM App</div>
      <div className='flex items-center'>
        <div className='flex flex-col justify-center h-full mr-4'>Hello!</div>
        <div className='rounded-full h-fit w-fit bg-slate-200 flex justify-center mt-1 mr-2'>
          <div className='flex flex-col justify-center h-full text-xl'>
            {user[0].firstName} {user[0].lastName}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Appbar;
