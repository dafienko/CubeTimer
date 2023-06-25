import React, { useContext, useEffect, useState } from 'react';
import {UserContext} from '../../User';

const SolveRow = ({i, solve, data, setData}) => {
	const userdata = useContext(UserContext);

	const [hovered, setHovered] = useState(false);
	const [loading, setLoading] = useState(false);

	const j = data.length - i;
	

	const onMouseEnter = () => {
		setHovered(true);
	}

	const onMouseLeave = () => {
		setHovered(false);
	}

	return ( 
		<tr onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>					
			<td className='td-i'>{j}</td>
			<td className='td-time'>{solve.time.toFixed(2)}{solve.add2 && ' + 2'}</td>
			<td>{solve.ao5}</td>
			<td>{solve.ao12}</td>
			<td className='td-scramble'>
				<div id='buttons-container'>
					<p id='td-p'>{solve.scramble}</p>
					{
						hovered &&
						<div id='buttons'>
							<button className='add' onClick={() => {
								if (loading) {
									return;
								}
								setLoading(true);
								
								const setting = !solve.add2;
								fetch(`${process.env.REACT_APP_API_ORIGIN}/user/${userdata.id}/solves`, {
									method: "PUT",
									headers: {
										'content-type': 'application/json'
									},
									credentials: 'include',
									body: JSON.stringify({scramble: solve.scramble, add2: setting})
								}).then((res) => {
									solve.add2 = setting;
									setData([...data]);
								}).finally(() => {
									setLoading(false);
								});	
							}}>
								{solve.add2 ? '-2' : '+2'}
							</button>
							<button className='delete' onClick={() => {
								if (loading) {
									return;
								}
								setLoading(true);

								fetch(`${process.env.REACT_APP_API_ORIGIN}/user/${userdata.id}/solves`, {
									method: "DELETE",
									headers: {
										'content-type': 'application/json'
									},
									credentials: 'include',
									body: JSON.stringify({scramble: solve.scramble})
								}).then((res) => {
									data.splice(i, 1)
									setData([...data]);
								}).finally(() => {
									setLoading(false);
								});	
							}}>
								&#10006;
							</button>
						</div>
					}
				</div>
			</td>
		</tr> 
	);
}
 
export default SolveRow;