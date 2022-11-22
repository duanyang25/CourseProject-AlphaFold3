# CourseProject

Please fork this repository and paste the github link of your fork on Microsoft CMT. Detailed instructions are on Coursera under Week 1: Course Project Overview/Week 9 Activities.

## Usage
Python Version = 3.8  
We implement and run programs in the following sequence.
### Text converter
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
### Ranking algorithm
```python
python ./papers/plsa.py "<input words>"
```
### Server
### Chrome Extension
1. install Node.js and npm first
2. change the current directory to `google-extension`
3. run
```
export NODE_OPTIONS=--openssl-legacy-provider
```
```
npm install
```
```
npm run build
```
4. visit `chrome://extensions/` in your Chrome Browser
5. click `Load unpacked` on the top left side and select the `build` folder in the current directory
