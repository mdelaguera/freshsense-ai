import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  
  // Environment setup
  environment: process.env.NODE_ENV || 'development',
  
  // Performance monitoring
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  
  // Debug mode for development
  debug: process.env.NODE_ENV === 'development',
  
  // Release tracking
  release: process.env.npm_package_version,
  
  // Filter out noise
  beforeSend(event) {
    // Filter out development noise
    if (process.env.NODE_ENV === 'development') {
      console.log('Sentry server event:', event);
    }
    
    return event;
  },
  
  // Set context
  initialScope: {
    tags: {
      component: 'FreshSense-Server'
    }
  }
});