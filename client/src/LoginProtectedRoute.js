import { Navigate } from 'react-router-dom';
import { useContext } from 'react';

import {UserContext} from './User'

const LoginProtectedRoute = ({shouldBeLoggedIn, children}) => {
	const user = useContext(UserContext);

	return (
		shouldBeLoggedIn ? 
			(user ? children : <Navigate to="/login"/>) :
			(!user ? children : <Navigate to="/"/>)
	);
}
 
export default LoginProtectedRoute;