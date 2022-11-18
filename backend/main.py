# Using flask to make an api
import os
# import necessary libraries and functions
from flask import Flask, jsonify, request
from werkzeug.utils import secure_filename
import cv2;
import numpy as np;

# creating a Flask app
UPLOAD_FOLDER = '/uploads'
app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
# on the terminal type: curl http://127.0.0.1:5000/
# returns hello world when we use GET.
# returns the data that we send when we use POST.
  
# A simple function to calculate the square of a number
# the number to be squared is sent in the URL when we use GET
# on the terminal type: curl http://127.0.0.1:5000 / home / 10
# this returns 100 (square of 10)
@app.route('/preenchimento', methods=['POST'])
def upload_file():
    if request.method == 'POST':
        file = request.files['file']
        file.save(os.path.join("uploads", file.filename))


        im_in = cv2.imread("uploads/"+file.filename, cv2.IMREAD_GRAYSCALE);


        th, im_th = cv2.threshold(im_in, 220, 255, cv2.THRESH_BINARY);

        im_floodfill = im_th.copy()
        h, w = im_th.shape[:2]
        mask = np.zeros((h+2, w+2), np.uint8)

        cv2.floodFill(im_floodfill, mask, (0,0), 255)

        im_floodfill_inv = cv2.bitwise_not(im_floodfill)

        im_out = im_th | im_floodfill_inv
        cv2.imwrite('uploads/img.png', im_out)
        return "../backend/uploads/img.png"


@app.route('/conexao', methods=['POST'])
def conexao():
    if request.method == 'POST':
        file = request.files['file']
        file.save(os.path.join("uploads", file.filename))


        im_in = cv2.imread("uploads/"+file.filename);

        
        gray_img = cv2.cvtColor(im_in , cv2.COLOR_BGR2GRAY)
        
        blurred = cv2.GaussianBlur(gray_img, (7, 7), 0)
        threshold = cv2.threshold(blurred, 0, 255,
            cv2.THRESH_BINARY_INV | cv2.THRESH_OTSU)[1]
        
        analysis = cv2.connectedComponentsWithStats(threshold,
                                                    4,
                                                    cv2.CV_32S)
        (totalLabels, label_ids, values, centroid) = analysis
        
        output = np.zeros(gray_img.shape, dtype="uint8")
        
        for i in range(1, totalLabels):
            componentMask = (label_ids == i).astype("uint8") * 255
            output = cv2.bitwise_or(output, componentMask)
        cv2.imwrite('uploads/img.png', output)

        return "../backend/uploads/img.png"
  
@app.route('/medias', methods=['POST'])
def medias():
    if request.method == 'POST':

        file = request.files['file']
        file.save(os.path.join("uploads", file.filename))

        im_in = cv2.imread("uploads/"+file.filename);
        gray = cv2.cvtColor(im_in, cv2.COLOR_BGR2GRAY)
        im_in = cv2.medianBlur(gray,5)
        th3 = cv2.adaptiveThreshold(im_in,255,cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY,11,2)

        cv2.imwrite('uploads/img.png', th3)

        return "../backend/uploads/img.png"

@app.route('/otsu', methods=['POST'])
def otsu():
    if request.method == 'POST':
        file = request.files['file']
        file.save(os.path.join("uploads", file.filename))
        im_in = cv2.imread("uploads/"+file.filename);
        gray = cv2.cvtColor(im_in, cv2.COLOR_BGR2GRAY)
        blur = cv2.GaussianBlur(gray,(5,5),0)
        ret3,th3 = cv2.threshold(blur,0,255,cv2.THRESH_BINARY+cv2.THRESH_OTSU)
        cv2.imwrite('uploads/img.png', th3)

        return "../backend/uploads/img.png"
  
# driver function
if __name__ == '__main__':
  
    app.run(debug = True)