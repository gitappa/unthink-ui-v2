import React, { useMemo } from "react";
import styles from './footer.module.scss';
import { current_store_name, is_store_instance } from "../../../constants/config";
import { STORE_USER_NAME_SWIFTLYSTYLED } from "../../../constants/codes";

export const Footer = () => {

	const isSwiftlyStyledInstance = useMemo(
		() =>
			is_store_instance && current_store_name === STORE_USER_NAME_SWIFTLYSTYLED,
		[]
	);

	return (
		<footer id='swiftly-styled-footer' className={styles.swiftlyStyledFooter}>
			<div className={styles.colorStrip}>
				<div className={styles.colorSegment} style={{ backgroundColor: "#cfe6c9" }} />
				<div className={styles.colorSegment} style={{ backgroundColor: "#f2c37c" }} />
				<div className={styles.colorSegment} style={{ backgroundColor: "#cdb5d7" }} />
				<div className={styles.colorSegment} style={{ backgroundColor: "#7a1f2b" }} />
				<div className={styles.colorSegment} style={{ backgroundColor: "#b2d2da" }} />
				<div className={styles.colorSegment} style={{ backgroundColor: "#6b6b6b" }} />
				<div className={styles.colorSegment} style={{ backgroundColor: "#f6b6cc" }} />
				<div className={styles.colorSegment} style={{ backgroundColor: "#d8c3a4" }} />
				<div className={styles.colorSegment} style={{ backgroundColor: "#2f3a57" }} />
			</div>
			{/* <div className='footer-box'>
				<div>
					<p>
						THIS SITE IS OPERATED BY <strong>SWIFTIES</strong> (WHO{" "}
						<em>WERE</em> ALSO STRUGGLING TO FIND OUTFITS FOR THE ERAS TOUR).
					</p>
				</div>
				<div>
					<p>
						WE WOULD LIKE TO CLARIFY THAT <strong>WE ARE NOT AFFILIATED</strong>{" "}
						WITH TAYLOR SWIFT, TAYLOR NATION, OR THE ERAS TOUR.
					</p>
				</div>
				<div>
					<p>
						ALL IMAGES FEATURED ON THIS WEBSITE ARE USED FOR{" "}
						<strong>ILLUSTRATIVE PURPOSES ONLY</strong> <br />
						AND WE <strong>DO NOT CLAIM OWNERSHIP</strong> OF THEM.
					</p>
				</div>
			</div> */}
			<div className={styles.blackBox}>
				<p>
					This website features links to products from our affiliate partners
					<br />
					to provide a means for us to earn commissions, if you choose to make a
					purchase through our links (at no added cost to you!)
				</p>
				<p>
					We graciously thank you for helping us pay off the loan we had to take
					to purchase our tickets for the Eras Tour.
				</p>
			</div>
			<div className={styles.footerLinks}>
				<div className='font-bold'>PRIVACY</div>
				<div className={styles.copyright}>
					<span>
						©2024 {isSwiftlyStyledInstance ? "SwiftlyStyled" : "DoTheLook"}. All Rights Reserved.
						<br />
					</span>
					<span>US</span>
				</div>
				<div className='font-bold'>TERMS</div>
			</div>
		</footer>
	);
};
