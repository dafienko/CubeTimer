import { Navigate } from 'react-router-dom';
import { useContext } from 'react';

import { UserContext } from './User'

const LoginProtectedRoute = ({shouldBeLoggedIn, children}) => {
	const userdata = useContext(UserContext);

	return (
		shouldBeLoggedIn ? 
			(userdata ? children : <Navigate to="/login"/>) :
			(!userdata ? children : <Navigate to="/"/>)
	);
}
 
export default LoginProtectedRoute;