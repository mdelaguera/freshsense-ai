# It's Ready - API Documentation

## Overview

This document provides detailed information about the API used in the "It's Ready" food freshness analysis application. The application uses a REST API to process food images and return freshness analysis results.

## API Endpoints

### Production Endpoint
```
https://api.example.com/analyze
```

### Test Endpoint
```
https://api-test.example.com/analyze
```

## Implementation Details

### Request Format

When sending images to the API endpoint, use the following format:

```javascript
// POST request to API endpoint
{
  // Important: Include the full data URL format with the prefix
  "image": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEA...",
  "filename": "image_filename.jpg",
  "contentType": "image/jpeg",
  "timestamp": "2025-04-13T21:15:00.000Z"
}
```

**Note**: The API expects the image in complete data URL format (`data:image/jpeg;base64,...`) to properly recognize binary data. Do not strip the prefix.

### Response Format

The API will return the analysis results in the following format:

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
  
  const response = await fetch("https://api.example.com/analyze", {
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

When integrating with external APIs from a browser-based application, you may encounter Cross-Origin Resource Sharing (CORS) issues. This happens because browsers prevent web applications from making direct requests to domains different from the one hosting the application.

### CORS Solution

To address CORS issues, we've implemented a proxy API route in our Next.js application:

1. **Proxy API Route**: `/api/analyze`
   - This route forwards requests to the external API
   - Located at: `app/api/analyze/route.ts` 
   - Handles all error responses and logging

### Implementation Details

Instead of calling the external API directly from the browser:

```javascript
// DON'T do this from client-side code - will cause CORS errors
fetch('https://api.example.com/analyze', {...})
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

This ensures all communication with the external API happens server-to-server, avoiding CORS restrictions.

## API Configuration

### Key Settings for Our API

- **HTTP Method**: POST
- **Response**: JSON format
- **Content-Type**: application/json
- **Binary Data**: Base64 encoded images

### Advanced Options

- **CORS**: Configured to allow frontend domain
- **Request Format**: JSON with base64 image data
- **Response Format**: Structured JSON
- **Content-Type**: application/json

## Troubleshooting

1. **503 Service Unavailable**: API service may be down or overloaded
2. **404 Not Found**: Incorrect API endpoint URL
3. **No Response**: API may have errors processing the request

## Reference

Refer to your API provider's documentation for complete integration details.

## This is the structured JSON output from the API to be returned to the frontend

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