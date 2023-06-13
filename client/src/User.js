import React, {useState, useEffect, createContext} from 'react';
import { useCookies } from 'react-cookie';

import useFetchJSON from './hooks/useFetchJSON';
import useFetch from './hooks/useFetch';

const UserContext = createContext(null);

const VALID_SESSION_URL = 'http://localhost:9000/validSession';
const ME_URL = 'http://localhost:9000/me';

const UserProvider = ({children}) => {
	const [cookies, , removeCookie] = useCookies(['connect.sid']);
	const [validSessionURL, setValidSessionURL] = useState(cookies['connect.sid'] && VALID_SESSION_URL);
	const [meURL, setMeURL] = useState(null);
	
	const {response: validSessionResponse, loading: validSessionLoading} = useFetch(validSessionURL, {credentials: 'include'});
	const {data: userdata, loading: userdataLoading} = useFetchJSON(meURL, {credentials: 'include'});


	useEffect(() => {
		if (cookies['connect.sid']) {
			setValidSessionURL(VALID_SESSION_URL);
		} else {
			setValidSessionURL(null);
		}
	}, [cookies]);

	useEffect(() => {
		if (validSessionResponse) {
			if (validSessionResponse.ok) {
				setMeURL(ME_URL);
			} else {
				removeCookie('connect.sid');
				setMeURL(null);
			}
		} else {
			setMeURL(null);
		}
	}, [validSessionResponse]);

	return (
		<UserContext.Provider value={userdata}> 
			{
				(validSessionLoading || userdataLoading || (cookies['connect.sid'] && !userdata)) 
				? 
				<div id="loading">
					Loading
				</div>
				:
				children
			}
		</UserContext.Provider>
	);
};

export {UserContext, UserProvider};