import {useState, useEffect} from 'react';

import generateScramble from '../generateScramble';

const Scramble = () => {
	const [scrambles, setScrambles] = useState([]);
	const [scrambleIndex, setScrambleIndex] = useState(0);
	const [scramble, setScramble] = useState('');

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

	const onNextScramble = () => {
		setScrambleIndex(scrambleIndex + 1);
	}

	const onLastScramble = () => {
		setScrambleIndex(Math.max(0, scrambleIndex - 1));
	}

	return (
		<div id='scramble-info'>
			<button class='scramble-control' onClick={onLastScramble}>&lt;</button>
			<h2 id='scramble'>{scramble}</h2>
			<button class='scramble-control' onClick={onNextScramble}>&gt;</button>
		</div>
	);
};

export default Scramble;