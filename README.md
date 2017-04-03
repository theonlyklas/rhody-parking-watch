# rhody-parking-watch

# Running the Android Emulator:
0. Install Cordova, node, git, etc...
1. Download the Android Studio Bundle and command line tools (won't be touched until later). https://developer.android.com/studio/index.html#downloads
2. Install the Android Studio Bundle.
3. Open Android Studio, install any updates.
4. Select Tools -> Android -> AVD Manager in Android Studio
5. Create a Nexus 5X emulated phone
6. If a warning comes up about disabling Hyper V, open a command prompt with administrator privileges and paste in `dism.exe /Online /Disable-Feature:Microsoft-Hyper-V-All`
7. Restart, reopen Android Studio, install the Intel x86 Emulator Accelerator (HAXM) if it couldn't go through last time.
8. Test the emulated device in Android Studio, make sure it opens and displays the Android logo and home screen.
9. Open Control Panel -> System -> Advanced System Settings -> Advanced -> Environment Variables
10. Create a new system variable `ANDROID_HOME` with a value of `C:/Users/Jason/AppData/Local/Android/sdk` except you put your username instead
11. Select the Path variable on the top half and click edit
12. Add entries of `%ANDROID_HOME%\tools` and `%ANDROID_HOME%\platform-tools\`
13. Open the command line tools zip you downloaded earlier
14. Copy the tools folder to `C:/Users/Jason/AppData/Local/Android/sdk`
15. Go to the RhodyParkingTracker folder and open a command prompt
16. Run the commands `cordova platform remove android` and `cordova platform add android` in that order
17. Run `cordova requirements android` and verify that there are no errors. Expected output:
  `Requirements check results for android:
  Java JDK: installed 1.8.0
  Android SDK: installed true
  Android target: installed android-25
  Gradle: installed`
17. Finally, run `cordova emulate android` and it should work.

# OpenCV Tutorial

http://docs.opencv.org/3.2.0/ Use this for tutorials

1. Install Python 3.5 (3.6 might work as well, can't confirm, but anything before 3.3 won't work)

2. Change windows environmental path to include Python35 and Python35/Scripts directories to be able to use pip (probably not needed on Mac and Linux, I can't verify):

3. From an admin command line/terminal, run these commands anywhere (only needs to be done once):
`pip install opencv-python
pip install matplotlib`

4. Run the test_ORB.py file

(COMPLETELY OPTIONAL AND I HAVEN'T TRIED THIS YET) To test out SIFT and SURF algorithms:
git clone both the opencv AND opencv_contrib repositories
follow cmake instructions
compile the library

^it's a patented image recognition algorithm so I'm avoiding it tbh

# Description

https://docs.google.com/document/d/1KWpRGvawPw_UamIB8e6FuuQAPFoMKr6Z-4_jN6DZ0PY/edit

The purpose of our app is to identify open parking spots in URI parking lots. By identifying open spots, users will be able to find a parking spot in a timely manner. First we will establish a working app that utilizes the camera on a smartphone which, when pointed at a birds eye view image of a parking lot, will recognize which spots are taken, which are free, and how many people are currently driving around looking for parking. Ultimately, we could apply this technology to parking lots in other locations to help people find parking. This app would be useful to students, faculty, and any visitors using these parking lots.
