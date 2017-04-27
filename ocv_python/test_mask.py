# imports for image recognition
import numpy as np
import cv2
from matplotlib import pyplot as plt

# imports for command line arguments
import sys

# imports for extracting video frames
import os

def main(requestedLot):
    print(requestedLot)

    # original image
    # -1 loads as-is so if it will be 3 or 4 channel as the original
    image = cv2.imread('c44_1.jpg', -1)
    image2 = cv2.imread('c44_2.jpg', -1)
    image3 = cv2.imread('c44_3.jpg', -1)
    sourceImages = [image, image2, image3]

    # define vertices where parking spots are, starting at top-left corner going clockwise
    spot1_vertices = [[(0, 286), (70, 287), (92, 158), (0, 161)]]
    spot2_vertices = [[(100, 155), (220, 155), (213, 285), (80, 287)]]
    spot3_vertices = [[(231, 155), (355, 162), (365, 289), (223, 286)]]
    spot4_vertices = [[(362, 162), (482, 173), (513, 298), (376, 293)]]
    spot5_vertices = [[(493, 173), (605, 180), (651, 310), (526, 300)]]
    spot6_vertices = [[(615, 180), (710, 190), (710, 310), (664, 310)]]
    lotVertices = [spot1_vertices, spot2_vertices, spot3_vertices,
                   spot4_vertices, spot5_vertices, spot6_vertices]

    # keeps track of state of parking spots
    parkingSpotStates = [0, 0, 0, 0, 0, 0]

    # Go through all the lot vertices and create bounding rectangles to use for cropping later
    parkingSpotBoundingRectangles = []

    for i in range(len(lotVertices)):
        for j in range(len(lotVertices[i][0])):
            if j == 0:
                largestXCoordinate = lotVertices[i][0][j][0]
                smallestXCoordinate = lotVertices[i][0][j][0]
                largestYCoordinate = lotVertices[i][0][j][1]
                smallestYCoordinate = lotVertices[i][0][j][1]
            else:
                if lotVertices[i][0][j][0] > largestXCoordinate:
                    largestXCoordinate = lotVertices[i][0][j][0]
                if lotVertices[i][0][j][0] < smallestXCoordinate:
                    smallestXCoordinate = lotVertices[i][0][j][0]
                if lotVertices[i][0][j][1] > largestYCoordinate:
                    largestYCoordinate = lotVertices[i][0][j][1]
                if lotVertices[i][0][j][1] < smallestYCoordinate:
                    smallestYCoordinate = lotVertices[i][0][j][1]

        parkingSpotBoundingRectangles.append([(smallestXCoordinate, smallestYCoordinate), (largestXCoordinate, largestYCoordinate)])

    # the big algorithm begins
    maskedImages = []
    processedSpots = 0

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

            # crop the image to the bounding box
            startY = parkingSpotBoundingRectangles[j][0][1]
            endY = parkingSpotBoundingRectangles[j][1][1]
            startX = parkingSpotBoundingRectangles[j][0][0]
            endX = parkingSpotBoundingRectangles[j][1][0]

            maskedImages[processedSpots] = maskedImages[processedSpots][startY:endY, startX:endX]

            # make the image grayscale
            grayImage = cv2.cvtColor(maskedImages[processedSpots], cv2.COLOR_BGR2GRAY)

            # convert to floating point image
            grayImage = np.float32(grayImage)

            # find corners in image
            cornerDetectedImage = cv2.cornerHarris(grayImage, 3, 3, 0.10)

            # mark red pixels as corners; decimal is threshold for an optimal value, it may vary depending on the image.
            maskedImages[processedSpots][cornerDetectedImage > 0.0005 * cornerDetectedImage.max()] = [0, 0, 255]

            # check number of red pixels (corners)
            # np.array values in BGR order
            redMinimumRGB = np.array([0, 0, 255], np.uint8)
            redMaximumRGB = np.array([0, 0, 255], np.uint8)
            redPixels = cv2.inRange(maskedImages[processedSpots], redMinimumRGB, redMaximumRGB)
            maskedImages[processedSpots] = cv2.bitwise_and(maskedImages[processedSpots], maskedImages[processedSpots], mask = redPixels)

            redPixels = cv2.countNonZero(redPixels)
            print("the number of red pixels for spot " + str(j) + " in image " + str(i)+ " is: " + str(redPixels))

            # set the status of the parking spot to 1 if occupied or 0 if not
            if redPixels < 125:
                parkingSpotStates[j] = 1;
            else:
                parkingSpotStates[j] = 0;

            # display the result
            cv2.imshow('c44_' + str(processedSpots), maskedImages[processedSpots])

            processedSpots += 1

        # make a deep copy of the source image
        parkingLotView = np.copy(sourceImages[i])

        # adds a green or red polygon over each parking spot corresponding to whether it's open or closed
        for k in range(len(parkingSpotStates)):
            points = np.array(lotVertices[k], dtype=np.int32)

            if parkingSpotStates[k] == 0:
                parkingLotView = cv2.fillPoly(parkingLotView, points, [0,0,255])
            else:
                parkingLotView = cv2.fillPoly(parkingLotView, points, [0,255,0])

        # how visible the original image is
        alpha = 0.6
        # how visible our polygons are
        beta = 1 - alpha
        # scalar added to each sum
        gamma = 0

        # create an alpha-blended image
        translucentView = cv2.addWeighted(sourceImages[i], alpha, parkingLotView, beta, gamma)

        cv2.imshow("final view_" + str(i), translucentView)

    if cv2.waitKey(0) & 0xff == 27:
        cv2.destroyAllWindows()

if __name__ == "__main__":
    main(sys.argv[1])
