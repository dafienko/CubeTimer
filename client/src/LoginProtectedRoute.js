import { useCookies } from 'react-cookie';
import { Navigate } from 'react-router-dom';
import { useState, useEffect} from 'react';
import useFetch from './useFetch';

const LoginProtectedRoute = ({shouldBeLoggedIn, children}) => {
	const [cookies, setCookie, removeCookie] = useCookies(['connect.sid']);

	if (cookies['connect.sid']) {
		fetch('http://localhost:9000/validSession', {credentials: 'include'}).then((response) => {
			if (!response.ok) {
				removeCookie('connect.sid');
			}
		});
	}

	return (
		shouldBeLoggedIn ? 
		(cookies["connect.sid"] ? children : <Navigate to="/login"/>) :
		(!cookies["connect.sid"] ? children : <Navigate to="/"/>)
	);
}
 
export default LoginProtectedRoute;