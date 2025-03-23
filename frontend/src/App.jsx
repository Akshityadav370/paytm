import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
} from 'react-router-dom';
import Signin from './pages/signin';
import Signup from './pages/signup';
import Dashboard from './pages/dashboard';
import Send from './pages/send';
import { useContext } from 'react';
import { UserContext, UserProvider } from './context/user';

const ProtectedLayout = () => {
  const { user } = useContext(UserContext);
  console.log('hi', user);
  if (!user?.token && user?.token?.length === 0) {
    console.log('hello', user);
    return <Navigate to='/signup' replace />;
  }

  return <Outlet />;
};

function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/signin' element={<Signin />}></Route>
          <Route path='/signup' element={<Signup />}></Route>
          <Route element={<ProtectedLayout />}>
            <Route path='/*' element={<Dashboard />} />
            <Route path='/send' element={<Send />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
}

export default App;
