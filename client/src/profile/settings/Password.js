import React, {useContext} from 'react';

import {UserContext} from '../../User';
import { Form } from 'react-bootstrap';

const Password = () => {
	const userdata = useContext(UserContext);

	return ( 
		<div className='settings-card' id='password'>
			<h2>Change Passsword</h2>
			<Form className='settings-content' id='signupForm' autoComplete='false'>
				<input type='password' placeholder='Password' name='password'></input>
				<input type='password' placeholder='Confirm Password' name='confirm-password' id='confirm-password'></input>
				<input className='default-button' type='submit' value='Change Password'></input>
			</Form>
		</div>
	);
}
 
export default Password;