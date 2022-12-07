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
The theme of our project is Google Chrome Extension for paper suggestions based on key-phrase from all mentioned papers in lectures of CS410, which is an educational chrome extension to help students in the CS410 course. When browsing web pages, students might have problems of understanding the concepts or keywords and want to learn more about them. To help students better understand the content in our course, we design a Google Chrome extension, which shows the relevant papers of terms and the related content in these papers when users highlight the terms. These relevant papers are chosen from the offline database containing all research papers mentioned at the end of each lecture. The relevance between papers and the query content is computed based on the PLSA model. Students are also provided with academic information from Google Scholar and general information from Google Search by this extension. These recommendations are based on the relevance of the highlighted words or phrases when students browse web pages.

## Team Member Contribution
- Yang Duan (yangd4), mainly worked on the server program and a part of the Chrome Extension.
- Chongyu Wang (chongyu4), pre-process the 
- Haoyu Su (haoyus2), 
- Yulei Li (yuleili2), 
- Jiaye Wang (jiayew3), 

## Related Work


## Technical Architecture
### Architecture Diagram
![Architecture Diagram](https://github.com/duanyang25/CourseProject-AlphaFold3/blob/main/extra_files/architecture_diagram.jpeg)

In addition to the detailed code structure or architecture for our project demonstrated by the attached diagram above, we explain the process of our pre-trained PLSA model in the following:
### Machine Learning
#### Pdf2txt.py 
The first task of building the PLSA model is to pre-process the paper documents. We have downloaded all the papers mentioned in the lecture as pdf files. We need to reformat the papers from pdf documents to txt documents, which can be easily read by python. In fact, the difficulty is that many papers have subfields (columns), which are hard to process. The Optical Character Recognition (OCR) method is hard to implement and does not have a good performance for our dataset. We utilized the tree hierarchy of html documents to distinguish different parts of paper documents. In pdf2txt.py, we traverse the folder which contains the paper documents and reformat them from pdf file to html file. Then we extract the content in html file and save as txt file. In that case the paper content can be read by our PLSA model.
#### Plsa.py
Plsa file contains our model, which is modified based on MP3. We used PLSA model to compute the relevance between query sentences and paper documents. For the parameters, we choose 10 topics and iterate to likelihood convergence with maximum iteration of 100. The PLSA model will compute the probability matrix of words occurred in documents when converged: 
$$ P(w) = \sum_{i=j}^k\pi_{d, j} P(w|\theta_j)$$
The probability matrix has a shape of (number of vocabulary, number of documents). The model will save the probability matrix and the vocabulary as two txt files, which can be used in main.py to find the relative papers based on query sentences.
#### Main.py
Main.py has the query sentences as input and print the relative paper titles, a part of content related to query, and the paper links to the backend program. We segment the query sentences into word level, and compute the probability of combination of these words utilizing the probability matrix produced by our PLSA model. Then we will choose one or two papers which have the highest relevance scores as relative papers. Then we find the context of the query sentence appearing in the paper content. We print the titles, the context content, and paper links to our server to let it show on our extension.

## Installation and Usage
### Installation
Python Version = 3.8  
We implement and run programs in the following sequence.

#### Windows
1. Download Node.js and install from (https://nodejs.org/en/download/)
2. Clone the repository
```
git clone https://github.com/duanyang25/CourseProject-AlphaFold3.git
```
3. Change the current directory to `server`    
```
cd CourseProject-AlphaFold3\server
```
4. Turn on the server

```
npm install
```
```
node index.js
```
5. Upload google extension to Chome

    Visit `chrome://extensions/` in your Chrome Browser

    Click `Load unpacked` on the top left side

    Select the `dist` folder in the CourseProject-AlphaFold3\google-extension

6. Start using the extension


#### MacOS / Linux

1. Download Node.js and install (https://nodejs.org/en/download/).  

2. Clone the repository
```
git clone https://github.com/duanyang25/CourseProject-AlphaFold3.git
```   
3. change the current directory to `server`
```
cd CourseProject-AlphaFold3/server
```

4. Turn on the server
```
npm install
```
```
node index.js
```

5. Install the google-extension in Google Chrome.

    Visit `chrome://extensions/` in your Chrome Browser

    Click `Load unpacked` on the top left side

    Select the `dist` folder in the CourseProject-AlphaFold3/google-extension

6. Start to use the extension.


### Usage
1. Pin the extension on google chrome
2. On the web page, high light the text that you want to search for
3. Click open the extension, the high light text should be displayed in the textbox, you can also manually enter the text infomation
4. Click the "SearchText" button, then the search result will be displayed
## Disclaimer
1. There is a slight limitation on the highlighted / entered text:    the highlight get selection feature may not work on certain PDFs that are opened on the chrome. Also, in case of certain special characters (Eg: certain new line characters), the result may display "error".










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
For windows cmd, run:

if on power shell, run: 
```
$env:NODE_OPTIONS = "--openssl-legacy-provider"
```
if on command prompot, run: 
```
set NODE_OPTIONS=--openssl-legacy-provider
```
then, run
```
npm run build
```

4. visit `chrome://extensions/` in your Chrome Browser
5. click `Load unpacked` on the top left side and select the `dist` folder in the current directory