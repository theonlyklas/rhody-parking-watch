# imports for image recognition
import numpy as np
import cv2
from matplotlib import pyplot as plt

# imports for command line arguments
import sys

# imports for extracting video frames
import os
import random

class ParkingLot:
    # default constructor
    def __init__(self, requestedLot, requestedFrame):
        self.lotName = requestedLot

        # pull image of lot from video file
        self.viewOfLot = self.retrieveViewOfParkingLot(requestedLot, requestedFrame)

        # use requestedLot to set number of parking spots and detected corner threshold
        # used to determine whether spots are taken or empty
        if requestedLot == "camera19":
            self.parkingSpotCount = 10
            self.cornerDetectionRatioThreshold = 0.07
        elif requestedLot == "camera24":
            self.parkingSpotCount = 7
            self.cornerDetectionRatioThreshold = 0.04
        elif requestedLot == "camera32":
            self.parkingSpotCount = 6
            self.cornerDetectionRatioThreshold = 0.05
        elif requestedLot == "camera44":
            self.parkingSpotCount = 6
            self.cornerDetectionRatioThreshold = 0.02
        elif requestedLot == "camera50":
            self.parkingSpotCount = 5
            self.cornerDetectionRatioThreshold = 0.03
        elif requestedLot == "plainsrdA":
            self.parkingSpotCount = 4
            self.cornerDetectionRatioThreshold = 0.065
        elif requestedLot == "plainsrdC":
            self.parkingSpotCount = 7
            self.cornerDetectionRatioThreshold = 0.07

        # create parking spots
        self.parkingSpots = []
        for i in range(self.parkingSpotCount):
            self.parkingSpots.append(ParkingSpot(requestedLot, i))

    # needs to retrieve from video files on server
    def retrieveViewOfParkingLot(self, requestedLot, requestedFrame):
        # open the requestedLot's video file
        video = cv2.VideoCapture("./camera-footage/" + requestedLot + ".avi")

        # choose a random frame if 0 is provided
        if requestedFrame == 0:
            frameCount = int(video.get(cv2.CAP_PROP_FRAME_COUNT))
            requestedFrame = random.randrange(frameCount)

        # retrieve the requestedFrame
        video.set(1, float(requestedFrame))
        success, frame = video.read()

        return frame

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

            # count number of pixels in parking spot
            minimumRGB = np.array([1, 1, 1], np.uint8)
            maximumRGB = np.array([255, 255, 255], np.uint8)
            pixels = cv2.inRange(maskedImages[i], minimumRGB, maximumRGB)
            totalPixels = cv2.countNonZero(pixels)

            # make the image grayscale
            grayImage = cv2.cvtColor(maskedImages[i], cv2.COLOR_BGR2GRAY)

            # convert to floating point image
            grayImage = np.float32(grayImage)

            # find corners in image
            cornerDetectedImage = cv2.cornerHarris(grayImage, 3, 3, 0.1)

            # mark red pixels as corners
            # decimal is threshold for an optimal value, it may vary depending on the image.
            maskedImages[i][cornerDetectedImage > 0.0005 * cornerDetectedImage.max()] = [0, 0, 255]

            # check number of red pixels (corners)
            # np.array values in BGR order
            redMinimumRGB = np.array([0, 0, 255], np.uint8)
            redMaximumRGB = np.array([0, 0, 255], np.uint8)
            redPixels = cv2.inRange(maskedImages[i], redMinimumRGB, redMaximumRGB)
            maskedImages[i] = cv2.bitwise_and(maskedImages[i], maskedImages[i], mask = redPixels)

            redPixels = cv2.countNonZero(redPixels)
            redPixelRatio = redPixels/totalPixels

            print("the number of red pixels for spot " + str(i) + " in image " + str(i)+ " is: " + str(redPixels) + " with a ratio of " + str(redPixelRatio))

            # set the status of the parking spot to 1 if occupied or 0 if not
            if redPixelRatio < self.cornerDetectionRatioThreshold:
                self.parkingSpots[i].parkingSpotState = "open";
            else:
                self.parkingSpots[i].parkingSpotState = "taken";

            # display the result
            # cv2.imshow('c44_' + str(i), maskedImages[i])

        # make a deep copy of the source image
        parkingLotView = np.copy(self.viewOfLot)

        # adds a green or red polygon over each parking spot corresponding to whether it's open or closed
        for i in range(len(self.parkingSpots)):
            points = np.array(self.parkingSpots[i].spotVertices, dtype=np.int32)

            if self.parkingSpots[i].parkingSpotState == "taken":
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
        self.viewOfLot = cv2.addWeighted(self.viewOfLot, alpha, parkingLotView, beta, gamma)

        # cv2.imshow("final view_" + str(i), self.viewOfLot)
        cv2.imwrite(self.lotName + ".png", self.viewOfLot)

        if cv2.waitKey(0) & 0xff == 27:
            cv2.destroyAllWindows()

