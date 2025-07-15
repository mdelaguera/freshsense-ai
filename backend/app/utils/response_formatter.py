import datetime
from typing import Dict, Any

def format_response(n8n_response: Dict[str, Any]) -> Dict[str, Any]:
    """
    Formats the response from n8n into a structured format for the frontend
    
    Args:
        n8n_response: Raw response from the n8n webhook
    
    Returns:
        Dict: Formatted response with consistent schema
    """
    # Set default response structure
    formatted_response = {
        "timestamp": datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S %Z'),
        "image_source": "",
        "identified_food": "Unknown",
        "visual_assessment": "Unknown",
        "key_visual_indicators": "",
        "estimated_remaining_freshness_days": "0",
        "assessment_confidence": "Low",
        "disclaimer": get_default_disclaimer(),
        "user_verification_notes": "",
        "error": None,
        "raw_response": n8n_response  # Include raw response for debugging
    }
    
    try:
        # Extract data from n8n response
        # The structure might vary based on the actual n8n workflow output
        if 'data' in n8n_response:
            data = n8n_response['data']
            
            # Map fields from n8n response to our formatted response
            # Adjust these mappings based on the actual n8n response structure
            if 'timestamp' in data:
                formatted_response['timestamp'] = data['timestamp']
                
            if 'image_name' in data:
                formatted_response['image_source'] = data['image_name']
                
            if 'food_item' in data:
                formatted_response['identified_food'] = data['food_item']
                
            if 'assessment' in data:
                formatted_response['visual_assessment'] = data['assessment']
                
            if 'visual_indicators' in data:
                formatted_response['key_visual_indicators'] = data['visual_indicators']
                
            if 'freshness_days' in data:
                formatted_response['estimated_remaining_freshness_days'] = data['freshness_days']
                
            if 'confidence' in data:
                formatted_response['assessment_confidence'] = data['confidence']
                
            if 'disclaimer' in data:
                formatted_response['disclaimer'] = data['disclaimer']
            
        return formatted_response
    
    except Exception as e:
        # If any error occurs during formatting, return error information
        formatted_response['error'] = f"Error formatting response: {str(e)}"
        return formatted_response

def get_default_disclaimer() -> str:
    """
    Returns the default disclaimer text
    
    Returns:
        str: Disclaimer text
    """
    return ("DISCLAIMER: This assessment is based SOLELY on visual appearance and should NOT "
            "be considered a definitive determination of food safety. Many foodborne pathogens "
            "cannot be detected visually. When in doubt, throw it out. Always use proper food "
            "handling practices and follow local health guidelines.")
