# Project Contributions

Over the course of the semester, all members of our group participated in several, multihour work sessions in which we brainstormed, troubleshooted, and developed the project together.
This file details specific contributions of each member.

## Harsh Seth
- **Feature Development:**  
  [Brief description of the features you developed or worked on.]

- **Documentation:**  
  [Details about any documentation you contributed to.]

- **Other Contributions:**  
  [Any other significant contributions, e.g., code reviews, project management, design, etc.]

## Saloni Khatu
- **Feature Development:**  
  [Description of features developed.]

- **Documentation:**  
  [Details about documentation contributions.]

- **Other Contributions:**  
  [Additional contributions.]


## Liam Gates
- **Feature Development:**  
  - Implemented the Python server using the FastAPI for the course recommendation features.
  - Implemented the Hugging Face Sentence Transformer Model to get course recommendation from user info.
  - Implemented tests for the course recommendation feature using pytest and FastAPI.
  - Contributed to the Spring server controllers to handle requests to the database.

- **Documentation:**  
  - Documented the information about the Hugging Face Sentence Transformer used in the system.
  - Documented the FastAPI test instructions to the README.md.

## Eric Fournier
- Setup Vite to automatically build the extension.
- Created the scripts `db-setup/scrape/rmp.py` and `db-setup/scrape/spire.py`, which collect course and review data from Rate My Professor and an independently run Spire API respectively.
- Created the content and background scripts that are injected into the Spire webpage. These scripts handle embedding content such as course likes and dislikes, and pass messages to the popup extension.
- Created the Home, Friends, and Course pages in React, and wrote API calls with Axios to integrate with the Spring Boot backend.
- Created AuthProvider and AlertProvider components, which handle authentication and error/info alerting on the front end respectively. The former leverages Chrome's `storage` and `identity` APIs to obtain and cache relevant user data.
- Wrote Jest test cases for the front end's React components
- Worked with Harsh to implement authentication on the backend, specifically `AuthFilter.java`, which accepts tokens from Chrome's identity API to authenticate users. 
- Worked with Saloni to create the data visualizations graphs with Recharts. These graphs visualized course trends (such as difficulty and quality) over time.