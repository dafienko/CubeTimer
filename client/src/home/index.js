import {useState} from 'react';

import LoginProtectedRoute from "../LoginProtectedRoute";
import useFetch from '../useFetch';
import Logout from '../Logout';

import {LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Line, ResponsiveContainer} from 'recharts';

import './home.css'

const Home = () => {
	const {data, loading, error} = useFetch('http://localhost:9000/me', {credentials: 'include'});

	const [lineData, setLineData] = useState([
		{name: 'A', uv: 12, pv: 1},
		{name: 'B', uv: 13, pv: 10},
		{name: 'C', uv: 14, pv: 5},
		{name: 'D', uv: 15, pv: 8},
		{name: 'E', uv: 16, pv: 20},
	]);

	const onClick = () => {
		console.log('fart');
		
		const newData = lineData.slice(1);
		newData.push({uv: Math.random() * 20, pv: Math.random() * 20});
		// console.log(newData);
		setLineData(newData);
	}

	console.log(lineData);

	return ( 
		<LoginProtectedRoute shouldBeLoggedIn={true}>
			<div id='home'>
				{data 
				? 
				<>
					<button onClick={onClick} style={{'zIndex': 10}}>test</button>
					<div id='chart'>
						<ResponsiveContainer width='95%' height='60%'>
							<LineChart width={730} height={250} data={lineData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
								<Line type="monotone" dataKey="pv" stroke="#8884d8" isAnimationActive={false} dot={true}/>
								<Line type="monotone" dataKey="uv" stroke="#82ca9d" isAnimationActive={false} dot={true}/>
							</LineChart>
						</ResponsiveContainer>
					</div>
					<div id='scramble-info'>
						<button class='scramble-control'>&lt;</button>
						<h2 id='scramble'>L' B L F R2 F2 D2 L D' B2 U2 F2 R2 U' B2 U2 B2 U L2</h2>
						<button class='scramble-control'>&gt;</button>
					</div>

					<div id='time'>
						<h3 id='timer'>0.00</h3>
						<p id='ao5' class='ao'>AO5: 0.00</p>
						<p id='ao12' class='ao'>AO12: 0.00</p>
					</div>

					<div id='user-info'>
						<p>Logged in as <b>{data.name}</b></p>
						<a href='/settings'>Settings</a>
						<Logout/>
					</div>
				</>
				:
				<p>loading</p>
}			</div>
		</LoginProtectedRoute>
	);
}
 
export default Home;