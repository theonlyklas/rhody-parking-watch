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

function changeHTML(divID) {

	if (divID === "TEST") {
	  var htmlReplacement = window.DEFAULT_CORDOVA_HTML; }
	else if (divID === "helpfulLinks") {
    var htmlReplacement = window.HELPFUL_LINKS;}
	else if (divID === "afterUserType") {
    var htmlReplacement = window.AFTER_USER_TYPE;}
	else if (divID === "viewMyLots") {
    var htmlReplacement = window.VIEW_MY_LOTS;}
	else if (divID === "findClosest") {
    var htmlReplacement = window.FIND_CLOSEST;}
	else if (divID === "afterFindingLot") {
    var htmlReplacement = window.AFTER_FINDING_LOT;}
	
	document.getElementById("appWrapper").innerHTML = htmlReplacement;

  }

window.onunload() {
    delete window.DEFAULT_CORDOVA_HTML;
    delete window.USER_SELECTION_MENU;
}

window.DEFAULT_CORDOVA_HTML = `
    <div class="app">
        <h1>Apache Cordova</h1>
        <div id="deviceready" class="blink">
            <p class="event listening">Connecting to Device</p>
            <p class="event received">Device is Ready</p>
        </div>
    </div>
`

window.HELPFUL_LINKS = `
  <div id="logo"></div>
  <div id="title">
	<p>Helpful Links</p>
  <div id="links">
	<a href="http://web.uri.edu/parking/"><button class="links">Parking Services</button></a>
    <p> </p>
	<a href="http://bus.apps.uri.edu"><button class="links">URI Bus Tracker</button></a>
    <p> </p>
	<a href="https://www.buymypermit.com/uri/"><button class="links">Purchase URI Permit</button></a>
    <p> </p>
	<a href="https://www.uri.edu"><button class="links">URI Homepage</button></a>
    <p> </p>
	<a href="https://github.com/theonlyklas/rhody-parking-watch"><button class="links">Github</button></a>
    <p> </p>
  </div>
`

window.AFTER_USER_TYPE = `
  <div id="logo"></div>
`

window.VIEW_MY_LOTS = `
  <div id="logo"></div>
`

window.FIND_CLOSEST = `
  <div id="logo"></div>
`

window.AFTER_FINDING_LOT = `
  <div id="logo"></div>
`

window.USER_SELECTION_MENU = `
    <div id="logo"></div>
    <div id="title">
        <p>I am a...</p>
    </div>
    <div id="userSelect">
        <button class="userButtons" onclick="changeHTML('TEST')">Visitor</button>
        <button class="userButtons" onclick="changeHTML('TEST')">Commuter</button>
        <button class="userButtons" onclick="changeHTML('TEST')">Faculty Member</button>
    </div>
    <div id="helpfulLinks">
        <button class="linkButton" onclick="changeHTML('TEST')">URI Parking Links</button>
    </div>
`
