## Class Curator - A Spire Course Discovery Tool

- Finding interesting courses to take is a tedious, confusing, and time-consuming process
- Coordinating course selection with friends is even more so
- Other tools exist, but outside of the way students ultimately register for courses: SPIRE

So we've built a chrome extension that makes it easy and intuitive for UMass students to discover courses they like based on their preferences, history, and peer interest

### Spring Boot server setup
```bash
python3 ./setup/db_populate.py
cd server
mvn clean install
mvn spring-boot:run
```

## Chrome extension setup
```bash
cd ./extension
npm i
npm run build
```

This builds a `dist` directory. Next, open Chrome, navigate to `chrome://extensions/`, enable `Developer Mode`, press `Load unpacked` and load the `dist` directory on your machine.

---

A project by
- Eric Fournier <edfournier@umass.edu>
- Liam Gates <lgates@umass.edu>
- Saloni Khatu <skhatu@umass.edu>
- Harsh Seth <hseth@umass.edu>
