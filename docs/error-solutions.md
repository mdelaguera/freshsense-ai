# Troubleshooting n8n Webhook Errors

## Error 520: Web Server Returning Unknown Error

### Problem Description

The n8n webhook is returning a Cloudflare Error 520, which indicates that the origin web server (n8n) is not responding properly or is experiencing internal issues. This explains why image uploads are failing and showing the fallback demo data.

### Root Causes

1. **n8n Service Status**: The n8n cloud instance might be experiencing downtime or service disruptions
2. **Webhook Expiration**: N8n test webhooks might have expired or been deactivated
3. **Workflow Error**: The n8n workflow might contain an error in processing the image data
4. **Rate Limiting**: Possible rate limiting or quota restrictions on the n8n account

### Immediate Solutions

1. **Verify n8n Service Status**
   - Check if the n8n cloud service is operational
   - Login to your n8n dashboard and verify the workflow is active

2. **Re-activate Test Webhooks**
   - Test webhooks in n8n require activation before each use
   - In the n8n dashboard, locate your webhook node and click "Activate"

3. **Check Workflow for Errors**
   - Review the n8n workflow execution logs
   - Ensure all nodes are properly configured, especially for image processing

4. **Test with Smaller Images**
   - Reduce image size/resolution before uploading
   - Large images might exceed processing limits

### Long-Term Solutions

1. **Implement Robust Retry Logic**
   ```javascript
   // Example retry implementation for API client
   async function retryFetch(url, options, maxRetries = 3) {
     for (let attempt = 0; attempt < maxRetries; attempt++) {
       try {
         const response = await fetch(url, options);
         if (response.ok) return response;
       } catch (err) {
         console.log(`Attempt ${attempt + 1} failed: ${err.message}`);
         if (attempt === maxRetries - 1) throw err;
       }
       // Exponential backoff
       await new Promise(r => setTimeout(r, 1000 * Math.pow(2, attempt)));
     }
   }
   ```

2. **Consider Alternative Webhook Architecture**
   - Host a custom webhook endpoint with Express/Node.js
   - Build a more resilient middleware layer

3. **Implement Circuit Breaker Pattern**
   - Temporarily disable webhook calls after consecutive failures
   - Automatically fall back to mock data during outages

## How Our Error Handling Helps

Our current implementation already includes several safeguards:

1. Server-side proxy to avoid CORS issues
2. Comprehensive error catching and logging
3. Graceful degradation with mock responses
4. Informative user feedback

## Next Steps

1. Contact the n8n service provider to verify account status
2. Consider upgrading to a more reliable plan if frequent outages occur
3. Implement the retry logic suggested above
4. Add monitoring for webhook availability

Remember that n8n test webhooks are primarily for development and not ideal for production use. Consider using production webhooks with proper authentication for more reliable operation.
