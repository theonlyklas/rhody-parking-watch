/* GLOBAL VARIABLES HERE */
window.VIEWS = ["userSelectionMenu"];
window.USER_CLASS;
window.DESTINATION;
window.GPS_COORDINATES = findParkingLot();

/* prevent memory leaks by deleting globals when tab closes */
window.onunload = function() {
  /* GLOBAL VARIABLES */
  delete window.VIEWS;
  delete window.USER_CLASS;
  delete window.DESTINATION;
  delete window.GPS_COORDINATES;

  /* WINDOW HTMLS */
  delete window.DEFAULT_CORDOVA_HTML;
  delete window.USER_SELECTION_MENU_HTML;
  delete window.HELPFUL_LINKS_HTML;
  delete window.AFTER_USER_TYPE_HTML;
  delete window.VIEW_MY_LOTS_HTML;
  delete window.FIND_CLOSEST_HTML;
  delete window.AFTER_FINDING_LOT_HTML;
}

/* displays the next requested view from the user */
function changeHTML(desiredView) {
  /* update bacon button array */
  window.VIEWS.push(desiredView);
  /* rewrites the html inside the appWrapper according to the argument passed in */
  if (desiredView === "TEST") {
    var htmlReplacement = window.DEFAULT_CORDOVA_HTML;
  } else if (desiredView === "helpfulLinks") {
    var htmlReplacement = window.HELPFUL_LINKS_HTML;
  } else if (desiredView === "afterUserType") {
    var htmlReplacement = window.AFTER_USER_TYPE_HTML;
  } else if (desiredView === "viewMyLots") {
    var htmlReplacement = window.VIEW_MY_LOTS_HTML;
  } else if (desiredView === "findClosest") {
    var htmlReplacement = window.FIND_CLOSEST_HTML;
  } else if (desiredView === "afterFindingLot") {
    var htmlReplacement = window.AFTER_FINDING_LOT_HTML;
  } else if (desiredView === "userSelectionMenu") {
    var htmlReplacement = window.USER_SELECTION_MENU_HTML;
  }

  document.getElementById("appWrapper").innerHTML = htmlReplacement;
  // If GPS coordinates are in the next view's html, rewrite them with the saved GPS coordinates
  if (desiredView === "afterFindingLot") {
    document.getElementById("GPSLink").href = "http://maps.google.com/?q=" + window.GPS_COORDINATES;
  }
}

/* saves user class and displays next view */
function defineUser(desiredView, user) {
  window.USER_CLASS = user;

  changeHTML(desiredView);
}

/* tests server communication */
function testPHP(button) {
  /* create xhttprequest object and initialize variables */
  var xhttp = new XMLHttpRequest();
  var url = "https:/jasonklas.me/rhodyparkingtracker/test.php";

  if (button === "testPHP") {
    var params = "test=true&name=jason";
  }

  xhttp.open("POST", url, true);
  xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

  xhttp.onreadystatechange = function() {
    if (xhttp.readyState === 4 && xhttp.status === 200) {
      document.getElementById("appWrapper").innerHTML = xhttp.responseText;
    }
  };

  xhttp.send(params);
}

/* returns user to the screen they were previously viewing */
function goBack() {
  var temp = window.VIEWS[(window.VIEWS.length - 2)];
  window.VIEWS.pop();
  changeHTML(temp);
  window.VIEWS.pop();
}

