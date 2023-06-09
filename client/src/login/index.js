import LoginProtectedRoute from "../LoginProtectedRoute";
import { Form } from 'react-bootstrap'

import './login.css';

const Login = () => {
	return (
		<LoginProtectedRoute shouldBeLoggedIn={false}>
			<div id="login">
				<div class="loginOption">
					<h2>Sign In</h2>
					<Form autoComplete="false">
						<input type="text" placeholder="Username" name="username"></input>
						<input type="password" placeholder="Password" name="password"></input>
						<input class="submitButton" type="submit" value="Sign In"></input>
					</Form>
					<button class="oauthButton">
						<img class="oauthIcon" src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"/>
						<p>Sign in with Google</p>
					</button>
					<button class="oauthButton">
						<img class="oauthIcon" src="./github-mark.svg"/>
						<p>Sign in with GitHub</p>
					</button>
				</div>
				<div class="loginOption">
					<h2>Create Account</h2>
					<Form autoComplete="false">
						<input type="text" placeholder="Username" name="username"></input>
						<input type="password" placeholder="Password" name="password"></input>
						<input type="password" placeholder="Confirm Password" name="confirm-password"></input>
						<input class="submitButton" type="submit" value="Sign Up"></input>
					</Form>
				</div>
			</div>
		</LoginProtectedRoute>
	);
}
 
export default Login;