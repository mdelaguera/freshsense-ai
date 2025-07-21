# Deployment Guide

## Overview

This document outlines the deployment process for the "It's Ready" application, which consists of:

1. Next.js frontend deployed to Vercel
2. Flask backend for image processing
3. API integration for food freshness analysis

## Frontend Deployment

The frontend is already deployed to Vercel at:
https://its-ready-dxg3nm589-nuworld-agency.vercel.app

### Environment Variables

The frontend requires the following environment variables:

```
NEXT_PUBLIC_API_URL=https://its-ready-backend.vercel.app
```

### Deploying Updates

To deploy updates to the frontend:

1. Push changes to the GitHub repository
2. Vercel will automatically deploy the changes
3. Or manually trigger a deployment from the Vercel dashboard

## Backend Deployment

The backend can be deployed to Vercel as a serverless function or to another hosting provider.

### Environment Variables

The backend requires the following environment variables:

```
SECRET_KEY=your_secure_key
API_ENDPOINT_URL=your_api_endpoint_url
```

### Deploying to Vercel

1. Add a `vercel.json` configuration file to the backend directory:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "wsgi.py",
      "use": "@vercel/python"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "wsgi.py"
    }
  ]
}
```

2. Set up the environment variables in the Vercel project settings
3. Deploy using the Vercel CLI or connect to the GitHub repository

## n8n Webhook Integration

The n8n workflow is already set up with the following webhooks:

- Trigger Webhook (GET): `https://nuworld.app.n8n.cloud/webhook/667fdda4-da90-487e-9c38-0c7fa7b7dfd9`
- Outflow Webhook (POST): `https://nuworld.app.n8n.cloud/webhook/667fdda4-da90-487e-9c38-0c7fa7b7dfd9`

### Expected Response Format

The n8n webhook will return data in the following format:

```json
{
  "output": {
    "identifiedFood": "Raw Steak",
    "visualAssessment": "Very Fresh",
    "keyIndicators": "Meat shows bright red color with minimal discoloration.",
    "estimatedFreshnessDays": "3-5",
    "confidence": "High",
    "importantDisclaimer": "DISCLAIMER: This assessment is based SOLELY on visual appearance..."
  }
}
```

## Testing the Integration

To test the complete integration:

1. Start the frontend locally:
   ```
   cd "F:\NuWorld Agency\maker n8n\it-works"
   npm run dev
   ```

2. Start the backend locally:
   ```
   cd "F:\NuWorld Agency\maker n8n\it-works\backend"
   python wsgi.py
   ```

3. Upload an image through the frontend interface
4. The backend will send the image to the n8n webhook
5. n8n will process the image and return the analysis results
6. The frontend will display the formatted results

## Troubleshooting

- **CORS Issues**: Ensure the backend has CORS enabled for the frontend domain
- **Webhook Timeout**: If the n8n webhook is taking too long, adjust the timeout value in the backend code
- **Image Format Issues**: Ensure images are being converted to base64 correctly
- **Response Format Mismatch**: Check the format of the response from n8n against what the frontend expects
