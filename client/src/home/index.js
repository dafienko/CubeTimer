import {useState, useEffect} from 'react';

import LoginProtectedRoute from "../LoginProtectedRoute";
import useFetch from '../useFetch';
import Logout from '../Logout';

import {LineChart, Line, ResponsiveContainer} from 'recharts';

import './home.css'
import Scramble from './Scramble';
import Timer from './Timer';

function getAO(data, n) {
	if (n > data.length) {
		return '-';
	}

	data = data.slice(data.length - n, data.length);
	let best = data[0];
	let worst = data[0];
	const sum = data.reduce((partial, item) => {
		best = Math.min(best, item);
		worst = Math.max(worst, item);
		return partial + item;
	}, 0);

	return ((sum - (best + worst)) / (n-2)).toFixed(2).toString();
}

const Home = ({}) => {
	const SHOW_NUM_SOLVES = 50;
	const {data: userdata, userdataLoading, userdataError} = useFetch('http://localhost:9000/me', {credentials: 'include'});
	const [solveURL, setSolveURL] = useState();
	const {data: solvedata, solvedataLoading, solvedataError} = useFetch(solveURL, {credentials: 'include'});
	const [lineData, setLineData] = useState([]);
	const [ao5, setAO5] = useState('-');
	const [ao12, setAO12] = useState('-');

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

	useEffect(() => {
		const data = lineData.map(d => d.time);
		setAO5(getAO(data, 5));
		setAO12(getAO(data, 12));
	}, [lineData])

	const onTimerStop = (t) => {
		const newData = lineData.slice(lineData.length >= SHOW_NUM_SOLVES ? 1 : 0);
		
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
					<div id='chart'>
						<ResponsiveContainer width='95%' height='60%'>
							<LineChart data={lineData} margin={{ top: 20, right: 20, left: 20, bottom: 20 }}>
								<Line type="monotone" dataKey="time" stroke="#8884d8" isAnimationActive={false} dot={true}/>
							</LineChart>
						</ResponsiveContainer>
					</div>
					
					<Scramble />

					<Timer onTimerStop={onTimerStop} ao5={ao5} ao12={ao12} />

					<div id='user-info'>
						<p>Logged in as <b>{userdata.name}</b></p>
						<a href='/profile'>Profile</a>
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