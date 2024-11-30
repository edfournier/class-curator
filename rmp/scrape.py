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

def fetch_profs():
    print("Fetching professors...")

    profs = []
    variables = {
        "count": 1000,  # Page max
        "query": { 
            "schoolID": "U2Nob29sLTE1MTM=", # UMass legacy ID
            "fallback": True }
    }

    while True:
        # Sequential requests because we need to page
        json = requests.post(url, json={"query": queries.profs, "variables": variables}, headers=headers).json()
        for edge in json["data"]["search"]["teachers"]["edges"]:
            node = edge["node"]
            if node["numRatings"] > 0:  # Filter profs without ratings
                profs.append({"id": node["id"], "name": f"{node["firstName"]} {node["lastName"]}"})

        # Check if there's another page
        page_info = json["data"]["search"]["teachers"]["pageInfo"]
        if not page_info["hasNextPage"]:
            break
        variables["cursor"] = page_info["endCursor"]
    return profs

async def fetch_prof_ratings(session, prof):
    # Using upper bound for ratings count
    variables = {"count": 1000, "id": prof["id"]}
    res = await session.post(url, json={"query": queries.ratings, "variables": variables}, headers=headers)
    json = await res.json()

    # Parse response into file format
    ratings = []
    for edge in json["data"]["node"]["ratings"]["edges"]:
        node = edge["node"]
        ratings.append(f"{node["class"]},{node["difficultyRating"]},{node["helpfulRating"]},{prof["name"]},{node["date"].split()[0]}\n") 
    return ratings

async def fetch_batch_ratings(profs):
    print("Fetching ratings...")
    # Reuse session for batch requests
    async with aiohttp.ClientSession() as session: 
        return await asyncio.gather(*[fetch_prof_ratings(session, prof) for prof in profs])

if __name__ == "__main__":
    ratings = asyncio.run(fetch_batch_ratings(fetch_profs()))
    with open("ratings.csv", "w", encoding="utf-8") as file:
        file.write("class,difficulty,helpfulness,professor,date\n")
        for rating in ratings:
            file.writelines(rating)
    print("Done!")