import React, {useContext} from 'react';

import {UserContext} from '../../User';

const Theme = () => {
	const userdata = useContext(UserContext);

	return ( 
		<div className='settings-card' id='theme'>
			<h2>Theme</h2>
			<div className='settings-content'>
				<input type='color'/>
			</div>
		</div>
	);
}
 
export default Theme;