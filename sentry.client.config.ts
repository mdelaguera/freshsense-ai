import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  enabled: !!process.env.SENTRY_DSN,
  
  // Environment setup
  environment: process.env.NODE_ENV || 'development',
  
  // Performance monitoring
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  
  // Session Replay - only enable if DSN is provided
  replaysSessionSampleRate: process.env.SENTRY_DSN ? 0.1 : 0,
  replaysOnErrorSampleRate: process.env.SENTRY_DSN ? 1.0 : 0,
  
  // Debug mode for development
  debug: process.env.NODE_ENV === 'development',
  
  // Integrations - only add Replay if Sentry is configured
  integrations: process.env.SENTRY_DSN ? [
    Sentry.replayIntegration({
      maskAllText: true,
      blockAllMedia: true,
    }),
  ] : [],
  
  // Release tracking
  release: process.env.npm_package_version,
  
  // Filter out noise
  beforeSend(event) {
    // Filter out development noise
    if (process.env.NODE_ENV === 'development') {
      console.log('Sentry event:', event);
    }
    
    // Filter out certain errors
    if (event.exception) {
      const error = event.exception.values?.[0];
      if (error?.type === 'ChunkLoadError' || error?.type === 'ResizeObserver loop limit exceeded') {
        return null;
      }
    }
    
    return event;
  },
  
  // Set user context
  initialScope: {
    tags: {
      component: 'FreshSense-Client'
    }
  }
});