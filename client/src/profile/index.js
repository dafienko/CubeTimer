import React, {useContext} from 'react';
import {Link, Outlet, useLocation} from 'react-router-dom';

import LoginProtectedRoute from '../LoginProtectedRoute';
import {UserContext} from '../User';
import './profile.css';

const Profile = () => {
	const userdata = useContext(UserContext);
	const location = useLocation();

	return (
		<LoginProtectedRoute shouldBeLoggedIn={true}>
			{userdata && 
			<div id='profile'>
				<div id='banner'>
					<div id='header'>
						<Link to='/' id='home-link'>CubeTimer</Link>
						<p>Hello, <b>{userdata.name}</b></p>
					</div>
					<div id='tabs'>
						<Link className='tab' to='/profile/solves' current={(location.pathname==='/profile/solves').toString()}>Solves</Link>
						<Link className='tab' to='/profile/settings' current={(location.pathname==='/profile/settings').toString()}>Settings</Link>
					</div>
				</div>
				<div id='content'>
					<Outlet />
				</div>
			</div>}
		</LoginProtectedRoute>
	);
};

export default Profile;