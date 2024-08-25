import 'animate.css';
import 'nprogress/nprogress.css';
import 'react-loading-skeleton/dist/skeleton.css';
import '~/styles/globals.scss';
import '~/styles/magic.min.css';

import { Analytics } from '@vercel/analytics/react';
import { Provider as JotaiProvider } from 'jotai';
import { useRouter } from 'next/router';
import Script from 'next/script';
import { ReactElement, ReactNode, useEffect, useState } from 'react';
import { useEventListener, useLocalStorage } from 'usehooks-ts';
import MainLayout from '~/components/layouts/MainLayout';
import NotificationObserver from '~/components/shared/NotificationObserver';
import { HistoryRouteContextProvider } from '~/context/HistoryRouteContext';
import { SocketContextProvider } from '~/context/SocketContext';
import { SubscriptionContextProvider } from '~/context/SubscriptionContext';
import { register } from '~/services/registerServiceWorkers';
import { Subscription } from '~/types';
import { GA_TRACKING_ID, pageview } from '~/utils/gtag';

import type { NextPage } from 'next';
import type { AppProps } from 'next/app';

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

// Router.events.on('routeChangeStart', () => NProgress.start);
// Router.events.on('routeChangeComplete', () => NProgress.done);
// Router.events.on('routeChangeError', () => NProgress.done);

function MyApp({
  Component,
  pageProps,
}: // pageProps: { session, ...pageProps },
AppPropsWithLayout) {
  const router = useRouter();
  const [_, setIsSupportedSW] = useLocalStorage('supportSW', false);
  const [subscription, setSubscription] = useState<Subscription | null>(null);

  //fix session state next auth loss
  //ref: https://stackoverflow.com/questions/70405436/next-auth-how-to-update-the-session-client-side
  //https://github.com/nextauthjs/next-auth/issues/596#issuecomment-943453568
  useEventListener('focus', () => {
    const event = new Event('visibilitychange');
    document.dispatchEvent(event);
  });

  useEffect(() => {
    const handleRouteChange = (url: string) => {
      pageview(url);
    };
    router.events.on('routeChangeComplete', handleRouteChange);
    router.events.on('hashChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
      router.events.off('hashChangeComplete', handleRouteChange);
    };
  }, [router.events]);

  //load service workers script:
  useEffect(() => {
    if (!('serviceWorker' in navigator)) {
      console.error('No Service Worker support!');
      return;
    }

    if (!('PushManager' in window)) {
      console.error('No Push API Support!');
      return;
    }

    setIsSupportedSW(true);

    (async function () {
      const subscription = await register();
      if (!subscription) return;

      const parsed = JSON.parse(JSON.stringify(subscription));

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { expirationTime, ...rest } = parsed;

      setSubscription(rest);
    })();
  }, []);

  const getLayout =
    Component.getLayout ??
    ((page: any) => (
      <MainLayout showHeader showFooter>
        {page}
      </MainLayout>
    ));

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
      />

      <Script id="google-analytics" strategy="afterInteractive">
        {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_TRACKING_ID}', {
              page_path: window.location.pathname,
            });
        `}
      </Script>

      <Analytics />

      <JotaiProvider>
        <SubscriptionContextProvider value={subscription}>
          <NotificationObserver>
            {/* <SocketContextProvider> */}
            <HistoryRouteContextProvider>
              {getLayout(<Component {...pageProps} />)}
            </HistoryRouteContextProvider>
            {/* </SocketContextProvider> */}
          </NotificationObserver>
        </SubscriptionContextProvider>
      </JotaiProvider>
    </>
  );
}

export default MyApp;
