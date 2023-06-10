import { useCookies } from 'react-cookie';
import { Navigate } from 'react-router-dom';

const LoginProtectedRoute = ({shouldBeLoggedIn, children}) => {
	const [cookies] = useCookies(['connect.sid']);

	return (
		shouldBeLoggedIn ? 
		(cookies["connect.sid"] ? children : <Navigate to="/login"/>) :
		(!cookies["connect.sid"] ? children : <Navigate to="/"/>)
	);
}
 
export default LoginProtectedRoute;