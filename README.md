# Course Project of AlphaFold3

## Table of Contents
**[Overview](#Overview)**<br>
**[Team Member Contribution](#Team-Member-Contribution)**<br>
**[Related Work](#Related-Work)**<br>
**[Technical Architecture](#Technical-Architecture)**<br>
**[Installation and Usage](#Installation-and-Usage)**<br>
**[Disclaimer](#Disclaimer)**<br>


There is no specific format required for documentation due to the large variation in project types. Generally, helpful documentation should include (1) an overview of the project, (2) team member contributions, (3) related work and used libraries/models/previous projects, if any, (4) some sort of code structure or architecture diagram, and (5) detailed instructions for reviewers to set up and run code, including possible errors or blockers. The documentation need not be a separate document, but can be in the readme.


## Overview
### Group Information
- Group name: AlphaFold3
- Group captain: Yang Duan (yangd4)
- Group members: Yang Duan (yangd4), Chongyu Wang (chongyu4), Haoyu Su (haoyus2), Yulei Li (yuleili2), Jiaye Wang (jiayew3)
### Project Information

## Team Member Contribution
- Yang Duan (yangd4), 
- Chongyu Wang (chongyu4), 
- Haoyu Su (haoyus2), 
- Yulei Li (yuleili2), 
- Jiaye Wang (jiayew3)

## Related Work
## Technical Architecture

## Installation and Usage
### Installation
Python Version = 3.8  
We implement and run programs in the following sequence.
#### Text converter
1. Install all necessary packages
```python
pip install -r requirements.txt  
```
2. Under the root folder of this project, run:
```python
# Mac OS / Linux
python ./papers/pdf2txt.py
```
OR
```python
# Windows
python .\papers\pdf2txt.py
```
#### Ranking algorithm
```python
python ./papers/plsa.py "<input words>"
```
#### Server
```
npm install
```
```
node index.js
```
#### Chrome Extension
1. install Node.js and npm first
2. change the current directory to `google-extension`
3. run

```
npm install
```
```
export NODE_OPTIONS=--openssl-legacy-provider
npm run build
```
4. visit `chrome://extensions/` in your Chrome Browser
5. click `Load unpacked` on the top left side and select the `dist` folder in the current directory
### Usage

## Disclaimer
