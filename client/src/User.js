import React, {useState, useEffect, useContext, createContext} from 'react';
import { useCookies } from 'react-cookie';

import useFetchJSON from './hooks/useFetchJSON';
import useFetch from './hooks/useFetch';

const UserContext = createContext(null);

const VALID_SESSION_URL = 'http://localhost:9000/validSession';
const ME_URL = 'http://localhost:9000/me';

const UserProvider = ({children}) => {
	const [cookies, _, removeCookie] = useCookies(['connect.sid']);
	const [meURL, setMeURL] = useState(null);
	const [validSessionURL, setValidSessionURL] = useState(null);

	const {data: userdata, loading: userdataLoading, error: userdataError} = useFetchJSON(meURL, {credentials: 'include'});
	const {response: validSessionResponse, loading: validSessionLoading, error: validSessionError} = useFetch(validSessionURL, {credentials: 'include'});

	useEffect(() => {
		if (cookies['connect.sid']) {
			setValidSessionURL(VALID_SESSION_URL);
		} else {
			setValidSessionURL(null);
		}
	});

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
				(validSessionLoading || userdataLoading) 
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