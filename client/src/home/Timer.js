import { useState, useEffect } from 'react';

const DEFAULT_COLOR = 'var(--timer-color)';
const PRIMING_COLOR = '#f00';
const PRIMED_COLOR = '#0f0';
const STOPPED_COLOR = '#00f';

const PRIME_TIME = 500;

const Timer = ({onTimerStop, ao5, ao12}) => {
	const [color, setColor] = useState(DEFAULT_COLOR);
	const [primeTimeout, setPrimeTimeout] = useState(null);
	const [primed, setPrimed] = useState(false);
	const [pressed, setPressed] = useState(false);
	const [timerRunning, setTimerRunning] = useState(false);
	const [startTime, setStartTime] = useState(performance.now());
	const [timeText, setTimeText] = useState('0.00');

	function getTime() {
		const now = performance.now();
		const ms = now - startTime;
		return ms / 1000;
	}

	function updateTimeText() {
		const text = getTime().toFixed(2);
		setTimeText(text);
	}

	function startTimer() {
		setStartTime(performance.now());
		setTimerRunning(true);

		setColor(DEFAULT_COLOR);
	}

	function stopTimer() {
		onTimerStop(getTime());

		setTimerRunning(false);
		setPrimed(false);
		updateTimeText();

		setColor(STOPPED_COLOR);
	}

	function startPriming() { 
		setColor(PRIMING_COLOR);

		setPrimeTimeout(setTimeout(() => {
			prime();
			setPrimeTimeout(null);
		}, PRIME_TIME));
	}

	function prime() {
		setPrimed(true);

		setColor(PRIMED_COLOR);
	}

	function abortPrime() {
		if (primeTimeout) {
			clearTimeout(primeTimeout);
			setPrimeTimeout(null);
		}

		setColor(DEFAULT_COLOR);
	}
	
	function timerPress() {
		if (pressed) { return; }
		setPressed(true);

		if (timerRunning) {
			stopTimer();
		} else {
			startPriming();
		}
	}

	function timerRelease() {
		if (!pressed) { return; }
		setPressed(false);

		if (primed) {
			startTimer();
		} else {
			abortPrime();
		}
	}

	useEffect(() => {
		const handleKeyDown = (e) => {
			if (e.key === ' ') {
				timerPress();
			}
		}
	
		const handleKeyUp = (e) => {
			if (e.key === ' ') {
				timerRelease();
			}
		}
		
		let timeout;
		if (timerRunning) {
			timeout = setTimeout(updateTimeText, 10);
		}

		window.addEventListener("keydown", handleKeyDown);
		window.addEventListener("keyup", handleKeyUp);

		return () => {
			window.removeEventListener("keydown", handleKeyDown);
			window.removeEventListener("keyup", handleKeyUp);
			
			if (timeout) {
				clearTimeout(timeout);
			}
		}
	});

	return (
		<div id='time'>
			<h3 id='timer' style={{color}}>{timeText}</h3>
			<p id='ao5' className='ao'>AO5: {ao5}</p>
			<p id='ao12' className='ao'>AO12: {ao12}</p>
		</div>
	);
}
 
export default Timer;