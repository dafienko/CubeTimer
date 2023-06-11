import {useState, useEffect} from 'react';

import LoginProtectedRoute from "../LoginProtectedRoute";
import useFetch from '../useFetch';
import Logout from '../Logout';

import {LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Line, ResponsiveContainer} from 'recharts';

import './home.css'

const Home = (props) => {
	const SHOW_NUM_SOLVES = 100;

	const {data: userdata, userdataLoading, userdataError} = useFetch('http://localhost:9000/me', {credentials: 'include'});
	const [solveURL, setSolveURL] = useState();
	const {data: solvedata, solvedataLoading, solvedataError} = useFetch(solveURL, {credentials: 'include'});
	const [lineData, setLineData] = useState([]);

	useEffect(() => {
		if (userdata) {
			setSolveURL(`http://localhost:9000/solves/${userdata.id}?num=${SHOW_NUM_SOLVES}`);
		}
	}, [userdata]);

	useEffect(() => {
		if (solvedata) {
			const newdata = solvedata.map(d => {return {time: d.time}});
			
			setLineData(newdata);
		}
	}, [solvedata]);


	const onClick = () => {
		const newData = lineData.slice(lineData.length >= SHOW_NUM_SOLVES ? 1 : 0);

		const t = Math.random() * 20;
		
		newData.push({time: t});
		setLineData(newData);

		fetch(`http://localhost:9000/solves/${userdata.id}`, {
			method: 'POST',
			credentials: 'include',
			headers: {
				'content-type': 'application/json'
			},
			body: JSON.stringify({
				time: t
			})
		});
	}

	return ( 
		<LoginProtectedRoute shouldBeLoggedIn={true}>
			<div id='home'>
				{userdata 
				? 
				<>
					<button onClick={onClick} style={{'zIndex': 10}}>test</button>
					<div id='chart'>
						<ResponsiveContainer width='95%' height='60%'>
							<LineChart width={730} height={250} data={lineData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
								<Line type="monotone" dataKey="time" stroke="#8884d8" isAnimationActive={false} dot={true}/>
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
						<p>Logged in as <b>{userdata.name}</b></p>
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