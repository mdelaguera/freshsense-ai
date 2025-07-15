from PIL import Image
import io

def validate_image(file_stream):
    """
    Validates that the uploaded file is a valid image and meets requirements
    
    Args:
        file_stream: The uploaded file object
    
    Returns:
        dict: A dictionary with validation result
    """
    # Save the current position in the file
    current_position = file_stream.tell()
    
    try:
        # Try to open the image with PIL
        img = Image.open(file_stream)
        img.verify()  # Verify it's actually an image
        
        # Reset file pointer after verification
        file_stream.seek(current_position)
        
        # Check image dimensions
        img = Image.open(file_stream)
        width, height = img.size
        
        # Check if image is too small
        if width < 100 or height < 100:
            return {
                'valid': False,
                'message': 'Image is too small. Minimum dimensions: 100x100 pixels.'
            }
            
        # Check if image is extremely large
        if width > 4000 or height > 4000:
            return {
                'valid': False,
                'message': 'Image is too large. Maximum dimensions: 4000x4000 pixels.'
            }
            
        # Reset file pointer
        file_stream.seek(current_position)
        
        return {'valid': True, 'message': 'Image validation successful'}
        
    except Exception as e:
        # Reset file pointer
        file_stream.seek(current_position)
        return {'valid': False, 'message': f'Invalid image file: {str(e)}'}

def process_image(file_stream):
    """
    Processes the image for optimal transmission to n8n
    - Resizes large images
    - Optimizes quality
    - Returns a file-like object ready to be sent
    
    Args:
        file_stream: The uploaded file object
    
    Returns:
        BytesIO: A file-like object containing the processed image
    """
    # Save the current position in the file
    current_position = file_stream.tell()
    
    try:
        # Open the image
        img = Image.open(file_stream)
        
        # Convert to RGB if image is in RGBA mode (PNG with transparency)
        if img.mode == 'RGBA':
            img = img.convert('RGB')
            
        # Resize if the image is too large
        max_size = 1500
        if img.width > max_size or img.height > max_size:
            # Calculate the ratio
            ratio = min(max_size / img.width, max_size / img.height)
            new_size = (int(img.width * ratio), int(img.height * ratio))
            img = img.resize(new_size, Image.LANCZOS)
            
        # Create a BytesIO object to store the processed image
        output = io.BytesIO()
        
        # Save the image to the BytesIO object with jpeg format for consistency
        img.save(output, format='JPEG', quality=85, optimize=True)
        
        # Seek to the beginning of the BytesIO object
        output.seek(0)
        
        return output
        
    except Exception as e:
        # If processing fails, reset the file pointer and return the original file
        file_stream.seek(current_position)
        return file_stream
