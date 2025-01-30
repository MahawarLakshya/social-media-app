from flask import Flask, request, jsonify
import cv2
import pytesseract
import numpy as np
import requests
import logging
import base64

# Configure Tesseract path (update if different on your system)
pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

app = Flask(__name__)
logging.basicConfig(level=logging.ERROR)

def extract_text_from_image(image_content):
    """Optimized text extraction using minimal preprocessing"""
    try:
        # Decode image with reduced buffer copies
        img = cv2.imdecode(np.frombuffer(image_content, np.uint8), cv2.IMREAD_GRAYSCALE)
        if img is None:
            return ""
        
        # Downscale large images while maintaining aspect ratio
        h, w = img.shape
        if max(h, w) > 800:
            scale = 800 / max(h, w)
            img = cv2.resize(img, None, fx=scale, fy=scale, interpolation=cv2.INTER_AREA)

        # Fast adaptive thresholding for better contrast
        img = cv2.threshold(img, 0, 255, cv2.THRESH_BINARY | cv2.THRESH_OTSU)[1]

        # Optimized Tesseract configuration for speed
        text = pytesseract.image_to_string(
            img,
            config='--psm 6 --oem 1 -c tessedit_char_whitelist=ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
        )

        return text.strip()

    except Exception as e:
        logging.error(f"Image processing error: {e}")
        return ""

def check_if_image_contains_text(image_url):
    """Efficient image content checking with memory management"""
    try:
        # Handle base64 images without regex
        if image_url.startswith("data:image/"):
            _, data = image_url.split(",", 1)
            image_content = base64.b64decode(data)
        else:
            # Stream download to avoid large memory allocation
            with requests.get(image_url, stream=True, timeout=5) as response:
                response.raise_for_status()
                image_content = b''.join(response.iter_content(chunk_size=8192))

        # Process image and immediately release memory
        extracted_text = extract_text_from_image(image_content)
        return bool(extracted_text)

    except Exception as e:
        logging.error(f"Image check error: {e}")
        return None

@app.route('/check_meme', methods=['POST'])
def check_meme():
    """Optimized endpoint with strict input validation"""
    try:
        if not request.is_json:
            return jsonify({'error': 'Invalid content type'}), 400

        data = request.get_json()
        image_url = data.get('image_url', '')

        if not isinstance(image_url, str) or not image_url:
            return jsonify({'error': 'Valid image URL required'}), 400

        contains_text = check_if_image_contains_text(image_url)
        
        if contains_text is None:
            return jsonify({'error': 'Image processing failed'}), 500
            
        return jsonify({'is_meme': contains_text})

    except Exception as e:
        logging.error(f"Endpoint error: {e}")
        return jsonify({'error': 'Internal server error'}), 500

if __name__ == "__main__":
    app.run(port=5100, threaded=False)