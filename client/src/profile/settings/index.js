import React, {useContext} from 'react';

import {UserContext} from '../../User';
import './settings.css';
import Theme from './Theme';
import Password from './Password';

const Settings = () => {
	const userdata = useContext(UserContext);

	return ( 
		<div id="settings">
			<h1>Settings</h1>
			<div id='cards'>
				<Theme/>
				<Password/>
			</div>
		</div>
	);
}
 
export default Settings;