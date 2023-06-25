import React, {useContext, useState} from 'react';

import {UserContext} from '../../User';
import { Form } from 'react-bootstrap';

const Password = () => {
	const userdata = useContext(UserContext);
	const [passwordsMatch, setPasswordsMatch] = useState();
	const [loading, setLoading] = useState();

	const onChange = () => {
		const formdata = new FormData(document.getElementById('change-password-form'));

		const currentPasswordsMatch = formdata.get('confirm-password') === formdata.get('new-password');
		document.getElementById('confirm-password').setCustomValidity(currentPasswordsMatch ? '' : 'Passwords must match');
		setPasswordsMatch(currentPasswordsMatch);
	}

	const onSubmit = (e) => {
		e.preventDefault();

		if (loading || !passwordsMatch) {
			return;
		}
		setLoading(true)

		const formdata = new FormData(document.getElementById('change-password-form'));
		fetch(`${process.env.REACT_APP_API_ORIGIN}/user/${userdata.id}/password`, {
			method: 'PUT',
			headers: {
				'content-type': 'application/json'
			},
			credentials: 'include',
			body: JSON.stringify({
				currentPassword: formdata.get('current-password'),
				newPassword: formdata.get('new-password'),
			})
		}).finally(() => {
			setLoading(false);
		});
	}

	return ( 
		<div className='settings-card' id='password'>
			<h2>Change Password</h2>
			<Form className='settings-content' id='change-password-form' autoComplete='false' onSubmit={onSubmit} onChange={onChange}>
				<input type='password' placeholder='Current Password' name='current-password'></input>
				<input type='password' placeholder='New Password' name='new-password'></input>
				<input type='password' placeholder='Confirm New Password' name='confirm-password' id='confirm-password'></input>
				<input className='default-button' type='submit' value={loading ? 'Loading...' : 'Change Password'}></input>
			</Form>
		</div>
	);
}
 
export default Password;