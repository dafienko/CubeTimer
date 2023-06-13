import React, {useState, useEffect, createContext, useContext} from 'react';
import { UserContext } from './User';

const DEFAULT_THEME = {
	primary: '#FFFFFF',
	secondary: '#FF0000',
	tertiary: '#DD0000',
	quaternary: '#AA0000',
	timer: '#000000',
	ao: '#202020',
};

const ColorThemeContext = createContext({
	currentThem: DEFAULT_THEME,
	setCurrentTheme: function() {}
});

const ColorThemeProvider = ({children}) => {
	const userdata = useContext(UserContext);

	const [currentTheme, setCurrentTheme] = useState(DEFAULT_THEME);

	function setVar(varname, val) {
		document.documentElement.style.setProperty(varname, val);
	}

	useEffect(() => {
		setVar('--primary-color', currentTheme.primary);
		setVar('--secondary-color', currentTheme.secondary);
		setVar('--tertiary-color', currentTheme.tertiary);
		setVar('--quaternary-color', currentTheme.quaternary);
		setVar('--timer-color', currentTheme.timer);
		setVar('--ao-color', currentTheme.ao);
	}, [currentTheme]);

	useEffect(() => {
		if (userdata && userdata.colorTheme) {
			setCurrentTheme(userdata.colorTheme);
		}
	}, [userdata]);

	return (
		<ColorThemeContext.Provider value={{currentTheme, setCurrentTheme}}> 
			{children}
		</ColorThemeContext.Provider>
	);
};

export {ColorThemeContext, ColorThemeProvider};