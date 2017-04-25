/* GLOBAL VARIABLES HERE */
window.VIEWS = ['userSelectionMenu'];
window.USER_CLASS;
window.DESTINATION;

/* prevent memory leaks by deleting globals when tab closes */
window.onunload = function() {
  /* GLOBAL VARIABLES */
  delete window.CURRENT_VIEW;
  delete window.PREVIOUS_VIEW;
  delete window.USER_CLASS;
  delete window.DESTINATION;

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
  /* back button update counter array */
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
  /* save previous window */
  var temp = window.VIEWS[(window.VIEWS.length - 2)];
  window.VIEWS.pop(); 
  changeHTML(temp);
  window.VIEWS.pop();
}

/* saves the user's desired destination */
function saveDestination(desiredDestination){
  window.DESTINATION = desiredDestination;
}

/* strings that are used to rewrite the appWrapper element */
window.USER_SELECTION_MENU_HTML = `
  <div id="logo"></div>
  <div id="title">
      <p>I am a...</p>
  </div>
  <div id="userSelect">
    <button class="userButtons" onclick="defineUser('afterUserType', 'visitor')">Visitor</button>
    <br>
    <button class="userButtons" onclick="defineUser('afterUserType', 'commuter')">Commuter</button>
    <br>
    <button class="userButtons" onclick="defineUser('afterUserType', 'resident')">Resident</button>
    <br>
    <button class="userButtons" onclick="defineUser('afterUserType', 'faculty')">Faculty Member</button>
    <br>
  </div>

  <div id="helpfulLinks">
      <button class="linkButton" onclick="changeHTML('helpfulLinks')">URI Parking Links</button>
  </div>
`;

window.HELPFUL_LINKS_HTML = `
  <div id="logo"></div>
  <div id="title">
  	<p>Helpful Links</p>
    <div id="links">
    	<a href="http://web.uri.edu/parking/"><button class="links">Parking Services</button></a>
        <br>
    	<a href="http://bus.apps.uri.edu"><button class="links">URI Bus Tracker</button></a>
        <br>
    	<a href="https://www.buymypermit.com/uri/"><button class="links">Purchase URI Permit</button></a>
        <br>
    	<a href="https://www.uri.edu"><button class="links">URI Homepage</button></a>
        <br>
    	<a href="https://github.com/theonlyklas/rhody-parking-watch"><button class="links">Github</button></a>
        <br>
      <button class="links" onclick="testPHP('testPHP')">Test PHP</button>
        <br>
    </div>
  </div>

  <div id="goBack">
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
  <div id="goBack">
    <button class="goBack" onclick="goBack()">Go Back</button>
  </div>
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
<p> Lot Title     # Spots:  </p>

<div id="goBack">
<button class="goBack" onclick="goBack()">Go Back</button>
</div>

`;

//Will show a list of destinations to choose from
//Once clicked, they will be linked to google maps
//Still working on passing a location into maps from the click
window.FIND_CLOSEST_HTML = `
  <div id="logo"></div>

  <table style="width:75%">
      <tr>
        <th>Destinations</th>
      </tr>
      <tr>
        <td> <button onclick="saveDestination('balentine')">Balentine Hall</button></td>
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
        <td> <button onclick="saveDestination('TylerHall')">Tyler Hall</button></td>
      </tr>
  </table>

  <button class="userButtons" onclick="changeHTML('afterFindingLot')">GO</button>

  <div id="goBack">
  <button class="goBack" onclick="goBack()">Go Back</button>
  </div>
`;


window.AFTER_FINDING_LOT_HTML = `
  <div id="logo"></div>

  <div id="title">
    <p>Closest Parking Lot</p>
    <br>
    <button class="userButtons" onclick="location.href='http://google.com';">Open in Google Maps</button>
    <br>
    <div id="goBack">
    	<button class="goBack" onclick="goBack()">Go Back</button>
    </div>
  </div>

`;

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
