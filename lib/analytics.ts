/**
 * Google Analytics 4 integration and error tracking for FreshSense
 */

import ReactGA from 'react-ga4';
// import * as Sentry from '@sentry/nextjs'; // Temporarily disabled for troubleshooting

// GA4 Measurement ID - replace with actual ID when available
const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || 'G-PLACEHOLDER';

// Initialize Google Analytics
export const initGA = () => {
  if (typeof window !== 'undefined' && GA_MEASUREMENT_ID !== 'G-PLACEHOLDER') {
    ReactGA.initialize(GA_MEASUREMENT_ID, {
      debug: process.env.NODE_ENV === 'development',
    });
    console.log('Google Analytics initialized with ID:', GA_MEASUREMENT_ID);
  } else {
    console.log('Google Analytics not initialized - missing measurement ID or server-side');
  }
};

// Track page views
export const trackPageView = (path: string, title?: string) => {
  if (typeof window !== 'undefined' && GA_MEASUREMENT_ID !== 'G-PLACEHOLDER') {
    ReactGA.send({ 
      hitType: 'pageview', 
      page: path,
      title: title 
    });
    console.log('Page view tracked:', path, title);
  }
};

// Track custom events
export const trackEvent = (action: string, category: string, label?: string, value?: number) => {
  if (typeof window !== 'undefined' && GA_MEASUREMENT_ID !== 'G-PLACEHOLDER') {
    ReactGA.event({
      action,
      category,
      label,
      value,
    });
    console.log('Event tracked:', { action, category, label, value });
  }
};

// Specific event trackers for FreshSense
export const trackImageUpload = (fileSize: number, fileType: string) => {
  trackEvent('image_upload', 'user_interaction', `${fileType}_${Math.round(fileSize / 1024)}KB`);
};

export const trackAnalysisRequest = (hasWebhook: boolean) => {
  trackEvent('analysis_request', 'api_usage', hasWebhook ? 'webhook_available' : 'simulated_data');
};

export const trackAnalysisComplete = (foodType: string, confidence: string, duration: number) => {
  trackEvent('analysis_complete', 'api_success', `${foodType}_${confidence}`, duration);
};

export const trackAnalysisError = (errorType: string) => {
  trackEvent('analysis_error', 'api_error', errorType);
};

export const trackUserJourney = (step: string) => {
  trackEvent('user_journey', 'navigation', step);
};

// Track conversion events for future monetization
export const trackConversion = (conversionType: string, value?: number) => {
  trackEvent('conversion', 'business_metric', conversionType, value);
};

// Track user engagement
export const trackEngagement = (engagementType: string, duration?: number) => {
  trackEvent('engagement', 'user_behavior', engagementType, duration);
};

// Sentry Error Tracking Functions (temporarily disabled)
export const reportError = (error: Error, context?: Record<string, unknown>) => {
  console.error('Error reported (Sentry disabled):', error, context);
  
  // Set additional context
  if (context) {
    // Sentry.setContext('error_context', context); // Temporarily disabled
  }
  
  // Report to Sentry
  // Sentry.captureException(error); // Temporarily disabled
  
  // Also track in Google Analytics
  trackEvent('error_occurred', 'system_error', error.message);
};

export const reportMessage = (message: string, level: 'info' | 'warning' | 'error' = 'info', context?: Record<string, unknown>) => {
  console.log(`Message (${level}):`, message, context);
  
  // Set additional context
  if (context) {
    // Sentry.setContext('message_context', context); // Temporarily disabled
  }
  
  // Report to Sentry
  // Sentry.captureMessage(message, level); // Temporarily disabled
};

export const setUserContext = (userId?: string, email?: string, additionalData?: Record<string, unknown>) => {
  // Sentry.setUser({
  //   id: userId,
  //   email: email,
  //   ...additionalData
  // }); // Temporarily disabled
  console.log('User context set:', { userId, email, additionalData });
};

export const addBreadcrumb = (message: string, category: string, level: 'info' | 'warning' | 'error' = 'info', data?: Record<string, unknown>) => {
  // Sentry.addBreadcrumb({
  //   message,
  //   category,
  //   level,
  //   data,
  //   timestamp: Date.now() / 1000,
  // }); // Temporarily disabled
  console.log('Breadcrumb:', { message, category, level, data });
};

// Enhanced error tracking for specific FreshSense operations
export const reportApiError = (endpoint: string, error: Error, requestData?: unknown) => {
  addBreadcrumb(`API Error: ${endpoint}`, 'api', 'error', {
    endpoint,
    requestData: requestData ? JSON.stringify(requestData).substring(0, 500) : undefined
  });
  
  reportError(error, {
    endpoint,
    error_type: 'api_error',
    request_data: requestData
  });
};

export const reportImageProcessingError = (fileInfo: { name: string, size: number, type: string }, error: Error) => {
  addBreadcrumb('Image Processing Error', 'image', 'error', fileInfo);
  
  reportError(error, {
    file_info: fileInfo,
    error_type: 'image_processing_error'
  });
};

export const reportWebhookError = (webhookUrl: string, error: Error, payload?: unknown) => {
  addBreadcrumb(`Webhook Error: ${webhookUrl}`, 'webhook', 'error');
  
  reportError(error, {
    webhook_url: webhookUrl,
    error_type: 'webhook_error',
    payload_size: payload ? JSON.stringify(payload).length : 0
  });
};