/* saves the user's desired destination */
function saveDestination(desiredDestination){
  window.DESTINATION = desiredDestination;
  window.GPS_COORDINATES = findParkingLot();
}
function findParkingLot() {
  //if visitor
  if (window.USER_CLASS == 'visitor'){
    if (window.DESTINATION == 'Balentine'){
      //fine arts parking lot coordinates
       return `41°29'17.5"N 71°31'24.3"W`;
    } else if (window.DESTINATION == 'CBLSHall'){
        //plains lot coordinates
        return `41°29'25.4"N 71°32'15.7"W`;
    } else if (window.DESTINATION == 'Library'){
      //dairy barn parking lot for residents..
        return `41°29'21.0"N 71°32'01.9"W`;
    } else if (window.DESTINATION == 'MemorialUnion'){
        //keany lot coordinates
        return `41°29'02.5"N 71°32'08.6"W`;
    } else if (window.DESTINATION == 'TylerHall') {
      //plains lot coordinates
      return `41°29'17.5"N 71°31'24.3"W`;
    }
  }
  //if faculty
  if (window.USER_CLASS == 'faculty'){
    if (window.DESTINATION == 'Balentine'){
      //faculty parking next to library
        return `41°29'16.4"N 71°31'46.2"W`;
    } else if (window.DESTINATION == 'CBLSHall'){
        //lot next to chaffee
        return `41°29'21.3"N 71°31'47.5"W`;
    } else if (window.DESTINATION == 'Library'){
      //faculty parking next to library
        return `41°29'16.4"N 71°31'46.2"W`;
    } else if (window.DESTINATION == 'MemorialUnion'){
        //lot next to union
        return `41°29'11.4"N 71°31'48.5"W`;
    } else if (window.DESTINATION == 'TylerHall') {
      //lot next to tyler
      return `41°29'20.4"N 71°31'37.4"W`;
    }
  }
  //if commuter
  if (window.USER_CLASS == 'commuter'){
    if (window.DESTINATION == 'Balentine'){
      //fine arts parking lot coordinates
       return `41°29'17.5"N 71°31'24.3"W`;
    } else if (window.DESTINATION == 'CBLSHall'){
        //plains lot coordinates
        return `41°29'25.4"N 71°32'15.7"W`;
    } else if (window.DESTINATION == 'Library'){
      //plains lot coordinates
      return `41°29'17.5"N 71°31'24.3"W`;
    } else if (window.DESTINATION == 'MemorialUnion'){
        //keany lot coordinates
        return `41°29'02.5"N 71°32'08.6"W`;
    } else if (window.DESTINATION == 'TylerHall') {
      //plains lot coordinates
      return `41°29'17.5"N 71°31'24.3"W`;
    }
  }
  //if resident
  if (window.USER_CLASS == 'resident'){
    if (window.DESTINATION == 'Balentine'){
      //dairy barn parking lot for residents..
        return `41°29'21.0"N 71°32'01.9"W`;
    } else if (window.DESTINATION == 'CBLSHall'){
      //dairy barn parking lot for residents..
        return `41°29'21.0"N 71°32'01.9"W`;
    } else if (window.DESTINATION == 'Library'){
      //dairy barn parking lot for residents..
        return `41°29'21.0"N 71°32'01.9"W`;
    } else if (window.DESTINATION == 'MemorialUnion'){
      //dairy barn parking lot for residents..
        return `41°29'21.0"N 71°32'01.9"W`;
    } else if (window.DESTINATION == 'TylerHall') {
      //dairy barn parking lot for residents..
        return `41°29'21.0"N 71°32'01.9"W`;
    }
  }


}

/* strings that are used to rewrite the appWrapper element */
window.USER_SELECTION_MENU_HTML = `
  <div id="logo"></div>
        <div id="title">
            <p>I am a...</p>
        </div>
        <div id="userSelect">
          <button class="userButtons" onclick="defineUser('afterUserType', 'visitor')">Visitor</button>
          <div class="Generic-buttonSpacing"> </div>
          <button class="userButtons" onclick="defineUser('afterUserType', 'commuter')">Commuter</button>
          <div class="Generic-buttonSpacing"> </div>
          <button class="userButtons" onclick="defineUser('afterUserType', 'resident')">Resident</button>
          <div class="Generic-buttonSpacing"> </div>
          <button class="userButtons" onclick="defineUser('afterUserType', 'faculty')">Faculty Member</button>
        </div>

        <div id="helpfulLinks">
            <button class="linkButton" onclick="changeHTML('helpfulLinks')">URI Parking Links</button>
        </div>
`;

window.HELPFUL_LINKS_HTML = `
  <div id="logo"></div>
	<br>
      <div id="links">
    	<a href="http://web.uri.edu/parking/"><button class="links">Parking Services</button></a>
    	<div class="Generic-buttonSpacing"> </div>
		<a href="http://bus.apps.uri.edu"><button class="links">URI Bus Tracker</button></a>
    	<div class="Generic-buttonSpacing"> </div>
		<a href="https://www.buymypermit.com/uri/"><button class="links">Purchase URI Permit</button></a>
    	<div class="Generic-buttonSpacing"> </div>
		<a href="https://www.uri.edu"><button class="links">URI Homepage</button></a>
    	<div class="Generic-buttonSpacing"> </div>
		<a href="https://github.com/theonlyklas/rhody-parking-watch"><button class="links">Github</button></a>
        <div class="Generic-buttonSpacing"> </div>
		<button class="links" onclick="testPHP('testPHP')">Test PHP</button>
    </div>

  <div id="goBack">
    <div class="Generic-buttonSpacing"> </div>
	<div class="Generic-buttonSpacing"> </div>
	<div class="Generic-buttonSpacing"> </div>
	<button class="goBack" onclick="goBack()">Go Back</button>
  </div>
`;

window.AFTER_USER_TYPE_HTML = `
  <div id="logo"></div>
  <br>
  <button class="userButtons" onclick="changeHTML('viewMyLots')">View My Lots</button>
  <br>
  <button class="userButtons" onclick="changeHTML('findClosest')">Find Closest Lot</button>
  <br>
  <button class="goBack" onclick="goBack()">Go Back</button>
`;

