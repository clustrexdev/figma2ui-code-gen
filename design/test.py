import datetime

now = datetime.datetime.now()
# formatted_time = now.strftime("%-m/%-d/%Y %H:%M:%S")  # For Unix/Linux/Mac
formatted_time = now.strftime("%#m/%#d/%Y %H:%M:%S")  # For Windows

print(formatted_time)
from pymongo import MongoClient
from datetime import datetime

# Connect to MongoDB
mongo_client = MongoClient("mongodb+srv://dev_rkc:Kernpike$3@rkc-dev.pjgb3.mongodb.net/") 
db = mongo_client["dev_rkc_app"]
collection = db["File Information"]

# Update all documents
collection.update_many(
    {}, 
    {"$set": {"deleted_at":None}}
)

print("Documents updated successfully.")