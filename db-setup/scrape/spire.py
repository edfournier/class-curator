import requests
import json
import time 

def main():
    courses = []
    next = "https://spire-api.melanson.dev/courses/?page=1" # Max page is 872
    while next:
        print(next)
        response = requests.get(next, headers={"accept": "application/json"})
        data = response.json()
        for result in data["results"]:
            course = {
                "code": result["id"],
                "name": result["title"],
                "subject": result["subject"]["title"],
                "description": result["description"]
            }
            courses.append(course)
        next = data["next"]
        time.sleep(1) # Prevent rate limiting
    
    with open("courses.json", "w", encoding="utf-8") as file:
        json.dump(courses, file, indent=2, ensure_ascii=False)
            
if __name__ == "__main__":
    main()