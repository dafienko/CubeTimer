import {useState, useEffect} from 'react';

import generateScramble from '../generateScramble';

const Scramble = ({scramble, setScramble, scrambleIndex, setScrambleIndex}) => {
	const [scrambles, setScrambles] = useState([]);

	useEffect(() => {
		if (scrambleIndex >= scrambles.length) {
			const newScrambles = [...scrambles]
			newScrambles.push(generateScramble());
			setScrambles(newScrambles);
		}
	}, [scrambleIndex]);

	useEffect(() => {
		if (scrambles[scrambleIndex]) {
			setScramble(scrambles[scrambleIndex]);
		}
	}, [scrambleIndex, scrambles]);

	const onNextScramble = (e) => {
		e.target.blur();
		
		setScrambleIndex(scrambleIndex + 1);
	}

	const onLastScramble = (e) => {
		e.target.blur();

		setScrambleIndex(Math.max(0, scrambleIndex - 1));
	}

	return (
		<div id='scramble-info'>
			<button className='scramble-control' onClick={onLastScramble}>&lt;</button>
			<h2 id='scramble'>{scramble}</h2>
			<button className='scramble-control' onClick={onNextScramble}>&gt;</button>
		</div>
	);
};

export default Scramble;