import { Navigate } from 'react-router-dom';
import { useUserDetails } from '../shared/hooks';

export const PrivateRoute = ({ children }) => {
  const { isLogged } = useUserDetails();

  return isLogged ? children : <Navigate to="/auth" replace />;
};
