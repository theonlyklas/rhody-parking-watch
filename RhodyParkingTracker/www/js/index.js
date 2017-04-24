//Trying to fix .gitignore stuff

/* GLOBAL VARIABLES HERE */
window.CURRENT_VIEW = "userSelectionMenu";
window.PREVIOUS_VIEW = "";
window.USER_CLASS;

window.onunload = function() {
  /* GLOBAL VARIABLES */
  delete window.CURRENT_VIEW;
  delete window.PREVIOUS_VIEW;
  delete window.USER_CLASS;

  /* WINDOW HTMLS */
  delete window.DEFAULT_CORDOVA_HTML;
  delete window.USER_SELECTION_MENU_HTML;
  delete window.HELPFUL_LINKS_HTML;
  delete window.AFTER_USER_TYPE_HTML;
  delete window.VIEW_MY_LOTS_HTML;
  delete window.FIND_CLOSEST_HTML;
  delete window.AFTER_FINDING_LOT_HTML;
}


function changeHTML(button, user) {
  window.PREVIOUS_VIEW = window.CURRENT_VIEW;

  /* rewrites the html inside the appWrapper according to the argument passed in */
  if (button === "TEST") {
    var htmlReplacement = window.DEFAULT_CORDOVA_HTML;
  } else if (button == "helpfulLinks") {
    var htmlReplacement = window.HELPFUL_LINKS_HTML;
  } else if (button == "afterUserType") {
    var htmlReplacement = window.AFTER_USER_TYPE_HTML;
  } else if (button == "viewMyLots") {
    var htmlReplacement = window.VIEW_MY_LOTS_HTML;
  } else if (button == "findClosest") {
    var htmlReplacement = window.FIND_CLOSEST_HTML;
  } else if (button == "afterFindingLot") {
    var htmlReplacement = window.AFTER_FINDING_LOT_HTML;
  } else if (button == "userSelectionMenu") {
    var htmlReplacement = window.USER_SELECTION_MENU_HTML;
  }

  window.CURRENT_VIEW = button;
  document.getElementById("appWrapper").innerHTML = htmlReplacement;
}


function defineUser(button, user) {
  window.PREVIOUS_VIEW = window.CURRENT_VIEW;
  window.CURRENT_VIEW = button;

  window.USER_CLASS = user;
  var htmlReplacement = window.AFTER_USER_TYPE_HTML;
  document.getElementById("appWrapper").innerHTML = htmlReplacement;
}


function testPHP(button) {
  /* create xhttprequest object and initialize  variables */
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


function goBack() {
  if (window.PREVIOUS_VIEW == "userSelectionMenu") {
    window.USER_CLASS = "";
  }

  changeHTML(window.PREVIOUS_VIEW);
}

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
  <button class="links" onclick="testPHP("testPHP")">Test PHP</button>
    <br>
  </div>

  <div id="goBack">
  <button class="goBack" onclick="goBack()">Go Back</button>
  </div>

`;

window.AFTER_USER_TYPE_HTML = `
  <div id="logo"></div>
  <button class="userButtons" onclick="changeHTML('viewMyLots')">View My Lots</button>
  <button class="userButtons" onclick="changeHTML('findClosest')">Find Closest Lot</button>
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
  <div class="table"></div>

<table style="width:75%">
  <tr>
    <th>Destinations</th>

<tr>
    <td><a href="https://www.google.com/maps">Ballentine Hall</a></td>

      </tr>
  <tr>
  <td><a href="https://www.google.com/maps">CBLS Hall</a></td>
  </tr>
  <td><a href="https://www.google.com/maps">Library</a></td>
  <tr>
  <td> <a href="https://www.google.com/maps">Memorial Union</a></td>
  </tr>
  <td> <a href="https://www.google.com/maps">Tyler Hall</a></td>
</table>

<div id="goBack">
<button class="goBack" onclick="goBack()">Go Back</button>
</div>

`;

window.AFTER_FINDING_LOT_HTML = `
  <div id="logo"></div>

  <div id="goBack">
  <button class="goBack" onclick="goBack()">Go Back</button>
  </div>
`;

/* CORDOVA STUFF */

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
