import {useState, useEffect, useContext} from 'react';
import LoginProtectedRoute from "../LoginProtectedRoute";
import {ResponsiveContainer, Area, AreaChart} from 'recharts';

import useFetchJSON from '../hooks/useFetchJSON';
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
	const {data: solvedata, solvedataLoading, solvedataError} = useFetchJSON(userdata && `${process.env.REACT_APP_API_ORIGIN}/user/${userdata.id}/solves?num=${SHOW_NUM_SOLVES}`, {credentials: 'include'});
	const [lineData, setLineData] = useState([]);
	
	const [ao5, setAO5] = useState('-');
	const [ao12, setAO12] = useState('-');

	const [scrambleIndex, setScrambleIndex] = useState(0);
	const [scramble, setScramble] = useState('');

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
		if (t) {
			const newData = lineData.slice(lineData.length >= SHOW_NUM_SOLVES ? 1 : 0);
			
			newData.push({time: t});
			setLineData(newData);

			fetch(`${process.env.REACT_APP_API_ORIGIN}/user/${userdata.id}/solves`, {
				method: 'POST',
				credentials: 'include',
				headers: {
					'content-type': 'application/json'
				},
				body: JSON.stringify({
					time: t,
					scramble: scramble
				})
			});
		}

		setScrambleIndex(scrambleIndex + 1);
	}

	return ( 
		<LoginProtectedRoute shouldBeLoggedIn={true}>
			{userdata && <div id='home'>
				<div id='chart'>
					<ResponsiveContainer width='100%' height='95%'>
						<AreaChart data={lineData} margin={{ top: 100, right: 0, left: 0, bottom: 10 }}>
							<defs>
								<linearGradient id="colorTime" x1="0" y1="0" x2="0" y2="1">
									<stop offset="5%" stopColor="var(--secondary-color)" stopOpacity={0.5}/>
									<stop offset="20%" stopColor="var(--secondary-color)" stopOpacity={0.5}/>
									<stop offset="100%" stopColor="var(--secondary-color)" stopOpacity={0}/>
								</linearGradient>
							</defs>
							<Area type="monotone" dataKey="time" stroke='var(--secondary-color)' fillOpacity={1} fill="url(#colorTime)" isAnimationActive={false} dot={true}/>
						</AreaChart>
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