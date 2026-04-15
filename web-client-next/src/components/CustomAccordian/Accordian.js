import React, { useState } from "react";

import downArrow_icon from "../../images/newStaticPageImages/downArrow_icon.svg";
import styles from './Accordian.module.css';
import scssStyles from './Accordian.module.scss';

const Pannel = ({ title, children }) => {
	const [isOpen, setOpen] = useState(false);
	return (
		<div className={`accordion_wrapper ${scssStyles.accordion_wrapper} ${styles.accordionWrapper}`}>
			<div
				className={`${styles.accordionHeader} ${isOpen ? "open" : ""
					}`}
				onClick={() => setOpen(!isOpen)}>
				<h1 className={styles.accordionTitle}>{title}</h1>
				<img
					src={downArrow_icon}
					className={`${isOpen && scssStyles.rotate_accordion_icon} ${scssStyles.accordion_icon}`}
				/>
			</div>
			<div className={`${scssStyles.accordion_item} ${!isOpen ? scssStyles.collapsed : ""}`}>
				<div
					className={`${scssStyles.accordion_content} ${styles.accordionContentText} ${isOpen ? styles.opacityFull : styles.opacityNone
						}`}>
					{children}
				</div>
			</div>
		</div>
	);
};

const Accordion = () => {
	return (
		<div className={styles.faqContainer}>
			<h1 className={styles.faqTitle}>
				FAQ’s
			</h1>
			<div className={styles.faqContent}>
				<Pannel title='Why do I need a wallet?'>
					You need a wallet to save your Unthink NFT, which is like a loyalty
					pass and gives you access to earnings. You will also get new NFT drops
					from our partners like brands, publishers or games in the future.
					Think of your wallet as your entry into the Web3 world.
				</Pannel>
				<Pannel title='What are the benefits of the NFT?'>
					<ul className={styles.listDisc}>
						<li>
							First of all, the NFT is your access pass for receiving rewards
							from the ecosystem.
						</li>
						<li>
							Your first level Unthink Creator NFT gives you access to brand
							campaigns, coupons, opportunities to create guest blogs, and
							private community events.
						</li>
						<li>
							You get a permanent creator profile that sits on the Hedera
							blockchain, which, unlike many other chains, is built for
							enterprises and is supported by large companies like Google.
							Boeing, LG and many more.
						</li>
					</ul>
				</Pannel>

				<Pannel title='How many types of NFTs can I earn?'>
					Based on the type and level of engagement with the community, here are
					some of the NFT types:
					<ul className={styles.listDisc}>
						<li>Unthink Influencer</li>
						<li>Unthink Ambassador</li>
						<li>Unthink founder</li>
						<li>Unthink Partner</li>
						<li>Unthink Champion</li>
					</ul>
				</Pannel>
				<Pannel title='I am a person with a regular day job. How much effort does it take for a campaign?'>
					It takes less than 15 minutes to create collections and share them
					with your audience
				</Pannel>
				<Pannel title='How much can I earn per campaign?'>
					That depends on the contract signed by the brand, and will vary. The
					starting model right now is about 5% of the sale value, and we expect
					the brands will pay more as we grow the community of influencers.
				</Pannel>
				<Pannel title='Why is this easier than all the other brand campaigns that I do?'>
					You do not have to make videos and post them. All you do is come with
					ideas for things that people need opinions for, and you get a lot of
					help from our AI assistant tools to write content and to pick
					products.
				</Pannel>

				<Pannel title='Why should I share other creator collections?'>
					When you share other collections, you get a share of the earnings when
					people click and buy products. The “web3” way is all about
					collaboration and ownership. Pay it forward and gain in the long term.
				</Pannel>

				<Pannel title='What are the ways in which I can support the community?'>
					You can take part in any of these activities that promote the
					community:
					<ul className={styles.listDisc}>
						<li>Write blogs for our publisher partners</li>
						<li>Refer other creators</li>
						<li>Share collections of other creators</li>
						<li>Buy products from our brand partners & collections</li>
					</ul>
				</Pannel>

				<Pannel title='How do I get started?'>
					First you sign up and create a wallet using our partner, Venly. Once
					you login, you get a view of the categories and brands available to
					choose from. It will take you less than 15 minutes to create your
					first collection. That’s it! <br />
					You get your Unthink Creator NFT and start receiving newsletters from
					us with a lot of fun stuff and opportunities.
				</Pannel>

				<Pannel title='How do I create a collection, and why is it different from other affiliate activities?'>
					We take away the manual work of copying and pasting links, figuring
					out which products to choose, and putting them together.
					<br />
					You can get your own collection pages in 3 ways:
					<ul className={styles.listDisc}>
						<li>
							Browse or search for products in our portal and add them to a
							collection.
						</li>
						<li>Write a fresh content piece using our AI writing assistant!</li>
						<li>
							Connect an existing blog that you have already created and watch
							Aura the virtual shopping assistant pick products that match
						</li>
					</ul>
				</Pannel>

				<Pannel title='I do not have a big audience, but I am usually the go-to person for my friends and family. Can  I contribute?'>
					Yes, you can! Web3 gives a level playing field to everyone. If some of
					the creators in the network with a bigger following like your
					collection, they will share it in their network!
				</Pannel>

				<Pannel title='I am not that good at shopping. Is this platform only meant for shopping enthusiasts?'>
					No! You can contribute in other ways. For example, if you are an
					artist, you can create and decorate your own collection page and just
					invite others to create collections. If you are a writer, all you do
					is connect your blog and you get help from the AI assistant to match
					products to your blog!
					<br />
					<br />
					If you are not a shopping enthusiast, it is likely that you like
					others to recommend products for you and avoid the pain of choosing.
					You even earn points for buying products that others recommend.
				</Pannel>
			</div>
		</div>
	);
};

export default Accordion;
