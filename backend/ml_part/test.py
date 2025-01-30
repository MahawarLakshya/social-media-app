import unittest
import requests
import os
import pytesseract
import logging
from io import BytesIO

class TestMemeDetection(unittest.TestCase):

    def extract_text(self):
        # Sample image URL for testing (use a valid image URL)
        image_url = 'https://ichef.bbci.co.uk/images/ic/1920xn/p072ms6r.jpg'

        # You can directly test the image content instead of URL, for unit testing
        # Download the image and save it as BytesIO object for testing
        response = requests.get(image_url)
        image_data = BytesIO(response.content)

        # Save the image temporarily as a file
        temp_image_path = 'image.png'
        with open(temp_image_path, 'wb') as f:
            f.write(image_data.getbuffer())

        # Extract text from the image
        extracted_text = extract_text(temp_image_path)
        
        # Print extracted text for verification
        print(f"Extracted Text: {extracted_text}")
        
        # Assertion to ensure that the text is extracted
        self.assertTrue(extracted_text.strip() != '', "No text was extracted!")

        # Cleanup the temporary file
        if os.path.exists(temp_image_path):
            os.remove(temp_image_path)

if __name__ == '__main__':
    unittest.main()
