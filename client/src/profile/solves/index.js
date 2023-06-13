import React, {useContext} from 'react';

import {UserContext} from '../../User';
import useFetchJSON from '../../hooks/useFetchJSON'
import './solves.css';

const Solves = () => {
	const userdata = useContext(UserContext);

	const {data: solvedata, solvedataLoading, solvedataError} = useFetchJSON(`http://localhost:9000/solves/${userdata.id}`, {credentials: 'include'});

	return ( 
		<div id="solves">
			<h1>Solves</h1>
			<table>
				<thead>
					<tr>
						<th>#</th>
						<th>Time</th>
						<th>Scramble</th>
					</tr>
				</thead>
				<tbody>
					{solvedata && [...solvedata].reverse().map((solve, i) => 
						<tr key={`solve-${i}`}>
							<td className='td-i'>{solvedata.length - i}</td>
							<td className='td-time'>{solve.time.toFixed(2)}</td>
							<td className='td-scramble'>{solve.scramble}</td>
						</tr>
					)}
				</tbody>
			</table>
		</div>
	);
}
 
export default Solves;