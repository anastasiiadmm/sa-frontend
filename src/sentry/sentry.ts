import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';

const { REACT_APP_SENTRY_DSN } = process.env;

const initSentry = () => {
  if (REACT_APP_SENTRY_DSN) {
    Sentry.init({
      dsn: REACT_APP_SENTRY_DSN,
      integrations: [new BrowserTracing()],
      tracesSampleRate: 1.0,
    });
  }
};

export default initSentry;
