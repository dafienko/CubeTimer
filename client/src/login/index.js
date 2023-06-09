import LoginProtectedRoute from "../LoginProtectedRoute";
import { Form } from 'react-bootstrap'

const Login = () => {
	return (
		<LoginProtectedRoute shouldBeLoggedIn={false}>
			<div>
				<h2>Sign In</h2>
				<Form autoComplete="false">
					<div>
						<label for="username">Username: </label>
						<input type="text" name="username"></input>
					</div>
					<div>
						<label for="password">Password: </label>
						<input type="password" name="password"></input>
					</div>
					<input type="submit" value="Sign In"></input>
				</Form>
				<div>
					<button>Login with Google</button>
					<button>Login with Github</button>
				</div>
			</div>
			<div>
				<h2>Create Account</h2>
				<Form autoComplete="false">
					<div>
						<label for="username">Username: </label>
						<input type="text" name="username"></input>
					</div>
					<div>
						<label for="password">Password: </label>
						<input type="password" name="password"></input>
					</div>
					<div>
						<label for="confirm-password">Confirm Password: </label>
						<input type="password" name="confirm-password"></input>
					</div>
					<input type="submit" value="Sign Up"></input>
				</Form>
			</div>
		</LoginProtectedRoute>
	);
}
 
export default Login;