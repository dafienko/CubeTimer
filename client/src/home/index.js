import {useState} from 'react';

import LoginProtectedRoute from "../LoginProtectedRoute";
import useFetch from '../useFetch';

const Home = () => {
	const {data, loading, error} = useFetch('http://localhost:9000/me', {credentials: 'include'});

	const logout = () => {
		fetch("http://localhost:9000/logout", {
			method: "GET",
			redirect: "follow",
			credentials: 'include'
		}).then((res) => {
			if (res.ok) {
				window.location.replace("/login");
			}
		}).catch((err) => {
			console.log(err);
		}).finally(() => {
		});	
	}

	return ( 
		<LoginProtectedRoute shouldBeLoggedIn={true}>
			{data 
			? 
			<>
				<h1>Hello, {data.name} </h1>
				<button onClick={logout}>logout</button>
			</>
			:
			<p>loading</p>
}
		</LoginProtectedRoute>
	);
}
 
export default Home;