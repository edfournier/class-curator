import requests
import queries

url = "https://www.ratemyprofessors.com/graphql"

headers = {
    "Content-Type": "application/json",
    "Authorization": "Basic dGVzdDp0ZXN0", # test:test in B64
    "Origin": "https://www.ratemyprofessors.com",
    "Referer": "https://www.ratemyprofessors.com/search/professors/1513" # UMass legacy ID
}

variables = {
    "count": 1, # TODO: I believe there a way to do this programatically with cursor and hasNextPage, but in any case, the exact number is on the webpage: 4142 professors at University of Massachusetts - Amherst
    "cursor": None,
    "query": {
        "text": "",
        "schoolID": "U2Nob29sLTE1MTM=",  
        "fallback": True
    }
}

json = requests.post(url, json={"query": queries.professors, "variables": variables}, headers=headers).json()
for edge in json["data"]["search"]["teachers"]["edges"]:
    node = edge["node"]
    print(node["id"], node["firstName"], node["lastName"])

variables = {
    "count": 1,
    "id": "VGVhY2hlci0xOTE4ODEz", # Professor Caleb Round's RMP ID
    "courseFilter": None,
    "cursor": None
}

json = requests.post(url, json={"query": queries.ratings, "variables": variables}, headers=headers).json()
for edge in json["data"]["node"]["ratings"]["edges"]:
   node = edge["node"]
   print(node["class"], node["difficultyRating"], node["helpfulRating"], f"\"{node["comment"]}\"")