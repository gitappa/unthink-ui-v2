import React from "react";
import { useNavigate } from "../../../helper/useNavigate";

import guitar from "../../../images/swiftly-styled/Icons - SVG - SwiftlyStyled/SVG Icons/Guitar - Debut.svg";
import fearless from "../../../images/swiftly-styled/Icons - SVG - SwiftlyStyled/SVG Icons/Heart Hands - Fearless.svg";
import fireworks from "../../../images/swiftly-styled/Icons - SVG - SwiftlyStyled/SVG Icons/Fireworks - Speak Now.svg";
import heartGlasses from "../../../images/swiftly-styled/Icons - SVG - SwiftlyStyled/SVG Icons/Heart Sunglasses - RED.svg";
import moon from "../../../images/swiftly-styled/Icons - SVG - SwiftlyStyled/SVG Icons/Moon and Stars - Midnights.svg";
import seagulls from "../../../images/swiftly-styled/Icons - SVG - SwiftlyStyled/SVG Icons/Seagulls - 1989.svg";
import snake from "../../../images/swiftly-styled/Icons - SVG - SwiftlyStyled/SVG Icons/Snake - Reputation.svg";
import typewriter from "../../../images/swiftly-styled/Icons - SVG - SwiftlyStyled/SVG Icons/Typewriter - The Tortured Poets Department.svg";
import hearts from "../../../images/swiftly-styled/Icons - SVG - SwiftlyStyled/SVG Icons/Hearts - Lover.svg";
import cardigan from "../../../images/swiftly-styled/Icons - SVG - SwiftlyStyled/SVG Icons/Cardigan - Folklore.svg";
import willow from "../../../images/swiftly-styled/Icons - SVG - SwiftlyStyled/SVG Icons/Willow - Evermore.svg";
import hoverRed from "../../../images/swiftly-styled/Album Names - SVG - SwiftlyStyled/Red.svg";
import hoverMidnights from "../../../images/swiftly-styled/Album Names - SVG - SwiftlyStyled/Midnights.svg";
import hoverLover from "../../../images/swiftly-styled/Album Names - SVG - SwiftlyStyled/Lover.svg";
import hoverDebut from "../../../images/swiftly-styled/Album Names - SVG - SwiftlyStyled/Debut.svg";
import hoverFearless from "../../../images/swiftly-styled/Album Names - SVG - SwiftlyStyled/Fearless.svg";
import hoverReputation from "../../../images/swiftly-styled/Album Names - SVG - SwiftlyStyled/Reputation.svg";
import hoverSpeakNow from "../../../images/swiftly-styled/Album Names - SVG - SwiftlyStyled/SpeakNow.svg";
import hoverSeagulls from "../../../images/swiftly-styled/Album Names - SVG - SwiftlyStyled/1989.svg";
import hoverEvermore from "../../../images/swiftly-styled/Album Names - SVG - SwiftlyStyled/Evermore.svg";
import hoverFolklore from "../../../images/swiftly-styled/Album Names - SVG - SwiftlyStyled/Folklore.svg";
import hoverTypewriter from "../../../images/swiftly-styled/Album Names - SVG - SwiftlyStyled/TypeWriter.svg";
import styles from './collectionsGrid.module.scss';
import { getThemeCollectionsPagePath } from "../../../helper/utils";
import {
	THEME_LOVER,
	THEME_MIDNIGHTS,
	THEME_RED,
	THEME_FEARLESS,
	THEME_TAYLOR_SWIFT,
	THEME_REPUTATION,
	THEME_FOLKLORE,
	THEME_THE_TORTURED_POETS_DEPARTMENT,
	THEME_SPEAK_NOW,
	THEME_EVERMORE,
	THEME_1989,
} from "../../../constants/themeCodes";

const CollectionsGrid = () => {
	const navigate = useNavigate();
	const handleCollErasClick = (theme) => {
		navigate(`${getThemeCollectionsPagePath(theme)}?collection_theme=${theme}`); // redirect on categories/[coll_theme] page with theme as query param
	};
	return (
		<div id={styles['eras-collections-grid']}>
			<div className={styles.grid} style={{ gridRow: 8 }}>
				<div
					className={`${styles.item} ${styles.guitar}`}
					onClick={() => handleCollErasClick(THEME_TAYLOR_SWIFT)}>
					<img src={guitar} alt='taylor-swift' />
					<img className={styles['hover-svg']} src={hoverDebut} alt='DEBUT' />
				</div>

				<div
					className={`${styles.item} ${styles.heartGlasses}`}
					onClick={() => handleCollErasClick(THEME_RED)}>
					<img src={heartGlasses} alt='red' />
					<img className={styles['hover-svg']} src={hoverRed} alt='RED' />
				</div>

				<div
					className={`${styles.item} ${styles.snake}`}
					onClick={() => handleCollErasClick(THEME_REPUTATION)}>
					<img src={snake} alt='reputation' />
					<img className={styles['hover-svg']} src={hoverReputation} alt='REPUTATION' />
				</div>

				<div
					className={`${styles.item} ${styles.cardigan}`}
					onClick={() => handleCollErasClick(THEME_FOLKLORE)}>
					<img src={cardigan} alt='folklore' />
					<img className={styles['hover-svg']} src={hoverFolklore} alt='FOLKLORE' />
				</div>
			</div>

			<div className={styles.grid} style={{ gridRow: 8 }}>
				<div
					className={`${styles.item} ${styles.fearless}`}
					onClick={() => handleCollErasClick(THEME_FEARLESS)}>
					<img src={fearless} alt='fearless' />
					<img className={styles['hover-svg']} src={hoverFearless} alt='FEARLESS' />
				</div>

				<div
					className={`${styles.item} ${styles.moon}`}
					onClick={() => handleCollErasClick(THEME_MIDNIGHTS)}>
					<img src={moon} alt='moon' />
					<img className={styles['hover-svg']} src={hoverMidnights} alt='MIDNIGHTS' />
				</div>

				<div
					className={`${styles.item} ${styles.typewriter}`}
					onClick={() =>
						handleCollErasClick(THEME_THE_TORTURED_POETS_DEPARTMENT)
					}>
					<img src={typewriter} alt='the-tortured-poets-department' />
					<img className={styles['hover-svg']} src={hoverTypewriter} alt='TYPEWRITER' />
				</div>
			</div>

			<div className={styles.grid} style={{ gridRow: 8 }}>
				<div
					className={`${styles.item} ${styles.fireworks}`}
					onClick={() => handleCollErasClick(THEME_SPEAK_NOW)}>
					<img src={fireworks} alt='speak-now' />
					<img className={styles['hover-svg']} src={hoverSpeakNow} alt='FIREWORKS' />
				</div>

				<div
					className={`${styles.item} ${styles.seagulls}`}
					onClick={() => handleCollErasClick(THEME_1989)}>
					<img src={seagulls} alt='1989' />
					<img className={styles['hover-svg']} src={hoverSeagulls} alt='1989' />
				</div>

				<div
					className={`${styles.item} ${styles.hearts}`}
					onClick={() => handleCollErasClick(THEME_LOVER)}>
					<img src={hearts} alt='hearts' />
					<img className={styles['hover-svg']} src={hoverLover} alt='LOVER' />
				</div>

				<div
					className={`${styles.item} ${styles.willow}`}
					onClick={() => handleCollErasClick(THEME_EVERMORE)}>
					<img src={willow} alt='evermore' />
					<img className={styles['hover-svg']} src={hoverEvermore} alt='EVERMORE' />
				</div>
			</div>
		</div>
	);
};
export default CollectionsGrid;
