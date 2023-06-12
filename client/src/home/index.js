import {useState, useEffect, useContext} from 'react';
import LoginProtectedRoute from "../LoginProtectedRoute";
import {LineChart, Line, ResponsiveContainer} from 'recharts';

import useFetch from '../hooks/useFetchJSON';
import Logout from '../Logout';
import Scramble from './Scramble';
import Timer from './Timer';
import {UserContext} from '../User';
import './home.css'
import { Link } from 'react-router-dom';

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
	
	const userdata = useContext(UserContext);
	const [solveURL, setSolveURL] = useState();
	const {data: solvedata, solvedataLoading, solvedataError} = useFetch(solveURL, {credentials: 'include'});
	const [lineData, setLineData] = useState([]);
	
	const [ao5, setAO5] = useState('-');
	const [ao12, setAO12] = useState('-');

	const [scrambleIndex, setScrambleIndex] = useState(0);
	const [scramble, setScramble] = useState('');

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

		setScrambleIndex(scrambleIndex + 1);
	}

	return ( 
		<LoginProtectedRoute shouldBeLoggedIn={true}>
			{userdata && <div id='home'>
				<div id='chart'>
					<ResponsiveContainer width='95%' height='60%'>
						<LineChart data={lineData} margin={{ top: 20, right: 20, left: 20, bottom: 20 }}>
							<Line type="monotone" dataKey="time" stroke='var(--secondary-color)' isAnimationActive={false} dot={true}/>
						</LineChart>
					</ResponsiveContainer>
				</div>
				
				<Scramble scramble={scramble} scrambleIndex={scrambleIndex} setScramble={setScramble} setScrambleIndex={setScrambleIndex} />

				<Timer onTimerStop={onTimerStop} ao5={ao5} ao12={ao12} />

				<div id='user-info'>
					<p>Logged in as <b>{userdata.name}</b></p>
					<Link to='/profile'>Profile</Link>
					<Logout/>
				</div>
			</div>}
		</LoginProtectedRoute>
	);
}
 
export default Home;