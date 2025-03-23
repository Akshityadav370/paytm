import { useCallback, useContext, useEffect, useState } from 'react';
import React from 'react';
import Button from './Button';
import { BASE_URL } from '../config';
import { UserContext } from '../context/user';

import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const Users = () => {
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState('');
  const [debouncedFilter, setDebouncedFilter] = useState('');
  const { user } = useContext(UserContext);

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedFilter(filter);
    }, 500);

    return () => {
      clearTimeout(timerId);
    };
  }, [filter]);

  const fetchUser = useCallback(async () => {
    const query = debouncedFilter || '';
    try {
      const res = await axios.get(`${BASE_URL}/user/bulk?filter=${query}`, {
        headers: {
          authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setUsers(res.data.users);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  }, [debouncedFilter]);

  useEffect(() => {
    fetchUser();
  }, [debouncedFilter, fetchUser]);

  return (
    <>
      <div className='font-bold mt-6 text-lg'>Users</div>
      <div className='my-2'>
        <input
          type='text'
          value={filter}
          onChange={handleFilterChange}
          placeholder='Search users...'
          className='w-full px-2 py-1 border rounded border-slate-200'
        ></input>
      </div>
      <div>
        {users.map((user) => (
          <User key={user._id} user={user} />
        ))}
      </div>
    </>
  );
};

function User({ user }) {
  const navigate = useNavigate();

  return (
    <div className='flex justify-between'>
      <div className='flex'>
        <div className='rounded-full h-12 w-12 bg-slate-200 flex justify-center mt-1 mr-2'>
          <div className='flex flex-col justify-center h-full text-xl'>
            {user.firstName[0]}
          </div>
        </div>
        <div className='flex flex-col justify-center h-ful'>
          <div>
            {user.firstName} {user.lastName}
          </div>
        </div>
      </div>

      <div className='flex flex-col justify-center h-ful'>
        <Button
          label={'Send Money'}
          onClick={() => navigate('/send', { state: { user } })}
        />
      </div>
    </div>
  );
}
