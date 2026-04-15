import React, { useLayoutEffect, useState } from 'react';
import Head from 'next/head';
import { Helmet } from 'react-helmet';

// Ant Design base styles (required for Grid/Row/Col gutters and component alignment)
import 'antd/dist/reset.css';

// Import Tailwind CSS first (must be before SCSS that uses @layer)
import '../src/style/global.css';
// Then import SCSS utilities that extend Tailwind
import '../src/style/index.module.scss';
import '../src/pageComponents/swiftlyStyled/pageContents/mainContent.scss';
import '../src/libs/index.css';
// Import custom Ant Design modal and carousel styles
import '../src/pageComponents/Home/Popup.css';

// Import context and state wrappers
import ReduxWrapper from '../src/state/reduxWrapper';
import ActionWrapper from '../src/state/actionWrapper';
import ContextWrapper from '../src/context/contextWrapper';
import { ThemeContextWrapper } from '../src/context/themeContext';

// Import modal components directly (no dynamic imports to avoid hydration issues)
import ProductDetailsCopyModalComponent from '../src/pageComponents/productDetailsCopyModal';
import CollectionShareModalComponent from '../src/pageComponents/collectionShareModal';
import AppLoaderComponent from '../src/pageComponents/appLoader';
import AppMessageModal from '../src/pageComponents/appMessageModal';
import EarnedRewardModal from '../src/pageComponents/earnedRewardModal';
import AiExtractionDataModal from '../src/pageComponents/aiExtractionDataModal';
import CustomProductModal from '../src/pageComponents/customProductModal';
import AutoCreateCollectionModal from '../src/pageComponents/autoCreateCollectionModal';

// Import utilities
import appTracker from '../src/helper/webTracker/appTracker';
import { checkAndGenerateUserId, generateSessionId } from '../src/helper/utils';
import {
  STORE_USER_NAME_BUDGETTRAVEL,
  STORE_USER_NAME_DOTHELOOK,
  STORE_USER_NAME_HEROESVILLAINS,
  STORE_USER_NAME_SAMSKARA,
  STORE_USER_NAME_SWIFTLYSTYLED,
} from '../src/constants/codes';
import {
  access_key,
  is_store_instance,
  current_store_name,
} from '../src/constants/config';

function MyApp({ Component, pageProps }) {
  const [mounted, setMounted] = useState(false);

  // Use useLayoutEffect to set mounted state before browser paints
  useLayoutEffect(() => {
    setMounted(true);
    // Initialize user tracking
    checkAndGenerateUserId();
    generateSessionId();

    // Initialize app tracker
    appTracker.onVisit();
  }, []);

  // Determine font styling based on store
  const fontStyle = is_store_instance
    ? current_store_name === STORE_USER_NAME_SAMSKARA
      ? { fontFamily: 'sans-serif' }
      : current_store_name === STORE_USER_NAME_HEROESVILLAINS
        ? { fontFamily: '"Crimson Text", serif' }
        : {}
    : {};

  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          name="description"
          content="Reach audiences of publishers, creators, and influencers"
        />
        <meta name="og:title" content="Unthink" />
        <meta name="og:image" content="/unthink-logo.png" />
        <meta name="og:description" content="Reach audiences of publishers, creators, and influencers" />
      </Head>

      <div style={fontStyle} suppressHydrationWarning>
        <ThemeContextWrapper>
          <ReduxWrapper>
            <ActionWrapper>
              <ContextWrapper>
                {mounted ? (
                  <>
                    <AppLoaderComponent />
                    <AppMessageModal />
                    <ProductDetailsCopyModalComponent />
                    <CollectionShareModalComponent />
                    <EarnedRewardModal />
                    <AiExtractionDataModal />
                    <CustomProductModal />
                    <AutoCreateCollectionModal />
                  </>
                ) : null}
                <Component {...pageProps} />
              </ContextWrapper>
            </ActionWrapper>
          </ReduxWrapper>
        </ThemeContextWrapper>
      </div>
    </>
  );
}

export default MyApp;
