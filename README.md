## Class Curator - A Spire Course Discovery Tool

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

---

## Installation Instructions

### Backend Setup

1. **Populate the Database**:  
   From the project root, run the following command to set up the database:

   ```bash
   python3 ./setup/db_populate.py
   ```

2. **To start the Spring Boot backend, from the project root**:

    ```bash
    python3 ./setup/db_populate.py
    cd server
    mvn clean install
    mvn spring-boot:run
    ```
3. **Then to build the extension, again from the project root**:

    ```bash
    cd ./extension
    npm i
    npm run build
    ```
This builds a `dist` directory. Next, open Chrome, and navigate to `chrome://extensions/`. Then Enable `Developer Mode`, press `Load unpacked` and load the `dist` directory on your machine. 

4. **To run the Python FastAPI server**:
    ```bash
    fastapi run recommendations.py
    ```

