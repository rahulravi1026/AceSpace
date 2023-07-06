from flask import Flask, request, jsonify
from pdf2image import convert_from_path, convert_from_bytes
import os
import firebase_admin
from firebase_admin import credentials, storage
from flask_cors import CORS, cross_origin
import io
import PyPDF2
from urllib.parse import unquote
import time
import random
import string

app = Flask(__name__)
CORS(app)

service_account_path = 'serviceAccountKey.json'
cred = credentials.Certificate(service_account_path)
firebase_admin.initialize_app(cred, {'storageBucket': 'ace-space-353cb.appspot.com'})

def generate_unique_filename(filename):
    timestamp = str(int(time.time()))
    random_chars = ''.join(random.choices(string.ascii_lowercase, k = 6))
    unique_filename = f"{filename}_{timestamp}_{random_chars}"
    return unique_filename


@app.route('/convert-pdf', methods=['POST'])
@cross_origin()
def convert_pdf_to_image():    
    file = request.files['pdf']
    filename = file.filename

    file_data = file.read()

    pdf_file = io.BytesIO(file_data)

    images = convert_from_bytes(file_data, first_page = 1, last_page = 2)
    first_image = images[0]

    # images = convert_from_bytes(file_data)
    # first_image = images[0]

    image_data = io.BytesIO()
    first_image.save(image_data, format='JPEG')
    image_data.seek(0)

    unique_filename = generate_unique_filename(filename)
    image_filename = f"{unique_filename}_image.jpg"

    bucket = storage.bucket()
    blob = bucket.blob(image_filename)
    blob.upload_from_file(image_data, content_type='image/jpeg')
    blob.make_public()

    image_url = blob.public_url

    response = jsonify({'image_url': image_url})
    # response.headers.add('Access-Control-Allow-Origin', 'http://localhost:3000')
    response.headers.add('Access-Control-Allow-Credentials', 'true')
    
    return response 

@app.route('/delete-file', methods=['POST'])
def delete_file():
    file_url = request.json.get('file_url')
    image_url = request.json.get('image_url')

    if image_url and file_url:
        bucket = storage.bucket()

        image_file_name = image_url.split('/')[-1]
        image_file_name = unquote(image_file_name)
        print(image_file_name)
        image_blob = bucket.blob(image_file_name)
        image_blob.delete()

        pdf_file_name = file_url.split('/')[-1].split('?')[0]
        pdf_file_name = unquote(pdf_file_name)
        print(pdf_file_name)
        pdf_blob = bucket.blob(pdf_file_name)
        pdf_blob.delete()

        return 'Files deleted successfully', 200
    else:
        return 'At least one file URL is missing', 400

if __name__ == '__main__':
    app.run(debug=True)