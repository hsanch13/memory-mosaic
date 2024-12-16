from flask import request, make_response
from flask_restful import Resource
from werkzeug.utils import secure_filename
import boto3
from os import environ
from config import s3_client
import ipdb

class Uploads(Resource):
    def post(self):
        try:
            if 'file' not in request.files:
                return make_response({'error': 'No file uploaded'}), 400
            file = request.files['file']
            files = request.files[:5]
            file_urls = []
            for file in files: 
                if file.filename == '':
                    return make_response({'error': 'No selected file'}), 400

            # Secure the file name
                filename = secure_filename(file.filename)

            # Upload file to S3
                s3_client.upload_fileobj(
                    file,
                    environ.get("AWS_S3_BUCKET"),
                    filename,
                    ExtraArgs={
                        'ContentType': file.content_type  # Ensure the file is served correctly
                    }
                )
                bucket=environ.get("AWS_S3_BUCKET")
                region_name=environ.get("AWS_REGION_NAME")
                # Generate the file's S3 URL
                file_urls.append(f"https://{bucket}.s3.{region_name}.amazonaws.com/{filename}")
            return make_response({'urls': file_urls}), 200

        except Exception as e:
            return make_response({'error': str(e)}), 500
