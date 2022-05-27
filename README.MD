![image](https://user-images.githubusercontent.com/43099047/134787866-4d5a90b9-355d-41aa-83c3-af2c984e3867.png)

https://user-images.githubusercontent.com/43099047/134788890-56064e63-edbc-43fd-a857-8f93096ea202.mp4

Documentation: https://robocin.notion.site/WebSoccerMonitor-Documentation-00f6b45c3b5f49aaa0b39b1b1e9aaec5

# Setup Guide
- frontend setup on ubuntu:
    - Make sure you have node v16.14.0 or higher installed.
    - on frontend/ run: npm install
    - --> to start, run: npm run dev

- submodule setup
    under the root folder, do:
    - git submodule init
    - git submodule update
    
- backend setup on ubuntu:
    - on backend/ run: pip3 install -r requirements.txt
    - on backend/rcss-log-extractor/ run: sudo apt-get install default-jre default-jdk
    - --> to start, run: python3 server.py
    - 
# Contributing
To contribute, create a new branch (from the "dev" branch) with a descriptive name for what you will do. Commit your changes to this new branch and then make a pull request to the "dev" branch.

---

![image](https://user-images.githubusercontent.com/43099047/170765581-897c9d29-694a-4c47-880a-edb0e1b385a8.png)
