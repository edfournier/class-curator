import requests
import queries
import aiohttp
import asyncio

url = "https://www.ratemyprofessors.com/graphql"

headers = {
    "Content-Type": "application/json",
    "Authorization": "Basic dGVzdDp0ZXN0",  # Just "test:test" in B64
    "Origin": "https://www.ratemyprofessors.com",
    "Referer": "https://www.ratemyprofessors.com/search/professors/1513"
}

profs_variables = {
    "count": 1000,  # Page max
    "cursor": None,
    "query": {
        "text": "",
        "schoolID": "U2Nob29sLTE1MTM=",  # UMass "legacy" ID
        "fallback": True
    }
}

ratings_variables = {
    "count": 1, 
    "courseFilter": None, 
    "cursor": None
}

def fetch_profs():
    print("Fetching professors...")
    profs = []
    while True:
        # Sequential requests because we need to page
        json = requests.post(url, json={"query": queries.profs, "variables": profs_variables}, headers=headers).json()
        for edge in json["data"]["search"]["teachers"]["edges"]:
            node = edge["node"]
            if node["numRatings"] > 0:  # Filter profs without ratings
                profs.append({"id": node["id"]})

        # Check if there's another page
        page_info = json["data"]["search"]["teachers"]["pageInfo"]
        if not page_info["hasNextPage"]:
            break
        profs_variables["cursor"] = page_info["endCursor"]
    return profs

async def fetch_ratings(profs):
    print("Fetching ratings...")
    async with aiohttp.ClientSession() as session:
        # Async makes this way faster
        tasks = []
        for prof in profs:
            variables = ratings_variables.copy()
            variables["id"] = prof["id"]
            tasks.append(session.post(url, json={"query": queries.ratings, "variables": variables}, headers=headers))
        responses = await asyncio.gather(*tasks)
        
        # Parse responses
        ratings = []
        for response in responses:
            json = await response.json()
            for edge in json["data"]["node"]["ratings"]["edges"]:
                node = edge["node"]
                ratings.append(f"{node["class"]} {node["difficultyRating"]} {node["helpfulRating"]}\n") # Formatted for file
        return ratings

async def write_ratings():
    # Fetch ratings for all profs and write to ratings.txt
    profs = fetch_profs()
    ratings = await fetch_ratings(profs)
    with open("ratings.txt", "w", encoding="utf-8") as file:
        file.write("class, difficulty, helpfulness\n")
        for rating in ratings:
            file.writelines(rating)

if __name__ == "__main__":
    asyncio.run(write_ratings())
    print("Done!")