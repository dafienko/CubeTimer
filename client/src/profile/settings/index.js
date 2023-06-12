import React, {useContext} from 'react';

import {UserContext} from '../../User';
import './settings.css';

const Settings = () => {
	const userdata = useContext(UserContext);

	return ( 
		<div id="settings">
			Settings
		</div>
	);
}
 
export default Settings;