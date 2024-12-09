from fastapi import FastAPI
import requests

app = FastAPI()

## Database File Paths
url = "http://localhost:8080"

# Gets user data from database
@app.get("/{user_name}")
def get_user_data(user_name):
    user_profile_url = url + "/private/users/{user_name}"
    response = requests.get(user_profile_url, headers={'Authorization': 'Bearer your_access_token_here'})
    # Check if the request was successful
    if response.status_code == 200:
        # Parse the JSON response
        data = response.json()
        print(data)
        return data
    else:
        print(f"Request failed with status code: {response.status_code}")
    
get_user_data("lgates@umass.edu")