//view to get list of lots
//according to specified user
window.VIEW_MY_LOTS_HTML = `
  <div id="logo"></div>
  <div id="title">
    <p>My Available Lots</p>
  </div>

<img src="/js/Parking-Lot.jpg">
<div id = "lot_info">

<br>
<br>
<br>
<div id="goBack">
	<button class="goBack" onclick="goBack()">Go Back</button>
</div>

`;

//Will show a list of destinations to choose from
//Once clicked, they will be linked to google maps
//Still working on passing a location into maps from the click
window.FIND_CLOSEST_HTML = `
  <div id="logo"></div>
  <br><br>
  <!-- dropdown menu for selecting distinations -->

  <div class="dropdown">
  <button onclick="myFunction()" class="dropbtn">Select your URI destination</button>
    <div id="myDropdown" class="dropdown-content">
      <input type="text" placeholder="Search.." id="myInput" onkeyup="filterFunction()">
      <a href="#about">
        <button class="dropdownButton" onclick="saveDestination('balentine')">Balentine Hall</button>
      </a>
      <a href="#base">
        <button class="dropdownButton" onclick="saveDestination('CBLSHall')">
          Center for Biological and Life Sciences</button>
      </a>
      <a href="#blog">
        <button class="dropdownButton" onclick="saveDestination('Library')">Library</button>
      </a>
      <a href="#contact">
        <button class="dropdownButton" onclick="saveDestination('MemorialUnion')">Memorial Union</button>
      </a>
      <a href="#custom">
        <button class="dropdownButton" onclick="saveDestination('TylerHall')">Tyler Hall</button>
      </a>
      <a href="#support">Fine Arts Center</a>
      <a href="#tools">Hope Commons Dining Hall</a>
    </div>
  </div>

<!--
  <table style="width:75%">
      <tr>
        <th>Destinations</th>
      </tr>
      <tr>
        <td> <button onclick="saveDestination('Balentine')">Balentine Hall</button></td>
      </tr>
      <tr>
        <td> <button onclick="saveDestination('CBLSHall')">CBLS Hall</button></td>
      </tr>
      <tr>
        <td> <button onclick="saveDestination('Library')">Library</button></td>
      </tr>
      <tr>
        <td> <button onclick="saveDestination('MemorialUnion')">Memorial Union</button></td>
      </tr>
      <tr>
        <td> <tr onclick="saveDestination('TylerHall')"></td>
      </tr>
  </table>

  <br>

   -->
  <br><br><br>
  <button class="userButtons" onclick="changeHTML('afterFindingLot')">Go</button>
  <div id="goBack">
    <br><br>
	<button class="goBack" onclick="goBack()">Go Back</button>
  </div>

`;

window.AFTER_FINDING_LOT_HTML = `
  <div id="logo"></div>

  <div id="title">
    <p>Closest Parking Lot</p>
    <br>
    <a id="GPSLink" href="http://maps.google.com/?q=`+ window.GPS_COORDINATES +`"><button id="GPSButton" class="userButtons">Open in Google Maps</button></a>
    <br>
    <div id="goBack">
    	<button class="goBack" onclick="goBack()">Go Back</button>
    </div>
  </div>
`;

/*Dropdown menu functionality*/

/* When the user clicks on the button,
toggle between hiding and showing the dropdown content */
function myFunction() {
    document.getElementById("myDropdown").classList.toggle("show");
}

function filterFunction() {
    var input, filter, ul, li, a, i;
    input = document.getElementById("myInput");
    filter = input.value.toUpperCase();
    div = document.getElementById("myDropdown");
    a = div.getElementsByTagName("a");
    for (i = 0; i < a.length; i++) {
        if (a[i].innerHTML.toUpperCase().indexOf(filter) > -1) {
            a[i].style.display = "";
        } else {
            a[i].style.display = "none";
        }
    }
}





/* CORDOVA STUFF, DON'T TOUCH */

/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
  // Application Constructor
  initialize: function() {
    document.addEventListener('deviceready', this.onDeviceReady.bind(this),
      false);
  },

  // deviceready Event Handler
  //
  // Bind any cordova events here. Common events are:
  // 'pause', 'resume', etc.
  onDeviceReady: function() {
    this.receivedEvent('deviceready');
  },


  // Update DOM on a Received Event
  receivedEvent: function(id) {
    var parentElement = document.getElementById(id);
    var listeningElement = parentElement.querySelector('.listening');
    var receivedElement = parentElement.querySelector('.received');

    listeningElement.setAttribute('style', 'display:none;');
    receivedElement.setAttribute('style', 'display:block;');

    console.log('Received Event: ' + id);
  }
};

app.initialize();

window.DEFAULT_CORDOVA_HTML = `
    <div class="app">
        <h1>Apache Cordova</h1>
        <div id="deviceready" class="blink">
            <p class="event listening">Connecting to Device</p>
            <p class="event received">Device is Ready</p>
        </div>
    </div>
`;