class ParkingSpot:
    # default constructor
    def __init__(self, requestedLot, requestedSpot):
        # chooses the right vertices for the parking spot
        # define vertices where parking spots are, vertices starting at top-left corner going clockwise
        if requestedLot == "camera19":
            if requestedSpot == 0:
                self.spotVertices = [[(8, 291), (57, 298), (8, 315)]]
            elif requestedSpot == 1:
                self.spotVertices = [[(61, 303), (120, 308), (33, 335), (8, 334), (8, 319)]]
            elif requestedSpot == 2:
                self.spotVertices = [[(127, 308), (187, 315), (108, 344), (43, 336)]]
            elif requestedSpot == 3:
                self.spotVertices = [[(188, 318), (243, 322), (189, 351), (120, 344)]]
            elif requestedSpot == 4:
                self.spotVertices = [[(260, 320), (329, 325), (269, 357), (198, 352)]]
            elif requestedSpot == 5:
                self.spotVertices = [[(340, 325), (415, 331), (350, 368), (283, 358)]]
            elif requestedSpot == 6:
                self.spotVertices = [[(422, 336), (495, 340), (441, 373), (361, 369)]]
            elif requestedSpot == 7:
                self.spotVertices = [[(504, 341), (577, 348), (527, 385), (450, 377)]]
            elif requestedSpot == 8:
                self.spotVertices = [[(585, 350), (671, 356), (632, 395), (542, 385)]]
            elif requestedSpot == 9:
                self.spotVertices = [[(682, 357), (710, 359), (711, 404), (639, 396)]]
        elif requestedLot == "camera24":
            if requestedSpot == 0:
                self.spotVertices = [[(4, 331), (22, 334), (83, 446), (4, 461)]]
            elif requestedSpot == 1:
                self.spotVertices = [[(31, 323), (159, 314), (257, 414), (99, 441)]]
            elif requestedSpot == 2:
                self.spotVertices = [[(169, 309), (290, 300), (407, 386), (273, 411)]]
            elif requestedSpot == 3:
                self.spotVertices = [[(298, 293), (383, 280), (535, 358), (421, 383)]]
            elif requestedSpot == 4:
                self.spotVertices = [[(394, 275), (476, 263), (638, 335), (546, 354)]]
            elif requestedSpot == 5:
                self.spotVertices = [[(500, 263), (589, 252), (708, 304), (707, 318), (652, 331)]]
            elif requestedSpot == 6:
                self.spotVertices = [[(605, 250), (684, 237), (708, 240), (708, 295)]]
        elif requestedLot == "camera32":
            if requestedSpot == 0:
                self.spotVertices = [[(6, 236), (77, 246), (8, 301)]]
            elif requestedSpot == 1:
                self.spotVertices = [[(85, 244), (178, 246), (128, 313), (10, 305)]]
            elif requestedSpot == 2:
                self.spotVertices = [[(185, 247), (278, 249), (263, 310), (140, 313)]]
            elif requestedSpot == 3:
                self.spotVertices = [[(283, 246), (380, 247), (402, 313), (271, 317)]]
            elif requestedSpot == 4:
                self.spotVertices = [[(387, 248), (483, 250), (533, 316), (411, 314)]]
            elif requestedSpot == 5:
                self.spotVertices = [[(487, 250), (577, 247), (663, 315), (545, 316)]]
            elif requestedSpot == 6:
                self.spotVertices = [[(587, 246), (660, 245), (711, 260), (711, 312), (672, 311)]]
        elif requestedLot == "camera44":
            if requestedSpot == 0:
                self.spotVertices = [[(0, 286), (70, 287), (92, 158), (0, 161)]]
            elif requestedSpot == 1:
                self.spotVertices = [[(100, 155), (220, 155), (213, 285), (80, 287)]]
            elif requestedSpot == 2:
                self.spotVertices = [[(231, 155), (355, 162), (365, 289), (223, 286)]]
            elif requestedSpot == 3:
                self.spotVertices = [[(362, 162), (482, 173), (513, 298), (376, 293)]]
            elif requestedSpot == 4:
                self.spotVertices = [[(493, 173), (605, 180), (651, 310), (526, 300)]]
            elif requestedSpot == 5:
                self.spotVertices = [[(615, 180), (710, 190), (710, 310), (664, 310)]]
        elif requestedLot == "camera50":
            if requestedSpot == 0:
                self.spotVertices = [[(171, 348), (489, 308), (524, 382), (144, 429)]]
            elif requestedSpot == 1:
                self.spotVertices = [[(195, 281), (464, 246), (488, 300), (171, 341)]]
            elif requestedSpot == 2:
                self.spotVertices = [[(209, 233), (442, 203), (461, 242), (196, 277)]]
            elif requestedSpot == 3:
                self.spotVertices = [[(220, 190), (427, 169), (439, 199), (210, 228)]]
            elif requestedSpot == 4:
                self.spotVertices = [[(236, 158), (418, 142), (427, 165), (226, 177)]]
        elif requestedLot == "plainsrdA":
            if requestedSpot == 0:
                self.spotVertices = [[(377, 173), (457, 170), (502, 245), (386, 249)]]
            elif requestedSpot == 1:
                self.spotVertices = [[(465, 169), (538, 165), (609, 235), (510, 242)]]
            elif requestedSpot == 2:
                self.spotVertices = [[(545, 164), (610, 163), (693, 229), (617, 235)]]
            elif requestedSpot == 3:
                self.spotVertices = [[(615, 163), (672, 165), (719, 192), (719, 224), (698, 228)]]
        elif requestedLot == "plainsrdC":
            if requestedSpot == 0:
                self.spotVertices = [[(517, 166), (599, 182), (578, 266), (451, 238)]]
            elif requestedSpot == 1:
                self.spotVertices = [[(439, 155), (510, 165), (442, 238), (350, 219)]]
            elif requestedSpot == 2:
                self.spotVertices = [[(370, 147), (430, 154), (344, 215), (271, 204)]]
            elif requestedSpot == 3:
                self.spotVertices = [[(307, 142), (362, 145), (265, 202), (204, 193)]]
            elif requestedSpot == 4:
                self.spotVertices = [[(261, 137), (298, 142), (199, 191), (161, 185)]]
            elif requestedSpot == 5:
                self.spotVertices = [[(217, 133), (251, 137), (156, 183), (125, 178)]]
            elif requestedSpot == 6:
                self.spotVertices = [[(588, 84), (624, 90), (622, 102), (578, 95)]]

        # find bounding box to use for cropping
        self.boundingBox = self.findBoundingBox()

        # default to being taken by a car
        self.parkingSpotState = "taken";

    # finds the minimum and maximum X and Y points contained in the parking spot vertices vector
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

def main(requestedLot, requestedFrame):
    parkingLot = ParkingLot(requestedLot, requestedFrame)
    parkingLot.checkParkingSpots()

    return 0

if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])
