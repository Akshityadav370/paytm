import React from 'react';
import SendMoney from '../components/SendMoney';
import { useLocation } from 'react-router-dom';

const Send = () => {
  const location = useLocation();
  const userData = location.state?.user;

  return <SendMoney friend={userData} />;
};

export default Send;
