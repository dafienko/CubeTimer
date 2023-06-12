import React, {useContext} from 'react';

import {UserContext} from '../../User';
import './solves.css';

const Solves = () => {
	const userdata = useContext(UserContext);

	return ( 
		<div id="solves">
			<h1>Solves</h1>
			
		</div>
	);
}
 
export default Solves;