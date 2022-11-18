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
  
# driver function
if __name__ == '__main__':
  
    app.run(debug = True)