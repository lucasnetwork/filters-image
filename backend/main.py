# Using flask to make an api
import os
# import necessary libraries and functions
from flask import Flask, request, render_template
import cv2
import numpy as np

# creating a Flask app
UPLOAD_FOLDER = './static/uploads'
app = Flask(__name__, template_folder='./static/pages',
            static_folder='./static')
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# on the terminal type: curl http://127.0.0.1:5000/
# returns hello world when we use GET.
# returns the data that we send when we use POST.

# A simple function to calculate the square of a number
# the number to be squared is sent in the URL when we use GET
# on the terminal type: curl http://127.0.0.1:5000 / home / 10
# this returns 100 (square of 10)


def region_growing(img, seed):
    # Parameters for region growing
    neighbors = [(-1, 0), (1, 0), (0, -1), (0, 1)]
    region_threshold = 0.2
    region_size = 1
    intensity_difference = 0
    neighbor_points_list = []
    neighbor_intensity_list = []

    # Mean of the segmented region
    region_mean = img[seed]

    # Input image parameters
    height, width = img.shape
    image_size = height * width

    # Initialize segmented output image
    segmented_img = np.zeros((height, width, 1), np.uint8)

    # Region growing until intensity difference becomes greater than certain
    #  threshold
    while (intensity_difference < region_threshold) & (region_size
                                                       < image_size):
        # Loop through neighbor pixels
        for i in range(4):
            # Compute the neighbor pixel position
            x_new = seed[0] + neighbors[i][0]
            y_new = seed[1] + neighbors[i][1]

            # Boundary Condition - check if the coordinates are
            # inside the image
            check_inside = (x_new >= 0) & (y_new >= 0) & (
                x_new < height) & (y_new < width)

            # Add neighbor if inside and not already in segmented_img
            if check_inside:
                if segmented_img[x_new, y_new] == 0:
                    neighbor_points_list.append([x_new, y_new])
                    neighbor_intensity_list.append(img[x_new, y_new])
                    segmented_img[x_new, y_new] = 255

        # Add pixel with intensity nearest to the mean to the region
        distance = abs(neighbor_intensity_list-region_mean)
        pixel_distance = min(distance)
        index = np.where(distance == pixel_distance)[0][0]
        segmented_img[seed[0], seed[1]] = 255
        region_size += 1

        # New region mean
        region_mean = (region_mean*region_size +
                       neighbor_intensity_list[index])/(region_size+1)

        # Update the seed value
        seed = neighbor_points_list[index]
        # Remove the value from the neighborhood lists
        neighbor_intensity_list[index] = neighbor_intensity_list[-1]
        neighbor_points_list[index] = neighbor_points_list[-1]

    return segmented_img


@app.route('/preenchimento', methods=['POST'])
def upload_file():
    if request.method == 'POST':
        file = request.files['file']

        file.save(os.path.join("./static/uploads", file.filename))

        im_in = cv2.imread("./static/uploads/" +
                           file.filename, cv2.IMREAD_GRAYSCALE)

        th, im_th = cv2.threshold(im_in, 220, 255, cv2.THRESH_BINARY)

        im_floodfill = im_th.copy()
        h, w = im_th.shape[:2]
        mask = np.zeros((h+2, w+2), np.uint8)

        cv2.floodFill(im_floodfill, mask, (0, 0), 255)

        im_floodfill_inv = cv2.bitwise_not(im_floodfill)


        im_out = im_th | im_floodfill_inv
        cv2.imwrite('./static/uploads/img.png', im_out)
        return "static/uploads/img.png"



@app.route('/hitOrMiss', methods=['POST'])
def hitOrMiss():
    file = request.files['file']
    file.save(os.path.join("./static/uploads", file.filename))

    im_in = cv2.imread("./static/uploads/" +
                       file.filename, cv2.IMREAD_GRAYSCALE)

    kernel = np.ones((5, 5), np.uint8)
    im_in = cv2.morphologyEx(im_in, cv2.MORPH_CLOSE, kernel)

    cv2.imwrite('./static/uploads/img.png', im_in)


    return "static/uploads/img.png"



