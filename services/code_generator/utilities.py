import base64
import logging
import requests

# Configure logging
logger = logging.getLogger()
logger.setLevel(logging.INFO)

def s3_image_url_to_base64(url: str) -> str:
    """
    Convert an S3 image URL to base64 encoded string
    
    Args:
        url: S3 URL of the image
        
    Returns:
        Base64 encoded string of the image
        
    Raises:
        requests.exceptions.RequestException: If the request to fetch the image fails
    """
    try:
        logger.info(f"Fetching image from URL: {url}")
        response = requests.get(url, timeout=10)
        response.raise_for_status()

        # Encode to base64
        img_base64 = base64.b64encode(response.content).decode("utf-8")
        logger.info(f"Successfully converted image to base64. Size: {len(img_base64)}")
        
        return img_base64
    except requests.exceptions.RequestException as e:
        logger.error(f"Failed to fetch image from URL: {url}. Error: {str(e)}")
        raise