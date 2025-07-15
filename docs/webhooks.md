# It's Ready - Webhook Documentation

## Overview

This document provides detailed information about the webhooks used in the "It's Ready" food freshness analysis application. The application uses n8n webhooks to process food images and return freshness analysis results.

## Webhook URLs

### Production Webhook
```
https://nuworld.app.n8n.cloud/webhook/f9afe891-e6f7-4702-9348-7485bfad5c68
```

### Test Webhook
```

https://nuworld.app.n8n.cloud/webhook-test/f9afe891-e6f7-4702-9348-7485bfad5c68
```

## Implementation Details

### Request Format

When sending images to the webhook, use the following format:

```javascript
// POST request to webhook URL
{
  // Important: Include the full data URL format with the prefix
  "image": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEA...",
  "filename": "image_filename.jpg",
  "contentType": "image/jpeg",
  "timestamp": "2025-04-13T21:15:00.000Z"
}
```

**Note**: n8n expects the image in complete data URL format (`data:image/jpeg;base64,...`) to properly recognize binary data. Do not strip the prefix.

### Response Format

The webhook will return the analysis results in the following format:

```javascript
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

## Testing vs. Production Webhooks

### Test Webhook Workflow

1. **Test webhooks require activation before each use**:
   - In the n8n editor, click the "Test workflow" button on the canvas
   - The test webhook will then be active for ONE request
   - Each test call requires re-activation in the n8n editor

2. **Testing Process**:
   - Activate the webhook in n8n
   - Make your API call quickly after activation
   - Review the results in the n8n canvas

### Production Webhook Workflow

1. **Production webhooks remain active**:
   - Deploy the workflow in production mode
   - The webhook remains continuously active without needing reactivation
   - All calls are logged in the Executions tab rather than showing in the canvas

## Example API Calls

### cURL Example

```bash
curl -X POST "https://nuworld.app.n8n.cloud/webhook/f9afe891-e6f7-4702-9348-7485bfad5c68" \
-H "Content-Type: application/json" \
-d '{
  "image": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEA...",
  "filename": "food_image.jpg",
  "contentType": "image/jpeg",
  "timestamp": "2025-04-13T21:15:00.000Z"
}'
```

### JavaScript Example

```javascript
// Convert image to base64
const fileReader = new FileReader();
fileReader.readAsDataURL(imageFile);
fileReader.onload = async () => {
  const base64Image = fileReader.result;
  
  const response = await fetch("https://nuworld.app.n8n.cloud/webhook/667fdda4-da90-487e-9c38-0c7fa7b7dfd9", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      image: base64Image,
      filename: imageFile.name,
      contentType: imageFile.type,
      timestamp: new Date().toISOString()
    })
  });
  
  const result = await response.json();
  console.log(result);
};
```

## CORS Considerations

When integrating with n8n webhooks from a browser-based application, you may encounter Cross-Origin Resource Sharing (CORS) issues. This happens because browsers prevent web applications from making direct requests to domains different from the one hosting the application.

### CORS Solution

To address CORS issues, we've implemented a proxy API route in our Next.js application:

1. **Proxy API Route**: `/api/analyze`
   - This route forwards requests to the n8n webhook
   - Located at: `app/api/analyze/route.ts` 
   - Handles all error responses and logging

### Implementation Details

Instead of calling the n8n webhook directly from the browser:

```javascript
// DON'T do this from client-side code - will cause CORS errors
fetch('https://nuworld.app.n8n.cloud/webhook/f9afe891-e6f7-4702-9348-7485bfad5c68', {...})
```

Use the proxy API route:

```javascript
// DO this instead - avoids CORS issues
fetch('/api/analyze', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(payload)
})
```

This ensures all communication with the n8n webhook happens server-to-server, avoiding CORS restrictions.

## n8n Webhook Node Configuration

### Key Settings for Our Workflow

- **HTTP Method**: POST
- **Response**: When Last Node Finishes
- **Response Data**: First Entry JSON
- **Binary Property**: Set to receive the image data

### Advanced Options

- **Allowed Origins (CORS)**: Set to allow our frontend domain
- **Binary Property**: Enabled for image reception
- **Raw Body**: Set for JSON format
- **Response Content-Type**: application/json

## Troubleshooting

1. **503 Service Unavailable**: Test webhook not activated or already used
2. **404 Not Found**: Incorrect webhook URL or webhook not registered
3. **No Response**: n8n workflow might have errors processing the request

## Reference

For complete n8n webhook documentation, visit the [n8n Webhook Node Documentation](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.webhook/).

## This is the structured json output from the n8n workflow to be returned to the frontend

```json
{
"identifiedFood": 
"Raw Beef Steak",
"visualAssessment": 
"Good",
"keyIndicators": 
"Meat shows bright red color with apparent firmness and minimal discoloration.",
"estimatedFreshnessDays": 
"1-2",
"confidence": 
"High",
"importantDisclaimer": 
"DISCLAIMER: This assessment is based SOLELY on visual appearance in the provided image and CANNOT guarantee food safety. Odor, texture, storage history, and invisible contaminants are critical factors not assessed. When in doubt, throw it out. This is NOT a substitute for professional food safety judgment or official guidelines."
}
```