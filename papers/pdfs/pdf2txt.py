import fitz
from tqdm import tqdm
from bs4 import BeautifulSoup
import re
import os

def pdflist(dict_path, html_path):
    file_list = []
    html_name_list = []
    txt_name_list = []
    for files in os.walk(dict_path):
        for file in files[2]:
            if os.path.splitext(file)[1] == '.pdf':
                file_list.append(dict_path + '\\' + file)
                txt_name_list.append(file.replace('.pdf', '.txt'))
                html_name_list.append(html_path + '\\' + file.replace('.pdf', '.html'))
            elif os.path.splitext(file)[1] == '.PDF':
                file_list.append(dict_path + '\\' + file)
                txt_name_list.append(file.replace('.PDF', '.txt'))
                html_name_list.append(html_path + '\\' + file.replace('.PDF', '.html'))
    return file_list, txt_name_list, html_name_list

def pdf2html(input_path, html_path):
    doc = fitz.open(input_path)
    print(doc)
    html_content = ''
    for page in tqdm(doc):
        html_content += page.get_text('html')
    html_content +="</body></html>"
    with open(html_path, 'w', encoding = 'utf-8', newline='')as fp:
        fp.write(html_content)

def html2txt(html_path, txt_name):
    html_file = open(html_path, 'r', encoding = 'utf-8')
    htmlhandle = html_file.read()
    soup = BeautifulSoup(htmlhandle, "html.parser")
    for div in soup.find_all('div'):
        for p in div:
            text = str()
            for span in p:
                p_info = '<span .*?>(.*?)</span>'
                res = re.findall(p_info,str(span))
                if len(res) ==0:
                    pass
                else:
                    text+= res[0]
            print(text)
            with open(r'D:\CS410\CourseProject\papers\txts' + '\\' + txt_name,'a',encoding = 'utf-8')as text_file:
                text_file.write(text)
                text_file.write('\n')

def main():
    dict_path = r'D:\CS410\CourseProject\papers\pdfs'
    html_path = r'D:\CS410\CourseProject\papers\html'
    file_list, txt_name_list, html_name_list = pdflist(dict_path, html_path)
    for i in range(len(file_list)):
        pdf2html(file_list[i], html_name_list[i])
        html2txt(html_name_list[i], txt_name_list[i])
    # input_path = r'D:\CS410\project\papers\pdfs\A Short Introduction to Learning to Rank.pdf'
    # html_path = r'D:\CS410\project\papers\pdfs\input.html'
    # pdf2html(input_path,html_path ) 
    # html2txt(html_path)

if __name__ == '__main__':
    main()