@app.route('/conexao', methods=['POST'])
def conexao():
    if request.method == 'POST':
        file = request.files['file']
        file.save(os.path.join("./static/uploads", file.filename))

        im_in = cv2.imread("./static/uploads/"+file.filename)

        gray_img = cv2.cvtColor(im_in, cv2.COLOR_BGR2GRAY)

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
        cv2.imwrite('./static/uploads/img.png', output)

        return "static/uploads/img.png"


@app.route('/medias', methods=['POST'])
def medias():
    if request.method == 'POST':

        file = request.files['file']
        file.save(os.path.join("./static/uploads", file.filename))

        im_in = cv2.imread("./static/uploads/"+file.filename)
        gray = cv2.cvtColor(im_in, cv2.COLOR_BGR2GRAY)
        im_in = cv2.medianBlur(gray, 5)
        th3 = cv2.adaptiveThreshold(
            im_in, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 11, 2)

        cv2.imwrite('./static/uploads/img.png', th3)

        return "static/uploads/img.png"


@app.route('/otsu', methods=['POST'])
def otsu():
    if request.method == 'POST':
        file = request.files['file']

        file.save(os.path.join("./static/uploads", file.filename))
        im_in = cv2.imread("./static/uploads/"+file.filename);
        gray = cv2.cvtColor(im_in, cv2.COLOR_BGR2GRAY)
        blur = cv2.GaussianBlur(gray,(5,5),0)
        ret3,th3 = cv2.threshold(blur,0,255,cv2.THRESH_BINARY+cv2.THRESH_OTSU)
        cv2.imwrite('./static/uploads/img.png', th3)


        return "./static/uploads/img.png"


@app.route('/crescimentoRegiao', methods=['POST'])
def crescimentoRegiao():
    boxes = []
    file = request.files['file']
    file.save(os.path.join("./static/uploads", file.filename))

    img = cv2.imread("./static/uploads/"+file.filename, 0)

    resized = cv2.resize(img, (256, 256))
    seed = (100, 100)
    segmented_img = region_growing(resized, seed)
    cv2.imwrite("./static/uploads/crescimetoRegiao.png", segmented_img)
    return "./static/uploads/crescimetoRegiao.png"

@app.route('/watershed', methods=['POST'])
def watershed():
    file = request.files['file']
    file.save(os.path.join("./static/uploads", file.filename))

    img = cv2.imread("./static/uploads/"+file.filename, 0)

    ret, thresh = cv2.threshold(img, 0, 255, cv2.THRESH_BINARY_INV +
                                cv2.THRESH_OTSU)

    # noise removal
    kernel = np.ones((5, 5), np.uint8)
    opening = cv2.morphologyEx(thresh, cv2.MORPH_OPEN, kernel, iterations=19)
    # sure background area
    sure_bg = cv2.dilate(opening, kernel, iterations=20)
    # Finding sure foreground area
    dist_transform = cv2.distanceTransform(opening, cv2.DIST_L2, 5)
    ret, sure_fg = cv2.threshold(
        dist_transform, 0.90*dist_transform.max(), 255, 0)
    # Finding unknown region
    sure_fg = np.uint8(sure_fg)
    unknown = cv2.subtract(sure_bg, sure_fg)

    # Marker labelling
    ret, markers = cv2.connectedComponents(sure_fg)
    # Add one to all labels so that sure background is not 0, but 1
    markers = markers+1
    # Now, mark the region of unknown with zero
    markers[unknown == 255] = 0
    # reduce /conver channels to 3
    img = cv2.cvtColor(img, cv2.COLOR_GRAY2BGR)

    markers = cv2.watershed(img, markers)

    img[markers == -1] = [255, 0, 0]

    cv2.imwrite("./static/uploads/watershed.png", img)
    return "./static/uploads/watershed.png"


@app.route("/")
def page():
    return render_template("index.html")


# driver function
if __name__ == '__main__':

    app.run(debug=True)
