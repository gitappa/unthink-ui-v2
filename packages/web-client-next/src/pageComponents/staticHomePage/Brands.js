// REMOVE
import React, { useState } from "react";
import Image from "next/image";
import { useNavigate } from "../../helper/useNavigate";
import { CaretRightFilled } from "@ant-design/icons";

import forzieriLogo from "../../images/newStaticPageImages/brands/forzieri.svg";
import jcpennyLogo from "../../images/newStaticPageImages/brands/jcpenny.svg";
import bebeLogo from "../../images/newStaticPageImages/brands/bebe.svg";
import hurlayLogo from "../../images/newStaticPageImages/brands/hurlay.svg";
import perryellisLogo from "../../images/newStaticPageImages/brands/perryellis.svg";
// import campaign_flow from "../../images/newStaticPageImages/brands/campaign_flow.svg";
// import channel_flow from "../../images/newStaticPageImages/brands/channel_flow.svg";
import ContactUs from "../../components/staticPageComponents/ContactUs";
import AudienceTab from "../../components/staticPageComponents/AudienceTab";
import ContactUsField from "../../components/staticPageComponents/ContactUsField";
import { ROUTES } from "../../constants/codes";
import styles from "./Brands.module.css";

const Brands = () => {
	const navigate = useNavigate();
	const [playVideo, setPlayVideo] = useState(true);

	return (
		<div className={styles.container}>
			<section className={styles.introSection}>
				<div className={styles.introContent}>
					<div className={styles.introTextContainer}>
						<h1 className={styles.introTitle}>
							<span className={styles.boldText}>
								Engage your customers contextually
							</span>{" "}
						</h1>
						<p className={styles.introSubtitle}>
							With products matching their need
						</p>
						<ContactUsField
							id='brands_contact_field_top'
							inputProps={{
								style: {
									background: "rgba(255, 255, 255, 0.1)",
									color: "white",
								},
							}}
							collectFullInfo
							clearEmailOnSuccess
							buttonText='Request a demo'
						/>
					</div>

					<div className={styles.videoContainer}>
						{playVideo ? (
							<video
								autoPlay
								loop
								muted
								id='home_page_video'
								playsInline // to make it auto play on iphone
								poster='https://cdn.yfret.com/static/img/POSTER_BRANDS_INTRO.png'
								// poster='https://cdn.yfret.com/static/img/POSTER_BRANDS_INTRO.webp'
								className={styles.videoElement}>
								<source
									src='https://cdn.unthink.ai/video/GIF_BRANDS_INTRO.mp4'
									// src='https://cdn.yfret.com/static/vid/GIF_BRANDS_INTRO.webm'
									type='video/mp4'
								/>
							</video>
						) : (
							<>
								<img
									id='home_page_poster'
									src='https://cdn.yfret.com/static/img/POSTER_BRANDS_INTRO.png'
									className={styles.videoElement}
								/>

								<div
									className={styles.playOverlay}
									onClick={() => setPlayVideo(true)}>
									<CaretRightFilled className={styles.playIcon} />
								</div>
							</>
						)}
					</div>
				</div>
			</section>
			{/* HIDDEN SECTION REMOVED FOR BREVITY (It was commented out in original) */}
			<section className={styles.audienceSection}>
				<h1 className={styles.audienceTitle}>
					Place your products{" "}
					<span className={styles.pacificoText}>Contextually</span>
				</h1>
				<AudienceTab />
			</section>
			<section className={styles.aiSection}>
				<div>
					<h1 className={styles.aiTitle}>
						Bring the power of AI to the Brand
					</h1>
					<h1 className={styles.aiSubtitle}>
						Aura - the AI helper app
					</h1>
				</div>
				<div className={styles.chatContainer}>
					<div className={styles.chatRow}>
						<div className={styles.chatBubble}>
							<h1 className={styles.chatTitle}>
								How can i match my new white sofa ?
							</h1>
							<p className={styles.chatText}>
								Find other products that go with it - like coffee tables, lamps
								etc
							</p>
						</div>
						<div className={styles.chatImageContainer}>
							<img
								className={styles.chatImage}
								src={
									"https://cdn.unthink.ai/img/unthink_ai/whiteSofa_mlmfjdn_340_340.webp"
								}
							/>
						</div>
					</div>
					<div className={styles.chatRowReverse}>
						<div className={styles.chatBubble}>
							<h1 className={styles.chatTitle}>
								Help with WFH stylish decor for my study
							</h1>
							<p className={styles.chatText}>
								Create a full look from scratch
							</p>
						</div>
						<div className={styles.chatImageContainer}>
							<img
								className={styles.chatImage}
								src={
									"https://cdn.unthink.ai/img/unthink_ai/wfh_ilifugp_340_340.webp"
								}
							/>
						</div>
					</div>
					<div className={styles.chatRowLast}>
						<div className={styles.chatBubble}>
							<h1 className={styles.chatTitle}>
								Help me find items matching a look like this
							</h1>
							<p className={styles.chatText}>
								Find products matching a look from a photo
							</p>
						</div>
						<div className={styles.chatImageContainer}>
							<img
								className={styles.chatImage}
								src={
									"https://cdn.unthink.ai/img/unthink_ai/completeLook_lvatpmh_340_340.webp"
								}
							/>
						</div>
					</div>
				</div>
			</section>
			{/* HIDDEN SECTION REMOVED/SKIPPED (It was commented out in original) */}
			{/* UPDATED NEW UI SECTION REMOVED/SKIPPED (It was commented out in original) */}
			<section className={styles.contactSection}>
				<ContactUs
					title='Drive more sales and build an engaged community'
					id='brands_contact_form_bottom'
					// onSuccessCallback={(email) => {
					// 	navigate(ROUTES.TRY_FOR_FREE_PAGE);
					// }}
					submitButtonText='Contact Us'
				/>
			</section>
		</div>
	);
};

export default Brands;
