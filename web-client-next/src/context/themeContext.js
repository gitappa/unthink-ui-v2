import React, { useState } from "react";
import { THEME_DEFAULT } from "../constants/themeCodes";

const ThemeContext = React.createContext();

export const ThemeContextWrapper = ({ children }) => {
	const [theme, setTheme] = useState(THEME_DEFAULT);

	const resetTheme = () => setTheme(THEME_DEFAULT);

	return (
		<ThemeContext.Provider
			value={{
				theme,
				setTheme,
				resetTheme,
			}}>
			{children}
		</ThemeContext.Provider>
	);
};

export default ThemeContext;
