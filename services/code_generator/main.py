from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import json
import boto3
import logging
import traceback
from botocore.exceptions import ClientError
import re
from utilities import s3_image_url_to_base64
from prompts import (
    get_html_prompt, get_nextjs_prompt, get_react_native_prompt, get_react_prompt, get_svelte_prompt
)

# Configure logging
logger = logging.getLogger()
logger.setLevel(logging.INFO)

app = FastAPI()

# Allow all origins (for development only – restrict in production)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # or specify e.g. ["http://localhost:3000"]
    allow_credentials=True,
    allow_methods=["*"],  # allow all HTTP methods (GET, POST, OPTIONS, etc.)
    allow_headers=["*"],  # allow all headers
)

@app.get("/")
async def generate_welcome_message():
    return JSONResponse(content={"message" : "App is running perfectly"})

@app.post("/api/v1/generate-html-code")
async def generate_html(request: Request):
    body = await request.json()
    url = body.get("url")
    user_prompt = body.get("prompt", "")
    css_framework = body.get("css_framework", "")

    # Combine user prompt with base prompt
    base_prompt = get_html_prompt(css_framework=css_framework)
    full_prompt = f"{base_prompt}\n\nAdditional instructions from user: {user_prompt}"

    # Convert image to base64
    try:
        schema_image = s3_image_url_to_base64(url)
    except Exception as e:
        error_msg = f"Failed to convert image to base64: {str(e)}"
        logger.error(f"{error_msg}\n{traceback.format_exc()}")
        return {
            'statusCode': 500,
            'body': json.dumps({"error": error_msg})
        }
    
    # Create a message chain
    messages = [
        {
            "role": "user",
            "content": [
                {
                    "type": "image",
                    "source": {
                        "type": "base64",
                        "media_type": "image/png",
                        "data": schema_image
                    }
                },
                {
                    "type": "text",
                    "text": full_prompt
                }
            ]
        }
    ]

    # Initialize Bedrock client
    try:
        bedrock = boto3.client("bedrock-runtime", region_name="us-east-1")
    except Exception as e:
        error_msg = f"Failed to initialize Bedrock client: {str(e)}"
        logger.error(f"{error_msg}\n{traceback.format_exc()}")
        return {
            'statusCode': 500,
            'body': json.dumps({"error": error_msg})
        }
    
    # Stream response from Claude
    try:
        response = bedrock.invoke_model_with_response_stream(
            modelId="us.anthropic.claude-3-7-sonnet-20250219-v1:0",
            contentType="application/json",
            accept="application/json",
            body=json.dumps({
                "anthropic_version": "bedrock-2023-05-31",
                "messages": messages,
                "max_tokens": 64000,  # Tune if needed
                "temperature": 0.3
            })
        )
    except ClientError as e:
        error_msg = f"Bedrock API call failed: {str(e)}"
        logger.error(f"{error_msg}\n{traceback.format_exc()}")
        return {
            'statusCode': 500,
            'body': json.dumps({"error": error_msg})
        }
    
    # Process streaming response
    logger.info("Processing streaming response from Claude")
    chunks = []
    chunk_count = 0
    
    try:
        for event in response["body"]:
            chunk_data = json.loads(event["chunk"]["bytes"].decode())
            if "delta" in chunk_data and "text" in chunk_data["delta"]:
                text = chunk_data["delta"]["text"]
                chunks.append(text)
                chunk_count += 1
                
                # Log every 10 chunks to avoid excessive logging
                if chunk_count % 10 == 0:
                    logger.info(f"Received {chunk_count} chunks so far")
    except Exception as e:
        error_msg = f"Error processing response stream: {str(e)}"
        logger.error(f"{error_msg}\n{traceback.format_exc()}")
        return {
            'statusCode': 500,
            'body': json.dumps({"error": error_msg})
        }
    
    full_response = "".join(chunks).strip()
    response_length = len(full_response)

    full_response = full_response.replace("```html", "").replace("```", "")

    pattern = re.compile(r"<!DOCTYPE html>.*?</html>", re.DOTALL)
    match = pattern.search(full_response)
    
    logger.info(f"Successfully processed request. Response length: {response_length} characters")
    
    return {
        'statusCode': 200,
        'body': json.dumps(match.group(0) if match else full_response)
    }

@app.post("/api/v1/generate-react-code")
async def generate_react_code(request: Request):
    body = await request.json()
    url = body.get("url")
    user_prompt = body.get("prompt", "")
    css_framework = body.get("cssFramework", "tailwind")
    ui_library = body.get("uiLibrary", "none")
    language = body.get("language", "javascript")
    
    # Combine user prompt with base prompt
    base_prompt = get_react_prompt(css_framework, ui_library, language=language)
    full_prompt = f"{base_prompt}\n\nAdditional instructions from user: {user_prompt}"
    
    # Similar implementation as generate_html, but with React-specific prompt
    # For now, we'll return a placeholder
    return {
        'statusCode': 200,
        'body': json.dumps("// React component would be generated here")
    }

@app.post("/api/v1/generate-nextjs-code")
async def generate_nextjs_code(request: Request):
    body = await request.json()
    url = body.get("url")
    user_prompt = body.get("prompt", "")
    css_framework = body.get("cssFramework", "tailwind")
    ui_library = body.get("uiLibrary", "none")
    language = body.get("language", "javascript")
    
    # Combine user prompt with base prompt
    base_prompt = get_nextjs_prompt(css_framework, ui_library, language=language)
    full_prompt = f"{base_prompt}\n\nAdditional instructions from user: {user_prompt}"
    
    # Similar implementation as generate_html, but with Next.js-specific prompt
    # For now, we'll return a placeholder
    return {
        'statusCode': 200,
        'body': json.dumps("// Next.js component would be generated here")
    }

@app.post("/api/v1/generate-svelte-code")
async def generate_svelte_code(request: Request):
    body = await request.json()
    url = body.get("url")
    user_prompt = body.get("prompt", "")
    css_framework = body.get("cssFramework", "tailwind")
    ui_library = body.get("uiLibrary", "none")

    # Combine user prompt with base prompt
    base_prompt = get_svelte_prompt(css_framework=css_framework, ui_library=ui_library)
    full_prompt = f"{base_prompt}\n\nAdditional instructions from user: {user_prompt}"
    
    # Similar implementation as generate_html, but with Svelte-specific prompt
    # For now, we'll return a placeholder
    return {
        'statusCode': 200,
        'body': json.dumps("<!-- Svelte component would be generated here -->")
    }

@app.post("/api/v1/generate-react-native-code")
async def generate_react_native_code(request: Request):
    body = await request.json()
    url = body.get("url")
    user_prompt = body.get("prompt", "")
    
    # Combine user prompt with base prompt
    base_prompt = get_react_native_prompt()
    full_prompt = f"{base_prompt}\n\nAdditional instructions from user: {user_prompt}"
    
    # Similar implementation as generate_html, but with React Native-specific prompt
    # For now, we'll return a placeholder
    return {
        'statusCode': 200,
        'body': json.dumps("// React Native component would be generated here")
    }