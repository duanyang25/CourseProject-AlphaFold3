import numpy as np
import platform
import re
import json
# For Windows
delimiter = "\\"
dict_path = r'.\papers\pdfs'
txt_path = r'.\papers\txts'

def main(selection):
    if platform.system().lower() != "windows":
        global dict_path 
        dict_path = "./papers/pdfs"
        global txt_path
        txt_path = "./papers/txts"
        global delimiter 
        delimiter = "/"

    prob_matrix = np.loadtxt("prob_matrix.txt")
    vocab = np.loadtxt("vocabulary.txt", dtype= 'str', delimiter=' ', encoding='utf-8')
    vocab = list(vocab)
    # print(len(vocab))
    # print(prob_matrix.shape)
    query_words = selection.split()
    paper_index = []
    flag = 0
    for word in query_words:
        for i in range(len(vocab)):
            if word in vocab[i]:
                paper_index.append(np.argmax(prob_matrix[:, i]))
                flag = 1
                break
    if flag == 0:
        j = {
            "papers":
                    [
                        { "paperTitle":'', "abstract":'', "link":''}
                    ]
            }
        print(json.dumps(j))
        return

    file_list = []
    file = open(dict_path + delimiter + 'links.txt', 'r', encoding='utf-8')
    for line in file.readlines():
        line = line.strip('\n')
        file_list.append(line)
    
    doc_name1 = file_list[paper_index[0] * 2] + '.txt'
    relative_paper = open(txt_path + delimiter + doc_name1, 'r', encoding='utf-8')
    paper_content = ''
    for line in relative_paper.readlines():
        line = line.strip('\n')
        paper_content += line
    
    num = 200
    for m in re.finditer(query_words[0], paper_content):
        start = m.start()
        end = m.end()
        if (m.start() - num) < 0:
            start = 0
            content = paper_content[start:end+num]
        elif (m.end() + num) > len(paper_content):
            end = len(paper_content) - 1
            content = paper_content[start-num:end]
        else:
            content = paper_content[start-num:end+num]

    if len(paper_index) > 1:
        doc_name2 = file_list[paper_index[1] * 2] + '.txt'
        relative_paper2 = open(txt_path + delimiter + doc_name2, 'r', encoding='utf-8')
        paper_content2 = ''
        for line in relative_paper2.readlines():
            line = line.strip('\n')
            paper_content2 += line
        
        for m in re.finditer(query_words[1], paper_content2):
            start = m.start()
            end = m.end()
            if (m.start() - num) < 0:
                start = 0
                content2 = paper_content2[start:end+num]
            elif (m.end() + num) > len(paper_content2):
                end = len(paper_content2) - 1
                content2 = paper_content2[start-num:end]
            else:
                content2 = paper_content2[start-num:end+num]

    # dictionary
    if len(paper_index) == 1:
        j = {
            "papers":
                    [
                        { "paperTitle":file_list[paper_index[0] * 2], "abstract":content, "link":file_list[paper_index[0] * 2 + 1]},
                    ]
        }

        # print out json
        print(json.dumps(j))
    elif len(paper_index) > 1:
        j = {
            "papers":
                    [
                        { "paperTitle":file_list[paper_index[0] * 2], "abstract":content, "link":file_list[paper_index[0] * 2 + 1]},
                        { "paperTitle":file_list[paper_index[1] * 2], "abstract":content2, "link":file_list[paper_index[1] * 2 + 1]}
                    ]
        }
        print(json.dumps(j))
    return

if __name__ == '__main__':
    # selection = sys.argv[1]
    selection = "machine learning"
    main(selection)