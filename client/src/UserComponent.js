import React from 'react';

const UserComponent = () => {
	const [cookies, setCookie, removeCookie] = useCookies(['connect.sid']);

	if (cookies['connect.sid']) {
		fetch('http://localhost:9000/validSession', {credentials: 'include'}).then((response) => {
			if (!response.ok) {
				removeCookie('connect.sid');
			}
		});
	}

	return (
		<div>
			
		</div>
	);
};

export default UserComponent;