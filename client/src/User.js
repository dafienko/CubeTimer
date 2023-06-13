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
	});

	useEffect(() => {
		if (validSessionResponse) {
			if (!userdata) {
				if (validSessionResponse.ok) {
					setMeURL(ME_URL);
				} else {
					removeCookie('connect.sid');
					setMeURL(null);
				}
			}
		} else {
			setMeURL(null);
		}
	}, [validSessionResponse]);

	useEffect(() => {
		if (userdata && userdata.colorTheme) {
			const colorTheme = userdata.colorTheme;

			function setVar(varname, val) {
				document.documentElement.style.setProperty(varname, val);
			}

			setVar('--primary-color', colorTheme.primary);
			setVar('--saved-primary-color', colorTheme.primary);

			setVar('--secondary-color', colorTheme.secondary);
			setVar('--saved-secondary-color', colorTheme.secondary);

			setVar('--tertiary-color', colorTheme.tertiary);
			setVar('--saved-tertiary-color', colorTheme.tertiary);

			setVar('--quaternary-color', colorTheme.quaternary);
			setVar('--saved-quaternary-color', colorTheme.quaternary);

			setVar('--timer-color', colorTheme.timer);
			setVar('--saved-timer-color', colorTheme.timer);

			setVar('--ao-color', colorTheme.ao);
			setVar('--saved-ao-color', colorTheme.ao);
		}
	}, [userdata]);

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