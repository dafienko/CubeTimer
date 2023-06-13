import React, {useContext, useEffect, useState} from 'react';

import {ColorThemeContext} from '../../ColorTheme';
import useFetchJSON from '../../hooks/useFetchJSON';
import { UserContext } from '../../User';

const Theme = () => {
	const userdata = useContext(UserContext);
	const {currentTheme, setCurrentTheme} = useContext(ColorThemeContext)
	
	const [schemeURL, setSchemeURL] = useState(null);
	const {data: colorScheme, loading, error} = useFetchJSON(schemeURL);
	const [saveLoading, setSaveLoading] = useState(false);

	function setVar(varname, val) {
		document.documentElement.style.setProperty(varname, val);
	}

	const onColorChange = (input) => {
		const varname = ({
			background: '--primary-color',
			accent1: '--secondary-color',
			accent2: '--tertiary-color',
			accent3: '--quaternary-color',
			'timer-color': '--timer-color',
			'ao-color': '--ao-color',
		})[input.target.id];

		setVar(varname, input.target.value);
	}

	const getTheme = () => {
		if (loading) {
			return;
		}

		const color = document.getElementById('base-color').value.slice(1);
		const modeSelect = document.getElementById('scheme-type');
		const mode = modeSelect.value
			.toLowerCase()
			.replace(' ', '-');
		
		setSchemeURL(`https://www.thecolorapi.com/scheme?hex=${color}&mode=${mode}&count=5`)
	}

	useEffect(() => {
		if (!colorScheme) {
			return;
		}

		const secondary = colorScheme.seed.hex.value;
		const tertiary = colorScheme.colors[1].hex.value;
		const quaternary = colorScheme.colors[2].hex.value;

		// https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
		function hexToRGB(hex) {
			var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
			return result ? [
				parseInt(result[1], 16),
				parseInt(result[2], 16),
				parseInt(result[3], 16)
			 ] : null;
		}

		// https://gist.github.com/mjackson/5311256
		const RGBToHSL = ([r, g, b]) => {
			r /= 255; 
			g /= 255; 
			b /= 255;

			const max = Math.max(r, g, b); 
			const min = Math.min(r, g, b);
			let h = 0;
			let s = 0;
			let l = (max + min) / 2;

			if (max == min) {
				h = s = 0; 
			} else {
				const d = max - min;
				s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

				switch (max) {
					case r: h = (g - b) / d + (g < b ? 6 : 0); break;
					case g: h = (b - r) / d + 2; break;
					case b: h = (r - g) / d + 4; break;
				}

				h /= 6;
			}

			return [ h, s, l ];
		};

		let primary, timer, ao;
		const [, , l] = RGBToHSL(hexToRGB(secondary));
		if (l > .7) { 
			primary = '#000000';
			timer = '#FFFFFF';
			ao = '#D0D0D0';
		} else { 
			primary = '#FFFFFF';
			timer = '#000000';
			ao = '#202020';
		}

		setCurrentTheme({primary, secondary, tertiary, quaternary, timer, ao});
		setSchemeURL(null);
	}, [colorScheme]);

	useEffect(() => {
		document.getElementById('accent1').value = currentTheme.secondary;
		document.getElementById('accent2').value = currentTheme.tertiary;
		document.getElementById('accent3').value = currentTheme.quaternary;
		document.getElementById('background').value = currentTheme.primary;
		document.getElementById('timer-color').value = currentTheme.timer;
		document.getElementById('ao-color').value = currentTheme.ao;;
	}, [currentTheme])

	const onSaveTheme = () => {
		if (saveLoading) {
			return;
		}
		setSaveLoading(true);

		setVar('--saved-primary-color', currentTheme.primary);
		setVar('--saved-secondary-color', currentTheme.secondary);
		setVar('--saved-tertiary-color', currentTheme.tertiary);
		setVar('--saved-quaternary-color', currentTheme.quaternary);
		setVar('--saved-timer-color', currentTheme.timer);
		setVar('--saved-ao-color', currentTheme.ao);

		fetch(`http://localhost:9000/user/${userdata.id}/theme`, {
			credentials: 'include',
			method: 'POST',
			headers: {
				'content-type': 'application/json'
			},
			credentials: 'include',
			body: JSON.stringify(currentTheme)
		}).finally(() => {
			setSaveLoading(false);
		})
	}

	const onResetTheme = () => {
		setCurrentTheme(userdata.colorTheme);
	}

	return ( 
		<div className='settings-card' id='theme'>
			<h2>Color Theme</h2>
			<div className='settings-content'>
				<h3>Colors</h3>
				<table>
					<tbody>
						<tr>
							<td>Background</td>
							<td>
								<input type='color' name='background' id='background' onChange={onColorChange} defaultValue={userdata.colorTheme.primary}/>
							</td>
						</tr>
						<tr>
							<td>Accent 1</td>
							<td>
								<input type='color' name='accent 1' id='accent1' onChange={onColorChange} defaultValue={userdata.colorTheme.secondary}/>
							</td>
						</tr>
						<tr>
							<td>Accent 2</td>
							<td>
							<input type='color' name='accent 2' id='accent2' onChange={onColorChange} defaultValue={userdata.colorTheme.tertiary}/>
							</td>
						</tr>
						<tr>
							<td>Accent 3</td>
							<td>
							<input type='color' name='accent 3' id='accent3' onChange={onColorChange} defaultValue={userdata.colorTheme.quaternary}/>
							</td>
						</tr>
						<tr>
							<td>Timer Color</td>
							<td>
							<input type='color' name='timer' id='timer-color' onChange={onColorChange} defaultValue={userdata.colorTheme.timer}/>
							</td>
						</tr>
						<tr>
							<td>AO Color</td>
							<td>
							<input type='color' name='ao' id='ao-color' onChange={onColorChange} defaultValue={userdata.colorTheme.ao}/>
							</td>
						</tr>
					</tbody>
				</table>
				<div>
					<input className='default-button' type='submit' value={saveLoading ? 'Loading...' : 'Save'} onClick={onSaveTheme}/>
					<input className='default-button' type='submit' value='Reset' onClick={onResetTheme}/>
				</div>
				<h3>Generate Theme</h3>
				<table>
					<tbody>
						<tr>
							<td>Base Color</td>
							<td>
								<input type='color' id='base-color' />
							</td>
						</tr>
						<tr>
							<td>Scheme Type</td>
							<td>
								<select id='scheme-type'>
									<option>Analogic</option>
									<option>Monochrome</option>
									<option>Monochrome Light</option>
									<option>Monochrome Dark</option>
									<option>Complement</option>
									<option>Analogic Complement</option>
									<option>Triad</option>
									<option>Quad</option>
								</select>
							</td>
						</tr>
					</tbody>
				</table>
				<div>
					<input className='default-button' type='submit' value={loading ? 'Loading...' : 'Generate Scheme'} onClick={getTheme}/>
				</div>
			</div>
		</div>
	);
}
 
export default Theme;