const COMMUTATIVE_MOVES = {
	U: 'D',
	R: 'L',
	F: 'B',
};

for (const [key, value] of Object.entries(COMMUTATIVE_MOVES)) {
	COMMUTATIVE_MOVES[value] = key;
}

function modifyMove(move) {
	return `${move}${(['2', '\'', ''])[Math.floor(Math.random() * 3)]}`
}

function getNonCommutativeMove(move1, move2) {
	const illegalMoves = move1 ? (move2 ? [move1, move2, COMMUTATIVE_MOVES[move1], COMMUTATIVE_MOVES[move2]] : [move1]) : [];
	
	const legalMoves = Object.keys(COMMUTATIVE_MOVES).filter(move => {
		return !illegalMoves.includes(move);
	})

	return legalMoves[Math.floor(Math.random() * legalMoves.length)];
}

const generateScramble = (length) => {
	length = length || 20;
	
	let moves = [];
	for (let i = 0; i < length; i++) {
		const a = i > 0 && moves[i - 1];
		const b = i > 1 && moves[i - 2];
		moves.push(getNonCommutativeMove(a, b));
	}
	
	return moves.map(modifyMove).join(' ');
}

export default generateScramble;