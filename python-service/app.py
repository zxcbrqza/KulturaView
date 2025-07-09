from flask import Flask, request, jsonify, send_file
import cv2
import numpy as np
from PIL import Image
import io
import os

app = Flask(__name__)

@app.route('/process', methods=['POST'])
def process_image():
    file = request.files.get('image')
    procedure = request.form.get('procedureType')
    enhancement = int(request.form.get('enhancementLevel', 50))

    if not file:
        return jsonify({"error": "No file uploaded"}), 400

    # Read image
    image = np.array(Image.open(file.stream).convert('RGB'))

    # Example transformation logic (simplified):
    if procedure == "lip_fillers":
        # Example: increase red tones
        image[:, :, 0] = np.clip(image[:, :, 0] + enhancement, 0, 255)
    elif procedure == "eye_brightening":
        # Example: increase brightness in the whole image
        image = cv2.convertScaleAbs(image, alpha=1 + enhancement / 100, beta=10)
    elif procedure == "skin_smoothing":
        # Example: apply blur
        image = cv2.GaussianBlur(image, (7, 7), sigmaX=enhancement / 20)

    # Convert back to file
    _, img_encoded = cv2.imencode('.jpg', image)
    image_bytes = img_encoded.tobytes()

    # Return the image as a file-like response
    return send_file(io.BytesIO(image_bytes), mimetype='image/jpeg')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001)
