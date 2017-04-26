# imports for image rec
import numpy as np
import cv2
from matplotlib import pyplot as plt

# imports for command line arguments
import sys

# imports for extracting video frames
import os

def main(arg1):
    print(arg1)

    # original image
    # -1 loads as-is so if it will be 3 or 4 channel as the original
    image = cv2.imread('c44_1.jpg', -1)
    image2 = cv2.imread('c44_2.jpg', -1)
    image3 = cv2.imread('c44_3.jpg', -1)
    sourceImages = [image, image2, image3]

    spot1_vertices = [[(0, 286), (70, 287), (92, 158), (0, 161)]]
    spot2_vertices = [[(100, 155), (220, 155), (213, 285), (80, 287)]]
    spot3_vertices = [[(231, 155), (355, 162), (365, 289), (223, 286)]]
    spot4_vertices = [[(362, 162), (482, 173), (513, 298), (376, 293)]]
    spot5_vertices = [[(493, 173), (605, 180), (651, 310), (526, 300)]]
    spot6_vertices = [[(615, 180), (710, 190), (710, 310), (664, 310)]]
    lotVertices = [spot1_vertices, spot2_vertices, spot3_vertices,
                   spot4_vertices, spot5_vertices, spot6_vertices]
    parkingSpots = [0, 0, 0, 0, 0, 0]
    parkingSpotBoundingRectangles = []

    """
    # could use this code if bounding boxes are needed...

    # Go through all the lot vertices and create bounding rectangles to crop later
    for i in range(len(lotVertices)):
        smallestXCoordinate = 1000;
        smallestYCoordinate = 1000;
        largestXCoordinate = 0;
        largestYCoordinate = 0;

        for j in range(len(lotVertices[i][0])):
            if lotVertices[i][0][j][0] > largestXCoordinate:
                largestXCoordinate = lotVertices[i][0][j][0]
            if lotVertices[i][0][j][0] < smallestXCoordinate:
                smallestXCoordinate = lotVertices[i][0][j][0]
            if lotVertices[i][0][j][1] > largestYCoordinate:
                largestYCoordinate = lotVertices[i][0][j][1]
            if lotVertices[i][0][j][1] < smallestYCoordinate:
                smallestYCoordinate = lotVertices[i][0][j][1]

        parkingSpotBoundingRectangles.append([(smallestXCoordinate, smallestYCoordinate), (largestXCoordinate, largestYCoordinate)])

    print(parkingSpotBoundingRectangles)
    """

    maskedImages = []
    processedImages = 0

    for i in range(len(sourceImages)):
        for j in range(len(lotVertices)):
            # mask defaulting to black for 3-channel and transparent for 4-channel
            parkingSpotMask = np.zeros(sourceImages[i].shape, dtype=np.uint8)
            parkingLotRegionOfInterest = np.array(lotVertices[j], dtype=np.int32)

            # fill the ROI so it doesn't get wiped out when the mask is applied
            channelCount = image.shape[2]
            ignoreMaskColor = (255, ) * channelCount
            cv2.fillPoly(parkingSpotMask, parkingLotRegionOfInterest, ignoreMaskColor)

            # apply the mask
            maskedImages.append(cv2.bitwise_and(sourceImages[i], parkingSpotMask))

            """
            # I was going to crop the image to a rectangle around the parking spot to save computation time,
            # but I had a lot of issues with that and abandoned the idea

            # crop the image to the bounding box
            startY = parkingSpotBoundingRectangles[j][0][1]
            endY = parkingSpotBoundingRectangles[j][1][1]
            startX = parkingSpotBoundingRectangles[j][0][0]
            endX = parkingSpotBoundingRectangles[j][0][0]
            print(maskedImages[processedImages])

            maskedImages[processedImages] = maskedImages[processedImages][startY:endY, startX:endX]
            print(maskedImages[processedImages])
            """

            # make the image grayscale
            grayImage = cv2.cvtColor(maskedImages[processedImages], cv2.COLOR_BGR2GRAY)

            # convert to floating point image
            grayImage = np.float32(grayImage)

            # find corners in image
            cornerDetectedImage = cv2.cornerHarris(grayImage, 3, 3, 0.04)

            # Threshold for an optimal value, it may vary depending on the image.
            maskedImages[processedImages][cornerDetectedImage > 0.001 * cornerDetectedImage.max()] = [0, 0, 255]

            # display the result
            cv2.imshow('c44_' + str(processedImages), maskedImages[processedImages])

            

            processedImages += 1

    if cv2.waitKey(0) & 0xff == 27:
        cv2.destroyAllWindows()

if __name__ == "__main__":
    main(sys.argv[1])
