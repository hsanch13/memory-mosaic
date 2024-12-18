from flask import request, make_response
from flask_restful import Resource
from werkzeug.utils import secure_filename
import boto3
from os import environ
from config import s3_client

class Uploads(Resource):
    def post(self):
        try:
            # Step 1: Check if files are present in the request
            if 'file' not in request.files:
                return make_response({'error': 'No file uploaded'}, 400)

            # Step 2: Get up to 5 files from the request
            files = request.files.getlist('file')  # Extract files as a list
            if not files or len(files) > 5:  # Ensure we have up to 5 files
                return make_response({'error': 'Please upload 1-5 files only'}, 400)

            file_urls = []  # List to store uploaded file URLs

            # Step 3: Iterate through files and upload each to AWS S3
            for file in files:
                if file.filename == '':  # Skip empty files
                    return make_response({'error': 'One or more files have no name'}, 400)

                # Secure the file name to prevent malicious paths
                filename = secure_filename(file.filename)

                # Upload file to S3
                s3_client.upload_fileobj(
                    file,
                    environ.get("AWS_S3_BUCKET"),
                    filename,
                    ExtraArgs={'ContentType': file.content_type}
                )

                # Generate the public S3 URL
                bucket = environ.get("AWS_S3_BUCKET")
                region_name = environ.get("AWS_REGION_NAME")
                file_url = f"https://{bucket}.s3.{region_name}.amazonaws.com/{filename}"
                file_urls.append(file_url)

            # Step 4: Return the URLs of uploaded files
            return make_response({'urls': file_urls}, 200)

        except Exception as e:
            # Return an error response if something goes wrong
            print("Error during upload:", str(e))  # Log the error
            return make_response({'error': str(e)}, 500)