from flask import Flask, request, jsonify
from pdf2image import convert_from_path, convert_from_bytes
import os
import firebase_admin
from firebase_admin import credentials, storage
from flask_cors import CORS, cross_origin
import io
import PyPDF2

app = Flask(__name__)
CORS(app)

service_account_path = 'serviceAccountKey.json'
cred = credentials.Certificate(service_account_path)
firebase_admin.initialize_app(cred, {'storageBucket': 'ace-space-353cb.appspot.com'})

@app.route('/convert-pdf', methods=['POST'])
@cross_origin()
def convert_pdf_to_image():    
    file = request.files['pdf']

    file_data = file.read()

    pdf_file = io.BytesIO(file_data)

    images = convert_from_bytes(file_data)
    first_image = images[0]

    image_data = io.BytesIO()
    first_image.save(image_data, format='JPEG')
    image_data.seek(0)

    bucket = storage.bucket()
    blob = bucket.blob(file.filename + '_image.jpg')
    blob.upload_from_file(image_data, content_type='image/jpeg')
    blob.make_public()

    image_url = blob.public_url

    response = jsonify({'image_url': image_url})
    response.headers.add('Access-Control-Allow-Origin', 'http://localhost:3000')
    response.headers.add('Access-Control-Allow-Credentials', 'true')
    
    return response 

if __name__ == '__main__':
    app.run(debug=True)