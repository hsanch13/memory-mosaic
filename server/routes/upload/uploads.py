from flask import request, make_response
from flask_restful import Resource
from werkzeug.utils import secure_filename
import boto3
from os import environ
from botocore.exceptions import BotoCoreError, ClientError
from config import s3_client

class Uploads(Resource):
    def post_file(self, file):
        """
        Handles single file upload to AWS S3.
        Returns a dictionary with file URL or error.
        """
        try:
            if not file or file.filename == "":
                return {"error": "No selected file"}, 400

            # Secure the filename and log its content type
            filename = secure_filename(file.filename)
            print(f"Uploading file: {filename}, Content-Type: {file.content_type}")  # Debugging

            # Upload the file to AWS S3
            s3_client.upload_fileobj(
                file,
                environ.get("AWS_S3_BUCKET"),
                filename,
                ExtraArgs={"ContentType": file.content_type or "application/octet-stream"}
            )

            # Generate the S3 file URL
            bucket = environ.get("AWS_S3_BUCKET")
            region_name = environ.get("AWS_REGION_NAME")
            file_url = f"https://{bucket}.s3.{region_name}.amazonaws.com/{filename}"

            print(f"File uploaded successfully: {file_url}")  # Debugging
            return {"urls": [file_url]}  # Return uploaded file URL in a list

        except (BotoCoreError, ClientError) as e:
            print("AWS Upload Error:", e)  # Debugging
            return {"error": f"Failed to upload file {filename}: {str(e)}"}, 500

########POST#########
    def post(self):
        """
        Handles multiple file uploads through form-data.
        Returns all successfully uploaded file URLs.
        """
        try:
            files = request.files.getlist("file")  # Expecting key "file" for multiple files
            file_urls = []

            for file in files:
                response = self.post_file(file)
                if "urls" in response:
                    file_urls.extend(response["urls"])
                else:
                    print(f"Failed to upload file: {file.filename}, Error: {response.get('error')}")
                    continue  # Continue with other files even if one fails

            return make_response({"urls": file_urls}, 200)

        except Exception as e:
            print("Error in Uploads:", e)
            return make_response({"error": str(e)}, 400)

######DELETE######
def delete_file(self, file_key):
        """
        Deletes a single file from AWS S3 using its key.
        """
        try:
            # Log the file_key for debugging
            print(f"Attempting to delete file with key: {file_key}")  # Debugging
            # Delete the file from AWS S3
            bucket = environ.get("AWS_S3_BUCKET")
            s3_client.delete_object(Bucket=bucket, Key=file_key)
            print(f"File deleted successfully from S3: {file_key}")  # Debugging
            return {"message": f"File {file_key} deleted successfully"}
        except (BotoCoreError, ClientError) as e:
            print("AWS Delete Error:", e)  # Debugging
            return {"error": f"Failed to delete file {file_key}: {str(e)}"}, 500