import LoginProtectedRoute from '../LoginProtectedRoute';
import { Form } from 'react-bootstrap'

import './login.css';
import useFetch from '../useFetch';
import { useState, useEffect } from 'react';


const Login = () => {
	const [ loading, setLoading ] = useState(false);
	const [ canSignUp, setCanSignUp ] = useState(false);
	const [ passwordsMatch, setPasswordsMatch ] = useState(true);

	useEffect(() => {
		setCanSignUp(passwordsMatch);
	}, [passwordsMatch]);

	const googleAuth = () => {
		window.location.replace('http://localhost:9000/auth/google');
	}

	const githubAuth = () => {
		window.location.replace('http://localhost:9000/auth/github');
	}

	const submitForm = (url, formdata) => {
		setLoading(true);

		fetch(url, {
			method: "POST",
			redirect: "follow",
			headers: {
				'content-type': 'application/json'
			},
			credentials: 'include',
			body: JSON.stringify(Object.fromEntries(formdata))
		}).then((res) => {
			if (res.ok) {
				window.location.replace("/");
			}
		}).catch((err) => {
			console.log(err);
		}).finally(() => {
			setLoading(false);
		});	
	}

	const login = (event) => {
		event.preventDefault();
		if (loading) {
			return false;
		}

		submitForm('http://localhost:9000/auth/basic/login', new FormData(document.getElementById('loginForm')));

		return false;
	}

	const signup = (event) => {
		event.preventDefault();
		if (loading || !canSignUp) {
			return false;
		}

		submitForm('http://localhost:9000/auth/basic', new FormData(document.getElementById('signupForm')));	

		return false;
	}

	const onSignupFormChange = () => {
		const formdata = new FormData(document.getElementById('signupForm'));

		const currentPasswordsMatch = formdata.get('password') === formdata.get('confirm-password');
		document.getElementById('confirm-password').setCustomValidity(currentPasswordsMatch ? '' : 'Passwords must match');
		setPasswordsMatch(currentPasswordsMatch);
	}

	return (
		<LoginProtectedRoute shouldBeLoggedIn={false}>
			<div id='login'>
				<div class='loginOption'>
					<h2>Sign In</h2>
					<Form id='loginForm' onSubmit={login} autoComplete='false' >
						<input type='text' placeholder='Username' name='username'></input>
						<input type='password' placeholder='Password' name='password'></input>
						<input class='submitButton' type='submit' value={loading ? 'Loading' : 'Sign In'}></input>
					</Form>
					<p>or</p>
					<button class='oauthButton' onClick={googleAuth}>
						<img alt='' class='oauthIcon' src='https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg'/>
						<p>Sign in with Google</p>
					</button>
					<button class='oauthButton' onClick={githubAuth}>
						<img alt='' class='oauthIcon' src='./github-mark.svg'/>
						<p>Sign in with GitHub</p>
					</button>
				</div>
				<div class='loginOption'>
					<h2>Sign Up</h2>
					<Form id='signupForm' autoComplete='false' onSubmit={signup} onChange={onSignupFormChange}>
						<input type='text' placeholder='Username' name='username'></input>
						<input type='password' placeholder='Password' name='password'></input>
						<input type='password' placeholder='Confirm Password' name='confirm-password' id='confirm-password'></input>
						<input class='submitButton' type='submit' value={loading ? 'Loading' : 'Sign Up'}></input>
					</Form>
					<p>or</p>
					<button class='oauthButton' onClick={googleAuth}>
						<img alt='' class='oauthIcon' src='https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg'/>
						<p>Sign up with Google</p>
					</button>
					<button class='oauthButton' onClick={githubAuth}>
						<img alt='' class='oauthIcon' src='./github-mark.svg'/>
						<p>Sign up with GitHub</p>
					</button>
				</div>
			</div>
		</LoginProtectedRoute>
	);
}
 
export default Login;