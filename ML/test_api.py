import requests

# URL of your running FastAPI server
url = "http://127.0.0.1:8000/analyze"

# Example review data
review_data = {
    "stars": 5,
    "content": "This product is amazing! Highly recommend it to everyone.",
    "cool": 0,
    "useful": 0,
    "funny": 0
}

# Send POST request
response = requests.post(url, json=review_data)

# Print response
if response.status_code == 200:
    print("API Response:")
    print(response.json())
else:
    print(f"Error {response.status_code}: {response.text}")