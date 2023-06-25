import React, {useContext, useEffect, useState} from 'react';

import {UserContext} from '../../User';
import useFetchJSON from '../../hooks/useFetchJSON'
import SolveRow from './SolveRow';
import './solves.css';

const Solves = () => {
	const userdata = useContext(UserContext);

	const {data: solvedata} = useFetchJSON(`${process.env.REACT_APP_API_ORIGIN}/user/${userdata.id}/solves`, {credentials: 'include'});
	const [cachedData, setCachedData] = useState([]);
	const [finalData, setFinalData] = useState([]);
	const [mean, setMean] = useState(null);
	const [bestSingle, setBestSingle] = useState(null);
	const [bestAO5, setBestAO5] = useState(null);
	const [bestAO12, setBestAO12] = useState(null);

	useEffect(() => {
		if (solvedata) {
			setCachedData([...solvedata].reverse());
		}
	}, [solvedata]);

	useEffect(() => {
		if (!(cachedData && cachedData[0])) {
			return;
		}

		const first = cachedData[cachedData.length - 1];
		if (!(first && first.time)) {
			return;
		}
		first.computedTime = first.time + (first.add2 ? 2 : 0);
		
		let sumOf5 = first.computedTime;
		let sumOf12 = first.computedTime;
		let bestOf5 = first.computedTime;
		let bestOf12 = first.computedTime;
		let worstOf5 = first.computedTime;
		let worstOf12 = first.computedTime;

		let sum = first.computedTime;
		let bestSingle = first.computedTime;
		let bestAO5 = null;
		let bestAO12 = null;

		const finalData = [...cachedData];

		const recomputeBestAndWorst = (i, n) => {
			let best = cachedData[i].computedTime;
			let worst = cachedData[i].computedTime;
			
			for (let j = i+1; j < i + n; j++) {
				best = Math.min(best, cachedData[j].computedTime);
				worst = Math.max(worst, cachedData[j].computedTime);
			}

			return [best, worst];
		}

		for (let i = finalData.length - 2; i >= 0; i--) {
			let im5 = i + 5;
			let im12 = i + 12;

			let currentSolve = finalData[i];
			currentSolve.computedTime = currentSolve.time + (currentSolve.add2 ? 2 : 0);
			sum += currentSolve.computedTime;
			bestSingle = Math.min(bestSingle, currentSolve.computedTime);
			
			sumOf5 += currentSolve.computedTime;
			if (im5 < finalData.length) {
				const drop = finalData[im5].computedTime
				sumOf5 -= drop;
				
				if (drop == bestOf5 || drop == worstOf5) {
					[bestOf5, worstOf5] = recomputeBestAndWorst(i, 5);
				}

				currentSolve.ao5 = ((sumOf5 - (bestOf5 + worstOf5)) / 3).toFixed(2);
				bestAO5 = bestAO5 ? Math.min(bestAO5, currentSolve.ao5) : currentSolve.ao5;
			} else {
				currentSolve.ao5 = '-'
			}
			
			sumOf12 += currentSolve.computedTime;
			if (im12 < finalData.length) {
				const drop = finalData[im12].computedTime
				sumOf12 -= drop;
				
				if (drop == bestOf12 || drop == worstOf12) {
					[bestOf12, worstOf12] = recomputeBestAndWorst(i, 12);
				}

				currentSolve.ao12 = ((sumOf12 - (bestOf12 + worstOf12)) / 10).toFixed(2);
				bestAO12 = bestAO12 ? Math.min(bestAO12, currentSolve.ao12) : currentSolve.ao12;
			} else {
				currentSolve.ao12 = '-'
			}
		}

		setMean((sum / finalData.length).toFixed(2));
		setBestSingle(bestSingle.toFixed(2));
		setBestAO5(bestAO5 && bestAO5.toFixed(2));
		setBestAO12(bestAO12 && bestAO12.toFixed(2));
		setFinalData(finalData);
	}, [cachedData]);

	return ( 
		<div id="solves">
			<h1>Solves</h1>
			<div id='stats-container'>
				<h2>Info</h2>
				<table id='overall-statistics'>
					<tbody>
						<tr>
							<td><b>Mean: </b></td>
							<td>{mean || '-'}</td>
						</tr>
						<tr>
							<td><b>Best Single: </b></td>
							<td>{bestSingle || '-'}</td>
						</tr>
						<tr>
							<td><b>Best AO5: </b></td>
							<td>{bestAO5 || '-'}</td>
						</tr>
						<tr>
							<td><b>BestAO12: </b></td>
							<td>{bestAO12 || '-'}</td>
						</tr>
					</tbody>
				</table>
				<h2>Solves</h2>
				<table id='solves-table'>
					<thead>
						<tr>
							<th>#</th>
							<th>Time</th>
							<th>AO5</th>
							<th>AO12</th>
							<th>Scramble</th>
						</tr>
					</thead>
					<tbody>
						{[...finalData].map((solve, i) => 
							<SolveRow key={`solve-${i}`} solve={solve} i={i} data={cachedData} setData={setCachedData} />
						)}
					</tbody>
				</table>
			</div>
		</div>
	);
}
 
export default Solves;