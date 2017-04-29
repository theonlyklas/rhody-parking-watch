# imports for image recognition
import numpy as np
import cv2
from matplotlib import pyplot as plt

# imports for command line arguments
import sys

# imports for extracting video frames
import os

class ParkingLot:
    # default constructor
    def __init__(self, requestedLot):
        if requestedLot == "lot1" or requestedLot == "lot2" or requestedLot == "lot3":
            # need to implement pulling from video footage
            self.viewOfLot = self.retrieveViewOfParkingLot(requestedLot)

            # create parking spots
            self.parkingSpot1 = ParkingSpot(requestedLot, 1)
            self.parkingSpot2 = ParkingSpot(requestedLot, 2)
            self.parkingSpot3 = ParkingSpot(requestedLot, 3)
            self.parkingSpot4 = ParkingSpot(requestedLot, 4)
            self.parkingSpot5 = ParkingSpot(requestedLot, 5)
            self.parkingSpot6 = ParkingSpot(requestedLot, 6)

            self.parkingSpots = [self.parkingSpot1, self.parkingSpot2, self.parkingSpot3, self.parkingSpot4, self.parkingSpot5, self.parkingSpot6]

            # used to determine whether spots are taken or empty
            self.maximumDetectedCorners = 125

            self.parkingSpotStates = [0, 0, 0, 0, 0, 0]

    # needs to retrieve from video files on server
    def retrieveViewOfParkingLot(self, requestedLot):
        if requestedLot == "lot1":
            return cv2.imread('c44_1.jpg', -1)
        elif requestedLot == "lot2":
            return cv2.imread('c44_2.jpg', -1)
        elif requestedLot == "lot3":
            return cv2.imread('c44_3.jpg', -1)

    def checkParkingSpots(self):
        # the big algorithm begins
        maskedImages = []

        for i in range(len(self.parkingSpots)):
            # mask defaulting to black for 3-channel and transparent for 4-channel
            parkingSpotMask = np.zeros(self.viewOfLot.shape, dtype=np.uint8)
            parkingLotRegionOfInterest = np.array(self.parkingSpots[i].spotVertices, dtype=np.int32)

            # fill the ROI so it doesn't get wiped out when the mask is applied
            channelCount = self.viewOfLot.shape[2]
            ignoreMaskColor = (255, ) * channelCount
            cv2.fillPoly(parkingSpotMask, parkingLotRegionOfInterest, ignoreMaskColor)

            # apply the mask
            maskedImages.append(cv2.bitwise_and(self.viewOfLot, parkingSpotMask))

            # crop the image to the bounding box
            startX = self.parkingSpots[i].boundingBox[0][0][0]
            endX = self.parkingSpots[i].boundingBox[0][1][0]
            startY = self.parkingSpots[i].boundingBox[0][0][1]
            endY = self.parkingSpots[i].boundingBox[0][1][1]

            maskedImages[i] = maskedImages[i][startY:endY, startX:endX]

            # make the image grayscale
            grayImage = cv2.cvtColor(maskedImages[i], cv2.COLOR_BGR2GRAY)

            # convert to floating point image
            grayImage = np.float32(grayImage)

            # find corners in image
            cornerDetectedImage = cv2.cornerHarris(grayImage, 3, 3, 0.10)

            # mark red pixels as corners; decimal is threshold for an optimal value, it may vary depending on the image.
            maskedImages[i][cornerDetectedImage > 0.0005 * cornerDetectedImage.max()] = [0, 0, 255]

            # check number of red pixels (corners)
            # np.array values in BGR order
            redMinimumRGB = np.array([0, 0, 255], np.uint8)
            redMaximumRGB = np.array([0, 0, 255], np.uint8)
            redPixels = cv2.inRange(maskedImages[i], redMinimumRGB, redMaximumRGB)
            maskedImages[i] = cv2.bitwise_and(maskedImages[i], maskedImages[i], mask = redPixels)

            redPixels = cv2.countNonZero(redPixels)
            print("the number of red pixels for spot " + str(i) + " in image " + str(i)+ " is: " + str(redPixels))

            # set the status of the parking spot to 1 if occupied or 0 if not
            if redPixels < self.maximumDetectedCorners:
                self.parkingSpotStates[i] = 1;
            else:
                self.parkingSpotStates[i] = 0;

            # display the result
            cv2.imshow('c44_' + str(i), maskedImages[i])

        # make a deep copy of the source image
        parkingLotView = np.copy(self.viewOfLot)

        # adds a green or red polygon over each parking spot corresponding to whether it's open or closed
        for i in range(len(self.parkingSpotStates)):
            points = np.array(self.parkingSpots[i].spotVertices, dtype=np.int32)

            if self.parkingSpotStates[i] == 0:
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
        translucentView = cv2.addWeighted(self.viewOfLot, alpha, parkingLotView, beta, gamma)

        cv2.imshow("final view_" + str(i), translucentView)

        if cv2.waitKey(0) & 0xff == 27:
            cv2.destroyAllWindows()

class ParkingSpot:
    # default constructor
    def __init__(self, requestedLot, requestedSpot):
        # chooses the right vertices for the parking spot
        if requestedLot == "lot1" or requestedLot == "lot2" or requestedLot == "lot3":
            # define vertices where parking spots are, vertices starting at top-left corner going clockwise
            if requestedSpot == 1:
                self.spotVertices = [[(0, 286), (70, 287), (92, 158), (0, 161)]]
            elif requestedSpot == 2:
                self.spotVertices = [[(100, 155), (220, 155), (213, 285), (80, 287)]]
            elif requestedSpot == 3:
                self.spotVertices = [[(231, 155), (355, 162), (365, 289), (223, 286)]]
            elif requestedSpot == 4:
                self.spotVertices = [[(362, 162), (482, 173), (513, 298), (376, 293)]]
            elif requestedSpot == 5:
                self.spotVertices = [[(493, 173), (605, 180), (651, 310), (526, 300)]]
            elif requestedSpot == 6:
                self.spotVertices = [[(615, 180), (710, 190), (710, 310), (664, 310)]]

        # find bounding box to use for cropping
        self.boundingBox = self.findBoundingBox()

        # default to being taken by a car
        self.parkingSpotState = "taken";

    # finds the minimum and maximum X and Y points contained in the parking spot boundary vector
    def findBoundingBox(self):
        for i in range(len(self.spotVertices[0])):
            if i == 0:
                largestXCoordinate = self.spotVertices[0][i][0]
                smallestXCoordinate = self.spotVertices[0][i][0]
                largestYCoordinate = self.spotVertices[0][i][1]
                smallestYCoordinate = self.spotVertices[0][i][1]

            if self.spotVertices[0][i][0] > largestXCoordinate:
                largestXCoordinate = self.spotVertices[0][i][0]
            if self.spotVertices[0][i][0] < smallestXCoordinate:
                smallestXCoordinate = self.spotVertices[0][i][0]
            if self.spotVertices[0][i][1] > largestYCoordinate:
                largestYCoordinate = self.spotVertices[0][i][1]
            if self.spotVertices[0][i][1] < smallestYCoordinate:
                smallestYCoordinate = self.spotVertices[0][i][1]

        boundingBox = [[(smallestXCoordinate, smallestYCoordinate), (largestXCoordinate, largestYCoordinate)]]

        return boundingBox

def main(requestedLot):
    parkingLot = ParkingLot(requestedLot)
    parkingLot.checkParkingSpots()

if __name__ == "__main__":
    main(sys.argv[1])
