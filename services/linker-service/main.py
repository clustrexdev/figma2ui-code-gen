from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
import boto3
import re
import os
from dotenv import load_dotenv

# loading dotenv file
load_dotenv()

# instantiate the application
app = FastAPI()

# defining the routes

# 1. Health Route
@app.route("/")
def health_route():
    return JSONResponse(content={"message" : "App is running smoothly"})