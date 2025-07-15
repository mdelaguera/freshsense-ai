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
  
  // Set context
  initialScope: {
    tags: {
      component: 'FreshSense-Edge'
    }
  }
});