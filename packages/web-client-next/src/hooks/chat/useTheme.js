import { useContext } from "react";

import { THEME_CODES, THEME_DEFAULT } from "../../constants/themeCodes";
import ThemeContext from "../../context/themeContext";

const useTheme = () => {
	const { theme, setTheme, resetTheme } = useContext(ThemeContext);

	const themeCodes = THEME_CODES[theme] || THEME_CODES[THEME_DEFAULT];

	return {
		theme,
		setTheme,
		themeCodes,
		resetTheme,
	};
};

export default useTheme;
