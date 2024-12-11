# Class Curator - A Spire Course Discovery Tool





## Introduction

**Class Curator** is a Chrome extension designed to make the course discovery process easier, more intuitive, and more social for UMass Amherst students. Finding courses that match your interests and coordinating selections with friends can be tedious and confusing, especially when using SPIRE. Class Curator integrates seamlessly with SPIRE to help you:

- Discover courses based on your preferences and history.
- Coordinate with friends by seeing their interests and selections.
- Streamline the course registration process within SPIRE.

This tool was developed by:

- **Eric Fournier**: [edfournier@umass.edu](mailto:edfournier@umass.edu)  
- **Liam Gates**: [lgates@umass.edu](mailto:lgates@umass.edu)  
- **Saloni Khatu**: [skhatu@umass.edu](mailto:skhatu@umass.edu)  
- **Harsh Seth**: [hseth@umass.edu](mailto:hseth@umass.edu)  




## Installation Instructions

Perform each of the following at the project's root:

1. **Populate the database**
```bash
python ./db-setup/db_populate.py
```

2. **Start the FastAPI recommendation service**
```bash
cd ./fast-api
pip install -r requirements.txt
fastapi run recommendations.py
```

2. **Start the Spring Boot backend**
```bash
cd ./spring-boot
mvn clean install
mvn spring-boot:run
```

3. **Build the extension**
```bash
cd ./extension
npm i
npm run build
```

This final step builds a `dist` directory in `extension`. After it's built, open Chrome, and navigate to `chrome://extensions/`. Then, enable `Developer Mode`, press `Load unpacked`, and load the `dist` directory on your machine. The extension will now be accessible in Chrome's "Extensions" tab in the top-right of the browser.




## Configuration

1. **Spring Boot Configuration**:

2. **Extension Configuration**:

3. **FastAPI Configuration**:




## Datasets
To generate insights and recommendations, the backend leverages historical review data from [Rate My Professor](https://www.ratemyprofessors.com/) and course data from Daniel Melanson's [Spire API](https://github.com/daniel-melanson/spire-api.melanson.dev). The scripts to generate these data sets, `rmp.py` and `spire.py` respectively, are found in `db-setup/scrape`. 




## Large Language Model Used
The system uses the *all-MiniLM-L6-v2* model for generating recommendations and processing course-related data. This model provides efficient performance for tasks like semantic search and embedding generation.




## Test Suites
