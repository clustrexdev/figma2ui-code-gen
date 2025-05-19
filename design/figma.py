import json
import os
from pymongo import MongoClient
from openai import OpenAI
import anthropic
import numpy as np
from datetime import datetime
import base64
import re
import time

def image_to_base64(image_path):
    with open(image_path, "rb") as image_file:
        image_data = image_file.read()  # Read the file contents
        base64_encoded_data = base64.standard_b64encode(image_data)  # Pass the contents to b64encode
        base64_string = base64_encoded_data.decode("utf-8")  # Decode to string
    
    return base64_string

def lambda_handler(event, context):
    try:
        # image_path = "docker function\image.png"
        # schema_image = image_to_base64(image_path)
        API_URL="https://q5xfrmznjf.execute-api.us-east-1.amazonaws.com/default/claude_summary"
        API_URL2="https://q5xfrmznjf.execute-api.us-east-1.amazonaws.com/default/claude_transaction"
        API_URL2="https://q5xfrmznjf.execute-api.us-east-1.amazonaws.com/default/cashflow"
        image_path = r"C:\Users\Nhiranjan\Downloads\Capture.PNG"
        schema_image = image_to_base64(image_path)
        
        json_output="""
                            {
            "summary": {
                "total_transactions":"total transaction count",
                "total_credits": "total credits for the client i.e dollor in",
                "total_debits": "total debits for the client i.e dollor out",
                "total_statements": "describe number of statement",
                "total_accounts": "Represent number of account",
                "failed": "Describe failed",
                "processed": "Describe processed"
            }
        }
        # """
#         prompt=f"""You are an expert HTML and JavaScript developer. I have a base64 image that represents my design, and I need an exact HTML structure using Tailwind CSS without altering the layout or style.next step I am giving two Api url provide a seperate function use method post i need to pass 'client_id' from url search parameters through body to api using url search parameters to call the api on windows load and append the value to the html element don't use websocket
#         {API_URL}:Use this api for getting processed count,Transaction count dollar in and dollar out. for this you need to give js avoid overlap
#         the response of the api url will be like this {json_output} use the same id for that particular element to access
#         I am using another js file name "Transaction.js" this will handle recent transaction table so add a table add a heading "Date", "Bank", "Account", "Description", "Type", "Flow", "Amount", "Account Holder", "Account Type" and table body with id "TransactionTable" with scroll and add this function also fetchTransactions();,fetchCashFlow(); I have written code for this so need to define simply call the function
# Note:set the id value as same as in the script function and i Need all the elements given in the design and use canvas for cashflow
# include necessary script src  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>.<script src="https://cdn.tailwindcss.com"></script>

# Possibility: Don't change the design structure
        prompt="""You are an expert HTML and JavaScript developer. I have a base64 image that represents my design, and I need an exact HTML structure using UIKIT uikit@3.17.0 without altering the layout or style, I need full code
        I also need for mobile response that need to handle by you but use my style for other screens and 
        Note:Don't change the style for laptop screen provide exact styling see the given image value are not static that elements so provide accordingly make dynamic and use datatable and other stuff which are needed to make page workable
        """

        messages = [
        {
            "role": 'user',
            "content": [
                {"type":"image","source":{"type":"base64","media_type":"image/png","data":schema_image}},
                {"type":"text","text":prompt}
            ]  # Ensure the prompt starts with "\n\nHuman:"
        }
        ]
        anthropic_client = anthropic.Anthropic(api_key="")
        # print(anthropic_client.models.list(limit=20))
        claude_response = anthropic_client.messages.create(
        model="claude-3-5-sonnet-20241022",
        messages=messages,
        max_tokens=8192
        )
        print(claude_response)
        result=claude_response.content[0].text
        print(type(result))
        result=result.replace("```html","")
        result=result.replace("```  ","")
        print(result)
        pattern = re.compile(r"<!DOCTYPE html>.*?</html>", re.DOTALL)
        match = pattern.search(result)

        if match:
            content = match.group(0)  # Extracts everything including </html>

            # Generate timestamp
            timestamp = time.strftime("%Y%m%d_%H%M%S")

            # Save to an HTML file with timestamp
            filename = f"response_{timestamp}.html"
            with open(filename, "w", encoding="utf-8") as file:
                file.write(content)

            print(f"Saved as {filename}")
        else:
            print("No valid HTML content found.")

                

    except Exception as e:
        return {
            "statusCode": 500,
            "body": json.dumps({"error": str(e)})
        }
event={
    "body":"""{
    "prompt":"which type of debtor is selected",
    "file_id":"9e530256-88d6-4182-9ada-607ee4d5375b"}"""
}
print(lambda_handler(event,None))