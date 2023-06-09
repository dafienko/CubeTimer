import LoginProtectedRoute from "../LoginProtectedRoute";

const Home = () => {
	return ( 
		<LoginProtectedRoute shouldBeLoggedIn={true}>
			<div>home</div>
		</LoginProtectedRoute>
	);
}
 
export default Home;