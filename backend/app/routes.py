from flask import Blueprint, request, jsonify, current_app
import requests
from werkzeug.utils import secure_filename
import os
import uuid
import json
from .utils.image_processor import process_image, validate_image
from .utils.response_formatter import format_response
import base64
from io import BytesIO

main_bp = Blueprint('main', __name__)

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@main_bp.route('/analyze', methods=['POST'])
def analyze_food():
    """
    API endpoint to receive food images, process them through n8n,
    and return freshness analysis results
    """
    # Check if the post request has the file part
    if 'image' not in request.files:
        return jsonify({'error': 'No image provided'}), 400
        
    file = request.files['image']
    
    # If user does not select file, browser also
    # submit an empty part without filename
    if file.filename == '':
        return jsonify({'error': 'No selected image'}), 400
        
    if file and allowed_file(file.filename):
        # Generate a secure filename with UUID to prevent collisions
        filename = secure_filename(f"{uuid.uuid4()}_{file.filename}")
        
        # Validate image before processing
        validation_result = validate_image(file)
        if not validation_result['valid']:
            return jsonify({'error': validation_result['message']}), 400
            
        # Process the image (resize, optimize if needed)
        processed_image = process_image(file)
        
        try:
            # Convert image to base64 for n8n webhook
            image_data = processed_image.read()
            encoded_image = base64.b64encode(image_data).decode('utf-8')
            
            # Prepare the JSON payload for the webhook
            payload = {
                "image": encoded_image,
                "filename": filename,
                "contentType": file.content_type
            }
            
            # Send to n8n webhook
            response = requests.post(
                current_app.config['N8N_WEBHOOK_URL'],
                json=payload,
                headers={"Content-Type": "application/json"},
                timeout=30  # Set a reasonable timeout
            )
            
            # Check if the request was successful
            if response.status_code == 200:
                try:
                    # Parse the response JSON
                    n8n_response = response.json()
                    
                    # Format the response for the frontend based on the n8n webhook output structure
                    formatted_response = {
                        "timestamp": n8n_response.get("timestamp", ""),
                        "image_source": filename,
                        "identified_food": n8n_response.get("output", {}).get("identifiedFood", "Unknown"),
                        "visual_assessment": n8n_response.get("output", {}).get("visualAssessment", "Unknown"),
                        "key_visual_indicators": n8n_response.get("output", {}).get("keyIndicators", ""),
                        "estimated_remaining_freshness_days": n8n_response.get("output", {}).get("estimatedFreshnessDays", "0"),
                        "assessment_confidence": n8n_response.get("output", {}).get("confidence", "Low"),
                        "disclaimer": n8n_response.get("output", {}).get("importantDisclaimer", ""),
                        "user_verification_notes": "",
                        "raw_response": n8n_response  # Include raw response for debugging
                    }
                    
                    return jsonify(formatted_response), 200
                except json.JSONDecodeError:
                    return jsonify({'error': 'Invalid response format from n8n'}), 500
            else:
                return jsonify({
                    'error': f'n8n service returned status code: {response.status_code}',
                    'message': response.text
                }), response.status_code
                
        except requests.exceptions.RequestException as e:
            # Handle connection errors, timeouts, etc.
            return jsonify({'error': 'Failed to connect to n8n service', 'details': str(e)}), 503
    
    return jsonify({'error': 'Invalid file type. Allowed types: png, jpg, jpeg'}), 400
