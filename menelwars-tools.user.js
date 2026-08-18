// ==UserScript==
// @name         MenelWars Tools
// @namespace    menelwars.tools
// @version      0.20.0
// @author       RoQ
// @description  Optymalizator receptur i dodatkowe narzędzia do MenelWars.
// @match        https://menelwars.pl/*
// @match        https://www.menelwars.pl/*
// @grant        GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// @grant        GM_getResourceURL
// @resource     MAP_IMAGE https://raw.githubusercontent.com/RoQ665/Menelwars-Tools/main/mapa-warszawa.png
// @connect      script.google.com
// @connect      script.googleusercontent.com
// @run-at       document-start
// @updateURL    https://raw.githubusercontent.com/RoQ665/Menelwars-Tools/main/menelwars-tools.user.js
// @downloadURL  https://raw.githubusercontent.com/RoQ665/Menelwars-Tools/main/menelwars-tools.user.js
// ==/UserScript==

(function() {
  'use strict';

  const BACKEND_URL = "https://script.google.com/macros/s/AKfycby8rjCO9HuRtQvQvFoF-OkjFhfnfcS1bTIag0V9LCSJykW6c8k5IZVH8K3pSVFH66ZBKQ/exec";

  const BASES = ["Ziemniak irga", "Ziemniak vinieta", "Jabłko", "Obierki jabłek", "Obierki ziemniaków", "Cukier", "Turbo Zacier"];
  const YEASTS = ["Instant", "Babuni", "Klasyczne", "Piekarskie", "Turbo", "Winiarskie"];
  const WATERS = ["Kranówa", "Górski strumyk", "Menel zdrój"];
  const PROGRAMS = [1,2,3,4,5];

  const PREMIUM = {
    baza: ["Jabłko", "Obierki jabłek", "Obierki ziemniaków", "Turbo Zacier"],
    drozdze: ["Turbo", "Winiarskie"]
  };

  const KNOWN = {"Ziemniak irga|Instant|Kranówa|1":1.71,"Ziemniak irga|Instant|Kranówa|2":1.55,"Ziemniak irga|Instant|Kranówa|3":1.46,"Ziemniak irga|Instant|Kranówa|4":1.73,"Ziemniak irga|Instant|Kranówa|5":1.43,"Ziemniak irga|Instant|Górski strumyk|1":1.84,"Ziemniak irga|Instant|Górski strumyk|2":1.73,"Ziemniak irga|Instant|Górski strumyk|3":0.94,"Ziemniak irga|Instant|Górski strumyk|4":1.73,"Ziemniak irga|Instant|Górski strumyk|5":1.25,"Ziemniak irga|Instant|Menel zdrój|1":1.32,"Ziemniak irga|Instant|Menel zdrój|2":2,"Ziemniak irga|Instant|Menel zdrój|3":1.35,"Ziemniak irga|Instant|Menel zdrój|4":1.61,"Ziemniak irga|Babuni|Kranówa|1":2.32,"Ziemniak irga|Babuni|Kranówa|2":1.35,"Ziemniak irga|Babuni|Kranówa|3":2.07,"Ziemniak irga|Babuni|Kranówa|4":1.67,"Ziemniak irga|Babuni|Kranówa|5":1.62,"Ziemniak irga|Babuni|Górski strumyk|1":2.49,"Ziemniak irga|Babuni|Górski strumyk|2":1.5,"Ziemniak irga|Babuni|Górski strumyk|3":1.34,"Ziemniak irga|Babuni|Górski strumyk|4":1.67,"Ziemniak irga|Babuni|Górski strumyk|5":1.42,"Ziemniak irga|Babuni|Menel zdrój|1":1.79,"Ziemniak irga|Babuni|Menel zdrój|2":1.75,"Ziemniak irga|Babuni|Menel zdrój|3":1.91,"Ziemniak irga|Babuni|Menel zdrój|4":1.55,"Ziemniak irga|Babuni|Menel zdrój|5":1.84,"Ziemniak irga|Klasyczne|Kranówa|1":1.86,"Ziemniak irga|Klasyczne|Kranówa|2":1.8,"Ziemniak irga|Klasyczne|Kranówa|3":2.13,"Ziemniak irga|Klasyczne|Kranówa|4":1.46,"Ziemniak irga|Klasyczne|Kranówa|5":1.8,"Ziemniak irga|Klasyczne|Górski strumyk|1":2,"Ziemniak irga|Klasyczne|Górski strumyk|2":2,"Ziemniak irga|Klasyczne|Górski strumyk|3":1.38,"Ziemniak irga|Klasyczne|Górski strumyk|4":1.46,"Ziemniak irga|Klasyczne|Górski strumyk|5":1.59,"Ziemniak irga|Klasyczne|Menel zdrój|1":1.44,"Ziemniak irga|Klasyczne|Menel zdrój|2":2.32,"Ziemniak irga|Klasyczne|Menel zdrój|3":1.97,"Ziemniak irga|Klasyczne|Menel zdrój|4":1.36,"Ziemniak irga|Klasyczne|Menel zdrój|5":2.06,"Ziemniak irga|Piekarskie|Kranówa|1":1.86,"Ziemniak irga|Piekarskie|Kranówa|2":1.54,"Ziemniak irga|Piekarskie|Kranówa|3":1.97,"Ziemniak irga|Piekarskie|Kranówa|4":1.75,"Ziemniak irga|Piekarskie|Kranówa|5":1.44,"Ziemniak irga|Piekarskie|Górski strumyk|1":2,"Ziemniak irga|Piekarskie|Górski strumyk|2":1.71,"Ziemniak irga|Piekarskie|Górski strumyk|3":1.28,"Ziemniak irga|Piekarskie|Górski strumyk|4":1.75,"Ziemniak irga|Piekarskie|Górski strumyk|5":1.27,"Ziemniak irga|Piekarskie|Menel zdrój|1":1.44,"Ziemniak irga|Piekarskie|Menel zdrój|2":1.99,"Ziemniak irga|Piekarskie|Menel zdrój|3":1.82,"Ziemniak irga|Piekarskie|Menel zdrój|4":1.62,"Ziemniak irga|Piekarskie|Menel zdrój|5":1.64,"Ziemniak irga|Turbo|Kranówa|1":3.38,"Ziemniak irga|Turbo|Kranówa|2":2.48,"Ziemniak irga|Turbo|Kranówa|3":3.13,"Ziemniak irga|Turbo|Kranówa|4":3.15,"Ziemniak irga|Turbo|Kranówa|5":2.91,"Ziemniak irga|Turbo|Górski strumyk|1":3.64,"Ziemniak irga|Turbo|Górski strumyk|2":2.76,"Ziemniak irga|Turbo|Górski strumyk|3":2.03,"Ziemniak irga|Turbo|Górski strumyk|4":3.15,"Ziemniak irga|Turbo|Górski strumyk|5":2.56,"Ziemniak irga|Turbo|Menel zdrój|1":2.62,"Ziemniak irga|Turbo|Menel zdrój|2":3.21,"Ziemniak irga|Turbo|Menel zdrój|3":2.89,"Ziemniak irga|Turbo|Menel zdrój|4":2.92,"Ziemniak irga|Turbo|Menel zdrój|5":3.32,"Ziemniak irga|Winiarskie|Kranówa|1":2.15,"Ziemniak irga|Winiarskie|Kranówa|2":1.2,"Ziemniak irga|Winiarskie|Kranówa|3":2.26,"Ziemniak irga|Winiarskie|Kranówa|4":1.89,"Ziemniak irga|Winiarskie|Kranówa|5":1.96,"Ziemniak irga|Winiarskie|Górski strumyk|1":2.31,"Ziemniak irga|Winiarskie|Górski strumyk|2":1.34,"Ziemniak irga|Winiarskie|Górski strumyk|3":1.46,"Ziemniak irga|Winiarskie|Górski strumyk|4":1.89,"Ziemniak irga|Winiarskie|Górski strumyk|5":1.73,"Ziemniak irga|Winiarskie|Menel zdrój|1":1.66,"Ziemniak irga|Winiarskie|Menel zdrój|2":1.55,"Ziemniak irga|Winiarskie|Menel zdrój|3":2.08,"Ziemniak irga|Winiarskie|Menel zdrój|4":1.75,"Ziemniak irga|Winiarskie|Menel zdrój|5":2.24,"Ziemniak vinieta|Instant|Kranówa|1":1.86,"Ziemniak vinieta|Instant|Kranówa|2":1.71,"Ziemniak vinieta|Instant|Kranówa|3":1.34,"Ziemniak vinieta|Instant|Kranówa|4":1.47,"Ziemniak vinieta|Instant|Kranówa|5":1.13,"Ziemniak vinieta|Instant|Górski strumyk|1":2.01,"Ziemniak vinieta|Babuni|Kranówa|1":2.53,"Ziemniak vinieta|Babuni|Kranówa|2":1.49,"Ziemniak vinieta|Babuni|Kranówa|3":1.89,"Ziemniak vinieta|Babuni|Kranówa|4":1.42,"Ziemniak vinieta|Babuni|Kranówa|5":1.28,"Ziemniak vinieta|Babuni|Górski strumyk|1":2.72,"Ziemniak vinieta|Babuni|Górski strumyk|2":1.66,"Ziemniak vinieta|Babuni|Górski strumyk|3":1.23,"Ziemniak vinieta|Babuni|Górski strumyk|4":1.42,"Ziemniak vinieta|Babuni|Górski strumyk|5":1.13,"Ziemniak vinieta|Babuni|Menel zdrój|1":1.96,"Ziemniak vinieta|Babuni|Menel zdrój|2":1.93,"Ziemniak vinieta|Babuni|Menel zdrój|3":1.75,"Ziemniak vinieta|Babuni|Menel zdrój|4":1.32,"Ziemniak vinieta|Babuni|Menel zdrój|5":1.46,"Ziemniak vinieta|Klasyczne|Kranówa|1":2.03,"Ziemniak vinieta|Klasyczne|Kranówa|2":1.98,"Ziemniak vinieta|Klasyczne|Górski strumyk|1":2.19,"Ziemniak vinieta|Klasyczne|Górski strumyk|2":2.21,"Ziemniak vinieta|Klasyczne|Górski strumyk|3":1.27,"Ziemniak vinieta|Klasyczne|Górski strumyk|4":1.25,"Ziemniak vinieta|Klasyczne|Górski strumyk|5":1.26,"Ziemniak vinieta|Klasyczne|Menel zdrój|1":1.57,"Ziemniak vinieta|Klasyczne|Menel zdrój|2":2.56,"Ziemniak vinieta|Klasyczne|Menel zdrój|3":1.8,"Ziemniak vinieta|Klasyczne|Menel zdrój|4":1.16,"Ziemniak vinieta|Klasyczne|Menel zdrój|5":1.63,"Ziemniak vinieta|Piekarskie|Kranówa|1":2.03,"Ziemniak vinieta|Piekarskie|Kranówa|4":1.49,"Ziemniak vinieta|Piekarskie|Górski strumyk|1":2.19,"Ziemniak vinieta|Piekarskie|Górski strumyk|2":1.89,"Ziemniak vinieta|Piekarskie|Górski strumyk|3":1.17,"Ziemniak vinieta|Piekarskie|Górski strumyk|5":1.01,"Ziemniak vinieta|Piekarskie|Menel zdrój|1":1.57,"Ziemniak vinieta|Piekarskie|Menel zdrój|2":2.19,"Ziemniak vinieta|Piekarskie|Menel zdrój|3":1.67,"Ziemniak vinieta|Piekarskie|Menel zdrój|4":1.38,"Ziemniak vinieta|Piekarskie|Menel zdrój|5":1.3,"Ziemniak vinieta|Turbo|Kranówa|1":3.69,"Ziemniak vinieta|Turbo|Kranówa|2":2.73,"Ziemniak vinieta|Turbo|Kranówa|3":2.87,"Ziemniak vinieta|Turbo|Kranówa|4":2.68,"Ziemniak vinieta|Turbo|Kranówa|5":2.31,"Ziemniak vinieta|Turbo|Górski strumyk|1":3.98,"Ziemniak vinieta|Turbo|Górski strumyk|2":3.04,"Ziemniak vinieta|Turbo|Górski strumyk|3":1.86,"Ziemniak vinieta|Turbo|Górski strumyk|4":2.68,"Ziemniak vinieta|Turbo|Górski strumyk|5":2.03,"Ziemniak vinieta|Turbo|Menel zdrój|1":2.86,"Ziemniak vinieta|Turbo|Menel zdrój|2":3.53,"Ziemniak vinieta|Turbo|Menel zdrój|3":2.65,"Ziemniak vinieta|Turbo|Menel zdrój|4":2.49,"Ziemniak vinieta|Turbo|Menel zdrój|5":2.64,"Ziemniak vinieta|Winiarskie|Kranówa|1":2.34,"Ziemniak vinieta|Winiarskie|Kranówa|2":1.33,"Ziemniak vinieta|Winiarskie|Kranówa|3":2.07,"Ziemniak vinieta|Winiarskie|Kranówa|4":1.61,"Ziemniak vinieta|Winiarskie|Kranówa|5":1.56,"Ziemniak vinieta|Winiarskie|Górski strumyk|1":2.52,"Ziemniak vinieta|Winiarskie|Górski strumyk|2":1.48,"Ziemniak vinieta|Winiarskie|Górski strumyk|3":1.34,"Ziemniak vinieta|Winiarskie|Górski strumyk|4":1.61,"Ziemniak vinieta|Winiarskie|Górski strumyk|5":1.37,"Ziemniak vinieta|Winiarskie|Menel zdrój|1":1.82,"Ziemniak vinieta|Winiarskie|Menel zdrój|3":1.91,"Ziemniak vinieta|Winiarskie|Menel zdrój|4":1.49,"Ziemniak vinieta|Winiarskie|Menel zdrój|5":1.78,"Jabłko|Instant|Kranówa|1":1.51,"Jabłko|Instant|Kranówa|2":1.23,"Jabłko|Instant|Kranówa|3":1.25,"Jabłko|Instant|Kranówa|4":1.52,"Jabłko|Instant|Kranówa|5":1,"Jabłko|Instant|Górski strumyk|1":1.63,"Jabłko|Instant|Górski strumyk|2":1.37,"Jabłko|Instant|Górski strumyk|3":0.81,"Jabłko|Instant|Górski strumyk|4":1.52,"Jabłko|Instant|Górski strumyk|5":0.88,"Jabłko|Instant|Menel zdrój|1":1.17,"Jabłko|Babuni|Kranówa|1":2.05,"Jabłko|Babuni|Kranówa|2":1.07,"Jabłko|Babuni|Kranówa|3":1.78,"Jabłko|Babuni|Kranówa|4":1.46,"Jabłko|Babuni|Kranówa|5":1.13,"Jabłko|Babuni|Menel zdrój|1":1.59,"Jabłko|Klasyczne|Kranówa|1":1.65,"Jabłko|Klasyczne|Kranówa|2":1.43,"Jabłko|Klasyczne|Kranówa|3":1.83,"Jabłko|Klasyczne|Kranówa|4":1.28,"Jabłko|Klasyczne|Kranówa|5":1.26,"Jabłko|Piekarskie|Kranówa|1":1.65,"Jabłko|Piekarskie|Kranówa|2":1.22,"Jabłko|Piekarskie|Kranówa|3":1.7,"Jabłko|Piekarskie|Kranówa|4":1.53,"Jabłko|Piekarskie|Kranówa|5":1.01,"Jabłko|Piekarskie|Górski strumyk|5":0.88,"Jabłko|Piekarskie|Menel zdrój|5":1.15,"Jabłko|Turbo|Kranówa|1":2.99,"Jabłko|Turbo|Kranówa|2":1.97,"Jabłko|Turbo|Kranówa|3":2.7,"Jabłko|Turbo|Kranówa|4":2.76,"Jabłko|Turbo|Kranówa|5":2.03,"Jabłko|Turbo|Górski strumyk|1":3.22,"Jabłko|Turbo|Górski strumyk|2":2.19,"Jabłko|Turbo|Górski strumyk|3":1.75,"Jabłko|Turbo|Górski strumyk|4":2.76,"Jabłko|Turbo|Górski strumyk|5":1.79,"Jabłko|Turbo|Menel zdrój|1":2.32,"Jabłko|Turbo|Menel zdrój|2":2.55,"Jabłko|Turbo|Menel zdrój|3":2.49,"Jabłko|Turbo|Menel zdrój|4":2.55,"Jabłko|Turbo|Menel zdrój|5":2.32,"Jabłko|Winiarskie|Kranówa|1":1.9,"Jabłko|Winiarskie|Kranówa|2":0.96,"Jabłko|Winiarskie|Kranówa|3":1.94,"Jabłko|Winiarskie|Kranówa|4":1.65,"Jabłko|Winiarskie|Kranówa|5":1.37,"Jabłko|Winiarskie|Górski strumyk|1":2.05,"Jabłko|Winiarskie|Górski strumyk|2":1.06,"Jabłko|Winiarskie|Menel zdrój|1":1.47,"Jabłko|Winiarskie|Menel zdrój|2":1.24,"Jabłko|Winiarskie|Menel zdrój|3":1.79,"Jabłko|Winiarskie|Menel zdrój|4":1.53,"Jabłko|Winiarskie|Menel zdrój|5":1.56,"Obierki jabłek|Instant|Kranówa|1":1.58,"Obierki jabłek|Instant|Kranówa|2":1.3,"Obierki jabłek|Instant|Kranówa|3":1.32,"Obierki jabłek|Instant|Kranówa|4":1.52,"Obierki jabłek|Instant|Kranówa|5":1.51,"Obierki jabłek|Instant|Górski strumyk|1":1.7,"Obierki jabłek|Instant|Górski strumyk|2":1.45,"Obierki jabłek|Instant|Górski strumyk|3":0.86,"Obierki jabłek|Instant|Górski strumyk|4":1.52,"Obierki jabłek|Instant|Menel zdrój|1":1.22,"Obierki jabłek|Instant|Menel zdrój|2":1.68,"Obierki jabłek|Instant|Menel zdrój|3":1.22,"Obierki jabłek|Instant|Menel zdrój|4":1.4,"Obierki jabłek|Instant|Menel zdrój|5":1.72,"Obierki jabłek|Babuni|Kranówa|1":2.14,"Obierki jabłek|Babuni|Kranówa|2":1.13,"Obierki jabłek|Babuni|Kranówa|3":1.88,"Obierki jabłek|Babuni|Kranówa|4":1.46,"Obierki jabłek|Babuni|Kranówa|5":1.71,"Obierki jabłek|Babuni|Menel zdrój|1":1.66,"Obierki jabłek|Babuni|Menel zdrój|2":1.46,"Obierki jabłek|Turbo|Kranówa|1":3.12,"Obierki jabłek|Turbo|Kranówa|2":2.08,"Obierki jabłek|Turbo|Kranówa|3":2.76,"Obierki jabłek|Turbo|Kranówa|4":2.76,"Obierki jabłek|Turbo|Kranówa|5":3.08,"Obierki jabłek|Turbo|Górski strumyk|1":3.36,"Obierki jabłek|Turbo|Górski strumyk|2":2.31,"Obierki jabłek|Turbo|Górski strumyk|3":1.84,"Obierki jabłek|Turbo|Górski strumyk|4":2.76,"Obierki jabłek|Turbo|Górski strumyk|5":2.71,"Obierki jabłek|Turbo|Menel zdrój|1":2.41,"Obierki jabłek|Turbo|Menel zdrój|2":2.69,"Obierki jabłek|Turbo|Menel zdrój|3":2.63,"Obierki jabłek|Turbo|Menel zdrój|4":2.55,"Obierki jabłek|Turbo|Menel zdrój|5":3.51,"Obierki jabłek|Winiarskie|Kranówa|1":1.98,"Obierki jabłek|Winiarskie|Kranówa|2":1.01,"Obierki jabłek|Winiarskie|Kranówa|3":2.03,"Obierki jabłek|Winiarskie|Kranówa|4":1.65,"Obierki jabłek|Winiarskie|Kranówa|5":2.08,"Obierki jabłek|Winiarskie|Górski strumyk|1":2.14,"Obierki jabłek|Winiarskie|Górski strumyk|2":1.12,"Obierki jabłek|Winiarskie|Górski strumyk|3":1.33,"Obierki jabłek|Winiarskie|Górski strumyk|5":1.83,"Obierki jabłek|Winiarskie|Menel zdrój|1":1.54,"Obierki jabłek|Winiarskie|Menel zdrój|2":1.3,"Obierki jabłek|Winiarskie|Menel zdrój|3":1.89,"Obierki jabłek|Winiarskie|Menel zdrój|4":1.53,"Obierki jabłek|Winiarskie|Menel zdrój|5":2.37,"Obierki ziemniaków|Instant|Kranówa|1":1.37,"Obierki ziemniaków|Instant|Kranówa|2":1.72,"Obierki ziemniaków|Instant|Kranówa|3":1.94,"Obierki ziemniaków|Instant|Kranówa|4":1.42,"Obierki ziemniaków|Instant|Kranówa|5":1.37,"Obierki ziemniaków|Instant|Górski strumyk|1":1.47,"Obierki ziemniaków|Instant|Menel zdrój|1":1.06,"Obierki ziemniaków|Instant|Menel zdrój|2":2.23,"Obierki ziemniaków|Instant|Menel zdrój|3":1.79,"Obierki ziemniaków|Instant|Menel zdrój|4":1.32,"Obierki ziemniaków|Instant|Menel zdrój|5":1.57,"Obierki ziemniaków|Babuni|Kranówa|1":1.86,"Obierki ziemniaków|Babuni|Kranówa|2":1.5,"Obierki ziemniaków|Babuni|Kranówa|5":1.56,"Obierki ziemniaków|Babuni|Menel zdrój|1":1.44,"Obierki ziemniaków|Babuni|Menel zdrój|2":1.94,"Obierki ziemniaków|Babuni|Menel zdrój|3":2.55,"Obierki ziemniaków|Babuni|Menel zdrój|4":1.27,"Obierki ziemniaków|Babuni|Menel zdrój|5":1.77,"Obierki ziemniaków|Klasyczne|Górski strumyk|1":1.61,"Obierki ziemniaków|Klasyczne|Górski strumyk|2":2.22,"Obierki ziemniaków|Klasyczne|Górski strumyk|3":1.84,"Obierki ziemniaków|Klasyczne|Górski strumyk|4":1.2,"Obierki ziemniaków|Klasyczne|Menel zdrój|1":1.16,"Obierki ziemniaków|Klasyczne|Menel zdrój|2":2.58,"Obierki ziemniaków|Klasyczne|Menel zdrój|3":2.62,"Obierki ziemniaków|Klasyczne|Menel zdrój|4":1.11,"Obierki ziemniaków|Klasyczne|Menel zdrój|5":1.98,"Obierki ziemniaków|Piekarskie|Kranówa|1":1.49,"Obierki ziemniaków|Piekarskie|Kranówa|2":1.71,"Obierki ziemniaków|Piekarskie|Kranówa|3":2.63,"Obierki ziemniaków|Piekarskie|Górski strumyk|1":1.61,"Obierki ziemniaków|Piekarskie|Górski strumyk|2":1.9,"Obierki ziemniaków|Piekarskie|Górski strumyk|3":1.71,"Obierki ziemniaków|Piekarskie|Górski strumyk|4":1.43,"Obierki ziemniaków|Piekarskie|Górski strumyk|5":1.22,"Obierki ziemniaków|Piekarskie|Menel zdrój|1":1.16,"Obierki ziemniaków|Piekarskie|Menel zdrój|2":2.21,"Obierki ziemniaków|Piekarskie|Menel zdrój|3":2.43,"Obierki ziemniaków|Piekarskie|Menel zdrój|4":1.33,"Obierki ziemniaków|Piekarskie|Menel zdrój|5":1.58,"Obierki ziemniaków|Turbo|Kranówa|1":2.71,"Obierki ziemniaków|Turbo|Kranówa|2":2.76,"Obierki ziemniaków|Turbo|Kranówa|3":4.18,"Obierki ziemniaków|Turbo|Kranówa|4":2.58,"Obierki ziemniaków|Turbo|Kranówa|5":2.8,"Obierki ziemniaków|Turbo|Górski strumyk|1":2.92,"Obierki ziemniaków|Turbo|Górski strumyk|2":3.07,"Obierki ziemniaków|Turbo|Górski strumyk|3":2.71,"Obierki ziemniaków|Turbo|Górski strumyk|4":2.58,"Obierki ziemniaków|Turbo|Górski strumyk|5":2.46,"Obierki ziemniaków|Turbo|Menel zdrój|1":2.1,"Obierki ziemniaków|Turbo|Menel zdrój|2":3.56,"Obierki ziemniaków|Turbo|Menel zdrój|3":3.86,"Obierki ziemniaków|Turbo|Menel zdrój|4":2.39,"Obierki ziemniaków|Turbo|Menel zdrój|5":3.2,"Obierki ziemniaków|Winiarskie|Kranówa|1":1.72,"Obierki ziemniaków|Winiarskie|Kranówa|2":1.34,"Obierki ziemniaków|Winiarskie|Kranówa|3":3.01,"Obierki ziemniaków|Winiarskie|Kranówa|4":1.55,"Obierki ziemniaków|Winiarskie|Kranówa|5":1.89,"Obierki ziemniaków|Winiarskie|Górski strumyk|1":1.85,"Obierki ziemniaków|Winiarskie|Górski strumyk|2":1.49,"Obierki ziemniaków|Winiarskie|Górski strumyk|3":1.95,"Obierki ziemniaków|Winiarskie|Górski strumyk|4":1.55,"Obierki ziemniaków|Winiarskie|Górski strumyk|5":1.66,"Obierki ziemniaków|Winiarskie|Menel zdrój|1":1.33,"Obierki ziemniaków|Winiarskie|Menel zdrój|2":1.73,"Obierki ziemniaków|Winiarskie|Menel zdrój|3":2.78,"Obierki ziemniaków|Winiarskie|Menel zdrój|4":1.44,"Obierki ziemniaków|Winiarskie|Menel zdrój|5":2.16,"Cukier|Babuni|Menel zdrój|1":1.79,"Cukier|Klasyczne|Kranówa|4":1.36,"Cukier|Piekarskie|Kranówa|1":1.86,"Cukier|Piekarskie|Kranówa|2":1.24,"Cukier|Piekarskie|Górski strumyk|5":0.92,"Cukier|Turbo|Kranówa|1":3.38,"Cukier|Turbo|Kranówa|2":1.99,"Cukier|Turbo|Kranówa|3":3.36,"Cukier|Turbo|Kranówa|4":2.93,"Cukier|Turbo|Kranówa|5":2.12,"Cukier|Turbo|Górski strumyk|1":3.64,"Cukier|Turbo|Górski strumyk|2":1.39,"Cukier|Turbo|Górski strumyk|3":2.18,"Cukier|Turbo|Górski strumyk|4":2.93,"Cukier|Turbo|Górski strumyk|5":1.86,"Cukier|Turbo|Menel zdrój|1":2.63,"Cukier|Turbo|Menel zdrój|2":2.58,"Cukier|Turbo|Menel zdrój|3":2.18,"Cukier|Turbo|Menel zdrój|4":3.11,"Cukier|Turbo|Menel zdrój|5":2.42,"Cukier|Winiarskie|Kranówa|1":2.15,"Cukier|Winiarskie|Kranówa|2":0.97,"Cukier|Winiarskie|Kranówa|3":2.42,"Cukier|Winiarskie|Kranówa|4":1.76,"Cukier|Winiarskie|Kranówa|5":1.43,"Cukier|Winiarskie|Górski strumyk|1":2.31,"Cukier|Winiarskie|Górski strumyk|2":1.08,"Cukier|Winiarskie|Górski strumyk|3":1.57,"Cukier|Winiarskie|Górski strumyk|4":1.76,"Cukier|Winiarskie|Górski strumyk|5":1.26,"Cukier|Winiarskie|Menel zdrój|1":1.66,"Cukier|Winiarskie|Menel zdrój|2":1.25,"Cukier|Winiarskie|Menel zdrój|3":2.24,"Cukier|Winiarskie|Menel zdrój|4":1.63,"Cukier|Winiarskie|Menel zdrój|5":1.63,"Turbo Zacier|Babuni|Górski strumyk|1":3.81,"Turbo Zacier|Turbo|Kranówa|1":5.16,"Turbo Zacier|Turbo|Kranówa|2":4.24,"Turbo Zacier|Turbo|Kranówa|3":5.8,"Turbo Zacier|Turbo|Kranówa|4":4.92,"Turbo Zacier|Turbo|Kranówa|5":4.28,"Turbo Zacier|Turbo|Górski strumyk|1":5.56,"Turbo Zacier|Turbo|Górski strumyk|2":4.72,"Turbo Zacier|Turbo|Górski strumyk|3":3.76,"Turbo Zacier|Turbo|Górski strumyk|4":4.92,"Turbo Zacier|Turbo|Górski strumyk|5":3.76,"Turbo Zacier|Turbo|Menel zdrój|1":4,"Turbo Zacier|Turbo|Menel zdrój|2":5.48,"Turbo Zacier|Turbo|Menel zdrój|3":5.36,"Turbo Zacier|Winiarskie|Górski strumyk|1":3.53};

  const MAP = [
    ["Wilanów", "Agresywny", "⚔️"],
    ["Mokotów", "Przyjacielski", "🤝"],
    ["Ursynów", "Błagalny", "🙏"],
    ["Ochota", "Neutralny", "⚪"],
    ["Śródmieście", "Przyjacielski", "🤝"],
    ["Bemowo", "Przyjacielski", "🤝"],
    ["Wola", "Błagalny", "🙏"],
    ["Żoliborz", "Neutralny", "⚪"],
    ["Bielany", "Błagalny", "🙏"],
    ["Praga", "Błagalny", "🙏"],
    ["Białołęka", "Neutralny", "⚪"],
    ["Targówek", "Błagalny", "🙏"]
  ];

  const MAP_POSITIONS = {
    "Bielany":      { x: 28.7, y: 12.2 },
    "Białołęka":    { x: 62.0, y: 16.7 },
    "Żoliborz":     { x: 19.2, y: 29.8 },
    "Targówek":     { x: 81.7, y: 33.6 },
    "Bemowo":       { x: 13.5, y: 47.7 },
    "Śródmieście":  { x: 46.8, y: 48.9 },
    "Praga":        { x: 86.1, y: 55.2 },
    "Wola":         { x: 22.0, y: 61.4 },
    "Ochota":       { x: 20.2, y: 75.9 },
    "Mokotów":      { x: 50.8, y: 73.3 },
    "Wilanów":      { x: 77.9, y: 80.9 },
    "Ursynów":      { x: 39.6, y: 92.4 }
  };

  const MAP_IMAGE_URL = GM_getResourceURL("MAP_IMAGE");

const DISPLAY_NAMES = {
  "Ziemniak irga": 'Ziemniaki "Irga"',
  "Ziemniak vinieta": 'Ziemniaki "Vineta"',
  "Obierki jabłek": "Obierki po jabłkach",
  "Obierki ziemniaków": "Obierki po ziemniakach",
  "Cukier": 'Cukier "Klasyczny"',

  "Instant": 'Drożdże "Instant"',
  "Babuni": "Drożdże Babuni",
  "Klasyczne": "Drożdże klasyczne",
  "Piekarskie": "Drożdże piekarskie",
  "Turbo": "Turbo drożdże",
  "Winiarskie": "Drożdże winiarskie",

  "Górski strumyk": 'Woda "Górski strumyk"',
  "Menel zdrój": 'Woda "Menel Zdrój"'
};

function displayName(name) {
  return DISPLAY_NAMES[name] || name;
}

  const PREMIUM_KEY = "roq_tools_premium_v1";
  const REMOTE_KEY = "roq_tools_remote_approved_v1";
  const NICK_KEY = "roq_tools_submitter_nick_v1";
const RESERVATION_OWNER_KEY = "roq_recipe_reservation_owners_v1";
const COMPANY_SALARY_IDENTITY_KEY = "menelwars_company_salary_identity_v1";
const PLAYER_IDENTITY_KEY = "menelwars_player_identity_v1";
  const GANG_TOKEN_KEY = "menelwars_tools_gang_token_v1";
  const ADMIN_TOKEN_KEY = "menelwars_tools_admin_token_v1";
  const BAR_COLLAPSED_KEY = "menelwars_tools_bar_collapsed_v1";
  const COMPANY_INCOME_KEY = "menelwars_tools_company_income_v1";

  const COMPANY_MIN_CONTRIBUTION = 30000;
  const COMPANY_BASE_SALARY = 160;
  const COMPANY_SALARY_RATIO = 0.50;

  let premiumState = {};
  let remoteApproved = {};
  let recipeReservations = {};
  let recipeRanking = [];

  try { premiumState = JSON.parse(localStorage.getItem(PREMIUM_KEY)) || {}; } catch {}
  try { remoteApproved = JSON.parse(localStorage.getItem(REMOTE_KEY)) || {}; } catch {}

  const key = (b,y,w,p) => `${b}|${y}|${w}|${p}`;

  function backendConfigured() {
    return /^https:\/\/script\.google\.com\/macros\/s\/.+\/exec$/.test(BACKEND_URL);
  }

  function esc(v) {
    return String(v)
      .replaceAll("&","&amp;")
      .replaceAll("<","&lt;")
      .replaceAll(">","&gt;")
      .replaceAll('"',"&quot;")
      .replaceAll("'","&#039;");
  }

  function fmt(n) {
    return Number(n).toLocaleString("pl-PL", { maximumFractionDigits: 2 });
  }

  function buildRecipes() {
    const out = [];
    for (const baza of BASES)
      for (const drozdze of YEASTS)
        for (const woda of WATERS)
          for (const program of PROGRAMS) {
            const k = key(baza,drozdze,woda,program);
            let litry = Object.prototype.hasOwnProperty.call(KNOWN,k) ? Number(KNOWN[k]) : null;
            if (Object.prototype.hasOwnProperty.call(remoteApproved,k)) litry = Number(remoteApproved[k]);
            out.push({baza,drozdze,woda,program,litry});
          }
    return out;
  }

  let RECIPES = buildRecipes();

  function isAvailable(r) {
    if (PREMIUM.baza.includes(r.baza) && !premiumState[r.baza]) return false;
    if (PREMIUM.drozdze.includes(r.drozdze) && !premiumState[r.drozdze]) return false;
    return true;
  }

  function trio(r) { return `${r.baza}|${r.drozdze}|${r.woda}`; }

  function maxForTrio(r) {
    let max = null;
    for (const x of RECIPES) {
      if (trio(x) === trio(r) && x.litry !== null) max = max === null ? x.litry : Math.max(max,x.litry);
    }
    return max;
  }

  function threshold(known) {
    if (!known.length) return Infinity;
    const vals = known.map(x=>x.litry).sort((a,b)=>a-b);
    return vals[Math.min(Math.floor(vals.length*.8), vals.length-1)];
  }

  	let host=null;
	let root=null;
	let optPanel=null;
	let mapPanel=null;
	let submitPanel=null;
	let paymentsPanel=null;
	let adminPanel=null;
	let latestGangPayload=null;
	let currentTab="top";
  let adminPaymentsSnapshot = null;

  const CSS = `
    *{box-sizing:border-box}
    #bar{display:flex;gap:7px;align-items:center;padding:7px 8px;background:rgba(28,24,20,.96);
      border:1px solid #8d7657;border-radius:9px;box-shadow:0 4px 18px #0007;font:12px Arial,sans-serif}
    .title{color:#d9c5a4;font-weight:700;padding:0 3px;white-space:nowrap}
        #barToggle{
      border:0;
      background:transparent;
      color:#d9c5a4;
      padding:0 2px;
      margin:0;
      min-width:0;
      font-size:13px;
      line-height:1;
      box-shadow:none;
    }

    #barToggle:hover{
      color:#fff1d6;
    }

    #bar.collapsed > button:not(#barToggle){
      display:none;
    }

    #bar.collapsed{
      gap:4px;
    }
    button{border:1px solid #8d7657;border-radius:6px;background:#dfd0b6;color:#332a20;
      padding:7px 10px;font:700 12px Arial,sans-serif;cursor:pointer}
    .panel{position:fixed;right:10px;top:54px;width:430px;max-height:82vh;overflow:hidden;
      border:1px solid #8d7657;border-radius:13px;background:#f5eddc;color:#332a20;
      box-shadow:0 10px 35px #0007;font:13px Arial,sans-serif}
    .head{display:flex;justify-content:space-between;align-items:center;padding:12px 14px;background:#dfd0b6;font-weight:700}
    .close{cursor:pointer;font-size:19px;padding:0 3px}
    .premium{padding:10px 14px;border-bottom:1px solid #d1c1a7}
    .ptitle{font-weight:700;margin-bottom:7px}
    .checks{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:5px}
    .checks label{display:flex;align-items:center;gap:6px;border:1px solid #d8c7aa;border-radius:7px;padding:6px 7px;background:#fffdf8;cursor:pointer;font-weight:700;font-size:11px}
    .checks label:has(input:checked){background:#edf7ee;border-color:#9ec5a4;color:#315f38}
    .checks input{accent-color:#4f8b59}
    .tabs{display:flex;border-bottom:1px solid #d1c1a7}
    .tab{flex:1;text-align:center;padding:9px 5px;cursor:pointer;font-weight:700;background:#eee3cf}
    .tab.active{background:#fff8eb}
    .body,.mapbody{
  	padding:10px 12px;
  	max-height:68vh;
 	overflow-y:auto;
  	overflow-x:hidden;
  	background:#fff8eb;
	}
    .card{border:1px solid #d8c7aa;border-radius:9px;padding:9px 10px;margin-bottom:8px;background:#fffdf8}
    .rank{font-weight:800} .liters{float:right;font-weight:800;font-size:15px;color:#356a3c}
    .star{color:#9a6500;font-weight:700;margin-top:5px} .muted{color:#766b5e}
    .bar{height:12px;background:#ded3c0;border-radius:8px;overflow:hidden;margin:8px 0 14px}
    .bar>div{height:100%;background:#6d8c55}
    .mapStage{position:relative;width:100%;max-width:390px;margin:0 auto}
    .mapStage img{display:block;width:100%;height:auto;border-radius:8px}
    .mapMarker{position:absolute;transform:translate(-50%,0);z-index:2;padding:2px 5px;border-radius:6px;
      background:rgba(255,248,230,.92);border:1px solid rgba(95,70,40,.55);box-shadow:0 1px 3px #0005;
      font-size:10px;font-weight:700;line-height:1.15;white-space:nowrap;color:#3d3022;pointer-events:none}
    .mapMarker.unknown{background:rgba(255,238,238,.94);border-color:rgba(180,80,80,.65);color:#9a2f2f}
    .mapLegend{margin-top:10px;padding:7px 9px;border-radius:8px;background:#f8f0df;border:1px solid #d8c49f;
      font-size:11px;line-height:1.4;text-align:center}
    .adminWrap{padding:10px 12px;max-height:70vh;overflow-y:auto;background:#fff8eb}
    .adminTabs{display:flex;gap:5px;margin-bottom:9px}
    .adminTabs button{flex:1;padding:7px 4px;font-size:11px}
    .adminTabs button.active{background:#6a5136;color:#fff;border-color:#5b472f}
    .adminBox{border:1px solid #d8c7aa;border-radius:8px;background:#fffdf8;padding:9px;margin-bottom:8px}
    .adminGrid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:6px;margin-bottom:8px}
    .adminGrid .adminBox{margin:0;min-width:0}
    .adminLabel{font-size:11px;color:#766b5e;display:block}
    .adminStatus{min-height:18px;text-align:center;font-weight:700;color:#4f643d;white-space:pre-wrap}
    .adminDanger{background:#fff0f0;border-color:#d9aaaa}
    .adminGood{background:#eaf6ea;border-color:#9fc79f}
    .adminTextarea{width:100%;min-height:150px;resize:vertical;border:1px solid #ccb797;border-radius:7px;
      background:#fffdf8;color:#332a20;padding:8px;font:12px monospace}
    .adminPlayer{display:flex;justify-content:space-between;align-items:center;gap:8px;padding:6px 8px;
      margin-bottom:4px;border:1px solid #d8c7aa;border-radius:7px;background:#fffdf8}
    .adminPlayer strong{overflow-wrap:anywhere}
    .previewDay{margin-top:7px;border:1px solid #bad7ba;border-radius:7px;background:#eef7ee;overflow:hidden}
    .previewDay.out{border-color:#c8c8c8;background:#f3f3f3}
    .previewDay.bad{border-color:#e3b2b2;background:#fff1f1}
    .previewDayHead{width:100%;border:0;border-radius:0;background:transparent;text-align:left;padding:8px}
    .previewDetails{padding:0 8px 8px;font-size:11px}
    .miniRow{display:flex;justify-content:space-between;gap:8px;padding:4px 6px;margin-top:3px;border-radius:5px;background:#fffdf8;border:1px solid #ddd}


.form{
  display:grid;
  gap:8px;
}

.form label{
  display:grid;
  gap:4px;
  font-weight:700;
}

.form input,
.form select,
.form textarea{
  width:100%;
  border:1px solid #ccb797;
  border-radius:7px;
  background:#fffdf8;
  color:#332a20;
  padding:8px 9px;
  font:13px Arial,sans-serif;
}

.form textarea{
  resize:vertical;
}

.submitInfo{
  padding:8px;
  border-radius:7px;
  background:#fff5d5;
  border:1px solid #d6b85f;
}

.submitStatus{
  min-height:20px;
  text-align:center;
  font-weight:700;
  color:#4f643d;
}

.sendBtn{
  width:100%;
  background:#6a5136;
  color:white;
  border-color:#5b472f;
  padding:10px;
}

.sendBtn{
  width:100%;
  background:#6a5136;
  color:white;
  border-color:#5b472f;
  padding:10px;
}

.paymentsWrap{
  padding:10px 12px;
  max-height:68vh;
  overflow-y:auto;
  background:#fff8eb;
}

.paymentsLogin{
  display:grid;
  gap:8px;
}

.paymentsLogin input{
  width:100%;
  border:1px solid #ccb797;
  border-radius:7px;
  background:#fffdf8;
  color:#332a20;
  padding:8px 9px;
  font:13px Arial,sans-serif;
}

.paymentsLogin .sendBtn{
  margin-top:2px;
}

.paymentsStatus{
  min-height:18px;
  text-align:center;
  font-weight:700;
  color:#4f643d;
}

.paymentsTop{
  display:flex;
  justify-content:space-between;
  align-items:center;
  gap:8px;
  margin-bottom:8px;
}

.paymentsMeta{
  line-height:1.35;
}

.paymentsActions{
  display:flex;
  gap:6px;
}

.paymentsActions button{
  padding:6px 8px;
  font-size:11px;
}

.paymentRow{
  display:grid;
  grid-template-columns:minmax(0,1fr) auto auto;
  align-items:center;
  gap:7px;
  padding:4px 7px;
  margin-bottom:3px;
  border:1px solid #d8c7aa;
  border-radius:6px;
  background:#fffdf8;
  font-size:12px;
}

.paymentRow.debt{
  background:#fff1f1;
  border-color:#e3b2b2;
}

.paymentRow.ok{
  background:#eef7ee;
  border-color:#bad7ba;
}

.paymentRow.over{
  background:#eef8f0;
  border-color:#b6d9bd;
}

.paymentNick{
  font-weight:700;
  overflow-wrap:anywhere;
}

.paymentLabel{
  font-weight:700;
  white-space:nowrap;
}

.paymentAmount{
  font-weight:800;
  text-align:right;
  min-width:58px;
}

    .logoutSoft{
      border:1px solid #bfae92!important;
      border-radius:8px!important;
      background:#f3ead9!important;
      color:#5c4933!important;
      font-weight:700!important;
    }


    @media (max-width:600px){
      #optPanel .tabs{
        display:grid!important;
        grid-template-columns:repeat(2,minmax(0,1fr))!important;
        gap:4px!important;
        overflow:visible!important;
      }

      #optPanel .tab{
        min-width:0!important;
        width:auto!important;
      }

      #bar{
        gap:4px;
        padding:5px 6px;
        font-size:10px;
        max-width:calc(100vw - 8px);
      }

      #bar button{
        padding:5px 6px;
        font-size:10px;
      }

      .title{
        font-size:10px;
      }

      .panel{
        left:4px;
        right:4px;
        top:48px;
        width:auto;
        max-height:calc(100vh - 54px);
        border-radius:9px;
        font-size:11px;
      }

      .head{
        padding:8px 9px;
        font-size:12px;
      }

      .premium{
        padding:7px 8px;
      }

      .ptitle{
        margin-bottom:5px;
        font-size:11px;
      }

      .checks{
        grid-template-columns:repeat(2,minmax(0,1fr));
        gap:4px;
        font-size:10px;
      }

      .checks label{
        padding:5px 6px;
        font-size:9.5px;
      }

      .tab{
        padding:6px 3px;
        font-size:9.5px;
        line-height:1.1;
      }

      .body,
      .mapbody,
      .paymentsWrap,
      .adminWrap{
        padding:7px 8px;
        max-height:calc(100vh - 115px);
      }

      .card{
        padding:6px 7px;
        margin-bottom:5px;
        border-radius:7px;
        font-size:10.5px;
      }

      .muted{
        font-size:9.5px;
      }

      .liters{
        font-size:12px;
      }

      .adminTabs{
        gap:3px;
        flex-wrap:wrap;
      }

      .adminTabs button{
        flex:1 1 30%;
        padding:5px 3px;
        font-size:9px;
      }

      .adminBox{
        padding:7px;
        margin-bottom:6px;
      }

      .adminGrid{
        gap:4px;
      }

      .form{
        gap:6px;
      }

      .form input,
      .form select,
      .form textarea,
      .paymentsLogin input{
        padding:6px 7px;
        font-size:11px;
      }

      .sendBtn{
        padding:7px;
        font-size:10.5px;
      }

      .paymentsTop{
        gap:5px;
        margin-bottom:6px;
      }

      .paymentsActions{
        gap:4px;
      }

      .paymentsActions button{
        padding:5px 6px;
        font-size:9.5px;
      }

      .bar{
        height:9px;
        margin:6px 0 10px;
      }
    }

  `;

  function mount() {
    if (!document.documentElement) return false;
    if (host && document.documentElement.contains(host)) return true;
    host = document.createElement("div");
    host.id = "roq-tools-host";
    host.style.cssText = "all:initial;position:fixed;top:10px;right:10px;z-index:2147483647;pointer-events:auto";
    root = host.attachShadow({mode:"open"});
    const style = document.createElement("style"); style.textContent = CSS; root.appendChild(style);
    const bar = document.createElement("div"); bar.id="bar";
    bar.innerHTML = `
      <button
        id="barToggle"
        type="button"
        title="Zwiń pasek"
      >
        ◀
      </button>

      <span class="title">
        MenelWars Tools
      </span>

      <button id="opt">
        ⚗ Destylarnia
      </button>

      <button id="gang">
        👥 Gang
      </button>

      <button id="map">
        🗺 Mapa
      </button>
    `;
    root.appendChild(bar); document.documentElement.appendChild(host);
        const barToggle =
      root.getElementById(
        "barToggle"
      );


    const setBarCollapsed =
      collapsed => {

        bar.classList.toggle(
          "collapsed",
          collapsed
        );

        barToggle.textContent =
          collapsed
            ? "◀"
            : "▶";

        barToggle.title =
          collapsed
            ? "Rozwiń pasek"
            : "Zwiń pasek";

        localStorage.setItem(
          BAR_COLLAPSED_KEY,
          collapsed
            ? "1"
            : "0"
        );
      };


    const initiallyCollapsed =
      localStorage.getItem(
        BAR_COLLAPSED_KEY
      ) === "1";


    setBarCollapsed(
      initiallyCollapsed
    );


    barToggle.onclick =
      () => {

        const collapsed =
          !bar.classList.contains(
            "collapsed"
          );

        setBarCollapsed(
          collapsed
        );
      };
    root.getElementById("map").onclick = openMap;
    root.getElementById("gang").onclick = openPayments;
    root.getElementById("opt").onclick = openOptimizer;
    return true;
  }

  function checkboxHtml(name) {
  return `
    <label>
      <input
        type="checkbox"
        data-premium="${esc(name)}"
        ${premiumState[name] ? "checked" : ""}
      >
      ${esc(displayName(name))}
    </label>
  `;
}

  function reservationOwnerMap() {
    try {
      const parsed =
        JSON.parse(
          localStorage.getItem(
            RESERVATION_OWNER_KEY
          ) || "{}"
        );

      return (
        parsed &&
        typeof parsed === "object"
          ? parsed
          : {}
      );
    } catch {
      return {};
    }
  }

  function saveReservationOwnerMap(map) {
    localStorage.setItem(
      RESERVATION_OWNER_KEY,
      JSON.stringify(map || {})
    );
  }

  function reservationOwnerFor(recipe) {
    const recipeKey =
      key(
        recipe.baza,
        recipe.drozdze,
        recipe.woda,
        recipe.program
      );

    const map =
      reservationOwnerMap();

    const owner =
      map[recipeKey];

    if (!owner || !owner.token) {
      return null;
    }

    if (
      Number(owner.expiresAt) &&
      Number(owner.expiresAt) <
        Date.now()
    ) {
      delete map[recipeKey];
      saveReservationOwnerMap(map);
      return null;
    }

    return owner;
  }

  function saveReservationOwner(
    recipe,
    token,
    reservation
  ) {
    if (!token) return;

    const recipeKey =
      key(
        recipe.baza,
        recipe.drozdze,
        recipe.woda,
        recipe.program
      );

    const map =
      reservationOwnerMap();

    map[recipeKey] = {
      token,
      nick:
        String(
          reservation &&
          reservation.nick ||
          ""
        ),
      expiresAt:
        Number(
          reservation &&
          reservation.expiresAt
        ) || 0
    };

    saveReservationOwnerMap(map);
  }

  function clearReservationOwner(recipe) {
    const recipeKey =
      key(
        recipe.baza,
        recipe.drozdze,
        recipe.woda,
        recipe.program
      );

    const map =
      reservationOwnerMap();

    delete map[recipeKey];
    saveReservationOwnerMap(map);
  }

  function ownsReservation(
    recipe,
    reservation
  ) {
    const owner =
      reservationOwnerFor(recipe);

    if (!owner || !reservation) {
      return false;
    }

    return (
      String(owner.nick || "")
        .trim()
        .toLocaleLowerCase("pl-PL") ===
      String(reservation.nick || "")
        .trim()
        .toLocaleLowerCase("pl-PL")
    );
  }

  function recipeReservationFor(r) {
    return recipeReservations[
      key(r.baza,r.drozdze,r.woda,r.program)
    ] || null;
  }

  function reservationClock(expiresAt) {
    const date = new Date(Number(expiresAt));
    if (!Number.isFinite(date.getTime())) return "";
    return date.toLocaleTimeString("pl-PL", {
      hour:"2-digit",
      minute:"2-digit"
    });
  }

  async function reserveUnknownRecipe(recipe) {
    const savedNick = localStorage.getItem(NICK_KEY) || "";
    const nick = window.prompt(
      "Kto rezerwuje tę recepturę na 12 godzin?",
      savedNick
    );

    if (nick === null) return;
    const cleanNick = String(nick || "").trim();
    if (!cleanNick) {
      window.alert("Podaj nick.");
      return;
    }

    localStorage.setItem(NICK_KEY, cleanNick);

    try {
      const url = BACKEND_URL +
        "?action=reserveRecipe" +
        "&nick=" + encodeURIComponent(cleanNick) +
        "&baza=" + encodeURIComponent(recipe.baza) +
        "&drozdze=" + encodeURIComponent(recipe.drozdze) +
        "&woda=" + encodeURIComponent(recipe.woda) +
        "&program=" + encodeURIComponent(recipe.program) +
        "&ownerToken=" +
          encodeURIComponent(
            reservationOwnerFor(recipe)?.token || ""
          ) +
        "&_=" + Date.now();

      const result = await gmJsonRequest("GET", url);

      if (!result || !result.ok) {
        throw new Error(
          result && result.error
            ? result.error
            : "Nie udało się zarezerwować receptury."
        );
      }

      if (result.ownerToken) {
        saveReservationOwner(
          recipe,
          result.ownerToken,
          result.reservation
        );
      }

      window.alert(
        result.message ||
        "Receptura zarezerwowana na 12 godzin."
      );

      fetchApproved();

    } catch (err) {
      window.alert(
        err && err.message
          ? err.message
          : "Nie udało się zarezerwować receptury."
      );
    }
  }

  async function submitReservedRecipe(
    recipe,
    reservation
  ) {
    const owner =
      reservationOwnerFor(recipe);

    if (
      !owner ||
      !ownsReservation(
        recipe,
        reservation
      )
    ) {
      alert(
        "Ten szybki zapis jest dostępny tylko na urządzeniu, " +
        "z którego utworzono tę rezerwację."
      );
      return;
    }

    const raw =
      prompt(
        "Wpisz wynik tej receptury w litrach:",
        ""
      );

    if (raw === null) return;

    const litry =
      Number(
        String(raw)
          .trim()
          .replace(/\s+/g,"")
          .replace(",",".")
      );

    if (
      !Number.isFinite(litry) ||
      litry <= 0 ||
      litry > 50
    ) {
      alert(
        "Podaj poprawny wynik w litrach."
      );
      return;
    }

    if (
      !confirm(
        `Wysłać wynik ${fmt(litry)} l do weryfikacji?\n\n` +
        `${displayName(recipe.baza)} · ` +
        `${displayName(recipe.drozdze)} · ` +
        `${displayName(recipe.woda)} · P${recipe.program}`
      )
    ) {
      return;
    }

    const nonce =
      makeGangNonce();

    try {
      const start =
        await gmJsonRequest(
          "POST",
          BACKEND_URL,
          {
            action:
              "submitReservedRecipe",
            nonce,
            ownerToken:
              owner.token,
            baza:recipe.baza,
            drozdze:recipe.drozdze,
            woda:recipe.woda,
            program:recipe.program,
            litry
          }
        );

      if (
        start &&
        start.ok === false
      ) {
        throw new Error(
          start.error ||
          "Nie udało się rozpocząć zapisu."
        );
      }

      let result = null;

      for (
        let attempt = 0;
        attempt < 20;
        attempt++
      ) {
        await new Promise(
          resolve =>
            setTimeout(resolve,300)
        );

        result =
          await gmJsonRequest(
            "GET",
            BACKEND_URL +
              "?action=reservedSubmitResult" +
              "&nonce=" +
              encodeURIComponent(nonce) +
              "&_=" +
              Date.now()
          );

        if (
          result &&
          !result.pending
        ) {
          break;
        }
      }

      if (
        !result ||
        result.pending
      ) {
        throw new Error(
          "Serwer nie zwrócił wyniku zapisu."
        );
      }

      if (!result.ok) {
        throw new Error(
          result.error ||
          "Nie udało się wysłać wyniku."
        );
      }

      alert(
        "✅ Wynik został wysłany do weryfikacji.\n\n" +
        "Rezerwacja pozostaje aktywna do czasu decyzji administratora."
      );

      fetchApproved();

    } catch (err) {
      alert(
        err && err.message
          ? err.message
          : "Nie udało się wysłać wyniku."
      );
    }
  }

  function renderOptimizer() {

  if (!optPanel) return;

  const available =
    RECIPES.filter(isAvailable);

  const known =
    available
      .filter(x => x.litry !== null)
      .sort((a,b) => b.litry - a.litry);

  const unknown =
    available.filter(x => x.litry === null);

  const th =
    threshold(known);

  let body = "";


  // =========================================================
  // NAJLEPSZE
  // =========================================================

  if (currentTab === "top") {

    const filterBase = optPanel.dataset.filterBase || "";
    const filterYeast = optPanel.dataset.filterYeast || "";
    const filterWater = optPanel.dataset.filterWater || "";
    const filterProgram = optPanel.dataset.filterProgram || "";

    const filteredKnown = known.filter(r =>
      (!filterBase || r.baza === filterBase) &&
      (!filterYeast || r.drozdze === filterYeast) &&
      (!filterWater || r.woda === filterWater) &&
      (!filterProgram || String(r.program) === filterProgram)
    );

    const cardHtml = (r,i) => `
      <div class="card">
        <span class="rank">${i+1}.</span>
        <span class="liters">${fmt(r.litry)} l</span>
        <div><b>${esc(displayName(r.baza))}</b></div>
        <div>${esc(displayName(r.drozdze))} · ${esc(displayName(r.woda))} · P${r.program}</div>
      </div>`;

    const podiumHtml =
      known.slice(0,3).length
        ? `
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:5px">
              ${known.slice(0,3).map((r,i) => `
                <div
                  class="card"
                  style="
                    ${i===0
                      ? 'grid-column:1/-1;background:#fff7d8;border-color:#d2aa45'
                      : i===1
                        ? 'background:#f5f5f3;border-color:#c9c9c9'
                        : 'background:#f7e5d8;border-color:#c99a73'};
                    margin-bottom:0
                  ">
                  <div style="display:flex;justify-content:space-between;gap:6px;align-items:center">
                    <b>
                      ${['🥇','🥈','🥉'][i]}
                      ${esc(displayName(r.baza))}
                    </b>

                    <strong
                      style="
                        font-size:${i===0 ? '17px' : '15px'};
                        color:${i===0 ? '#8a6200' : '#356a3c'};
                        white-space:nowrap
                      ">
                      ${fmt(r.litry)} l
                    </strong>
                  </div>

                  <div class="muted" style="margin-top:4px">
                    ${esc(displayName(r.drozdze))} ·
                    ${esc(displayName(r.woda))} ·
                    P${r.program}
                  </div>
                </div>
              `).join("")}
            </div>
          `
        : `<div class="muted">Brak znanych receptur.</div>`;

    body = `
      <details open style="margin-bottom:8px">
        <summary style="font-weight:800;cursor:pointer">🏆 Podium dostępnych recept</summary>
        <div style="margin-top:7px">
          ${podiumHtml}
        </div>
      </details>

      <details open>
        <summary style="font-weight:800;cursor:pointer">📚 Wszystkie dostępne recepty</summary>
        <div style="margin-top:7px">
          <div class="form" style="grid-template-columns:1fr 1fr;display:grid;gap:5px;margin-bottom:7px">
            <select id="tmFilterBase"><option value="">Wszystkie bazy</option>${BASES.map(x=>`<option value="${esc(x)}" ${filterBase===x?"selected":""}>${esc(displayName(x))}</option>`).join("")}</select>
            <select id="tmFilterYeast"><option value="">Wszystkie drożdże</option>${YEASTS.map(x=>`<option value="${esc(x)}" ${filterYeast===x?"selected":""}>${esc(displayName(x))}</option>`).join("")}</select>
            <select id="tmFilterWater"><option value="">Wszystkie wody</option>${WATERS.map(x=>`<option value="${esc(x)}" ${filterWater===x?"selected":""}>${esc(displayName(x))}</option>`).join("")}</select>
            <select id="tmFilterProgram"><option value="">Wszystkie programy</option>${PROGRAMS.map(x=>`<option value="${x}" ${filterProgram===String(x)?"selected":""}>P${x}</option>`).join("")}</select>
          </div>
          <div class="muted" style="margin-bottom:6px">Pokazano ${filteredKnown.length} z ${known.length} recept.</div>
          ${filteredKnown.map(cardHtml).join("") || `<div class="muted">Brak recept dla wybranych filtrów.</div>`}
        </div>
      </details>`;
  }


  // =========================================================
  // NIEODKRYTE
  // =========================================================

  if (currentTab === "unknown") {

    const ranked = unknown
      .map(r => ({...r,trioMax:maxForTrio(r)}))
      .sort((a,b) =>
        (b.trioMax ?? -1) - (a.trioMax ?? -1) ||
        a.baza.localeCompare(b.baza) ||
        a.program - b.program
      );

    const active = ranked.filter(r => Boolean(recipeReservationFor(r)));
    const freeAll = ranked.filter(r => !recipeReservationFor(r));

    const unknownFilterBase =
      optPanel.dataset.unknownFilterBase || "";
    const unknownFilterYeast =
      optPanel.dataset.unknownFilterYeast || "";
    const unknownFilterWater =
      optPanel.dataset.unknownFilterWater || "";
    const unknownFilterProgram =
      optPanel.dataset.unknownFilterProgram || "";

    const free = freeAll.filter(r =>
      (!unknownFilterBase || r.baza === unknownFilterBase) &&
      (!unknownFilterYeast || r.drozdze === unknownFilterYeast) &&
      (!unknownFilterWater || r.woda === unknownFilterWater) &&
      (!unknownFilterProgram || String(r.program) === unknownFilterProgram)
    );

    const recipeHtml = (r,reservation,index,clickable) => {
      const isOwner =
        reservation &&
        ownsReservation(
          r,
          reservation
        );

      const isSubmitted =
        reservation &&
        String(
          reservation.state ||
          "reserved"
        ) === "submitted";

      const canEnterResult =
        isOwner &&
        !isSubmitted;

      return `
      <div
        class="card"
        ${
          clickable
            ? `data-reserve-index="${index}" style="cursor:pointer"`
            : isSubmitted
              ? `style="background:#edf4ff;border-color:#8eadd1"`
              : canEnterResult
                ? `data-owned-research="${esc(key(r.baza,r.drozdze,r.woda,r.program))}" style="cursor:pointer;background:#edf8ef;border-color:#83af8b"`
                : `style="background:#fff6dc;border-color:#d7b768"`
        }>
        <div><b>${esc(displayName(r.baza))}</b></div>
        <div>${esc(displayName(r.drozdze))} · ${esc(displayName(r.woda))} · P${r.program}</div>
        ${r.trioMax !== null && r.trioMax >= th ? `<div class="star">⭐ Interesująca do zbadania</div><div class="muted">Inny program tej trójki: do ${fmt(r.trioMax)} l.</div>` : ""}
        <div class="muted" style="margin-top:6px">
          ${
            reservation
              ? isSubmitted
                ? isOwner
                  ? `📨 <b>Wynik wprowadzony</b> · ${reservation.submittedLiters != null ? `${fmt(Number(reservation.submittedLiters))} l · ` : ""}oczekuje na akceptację`
                  : `📨 <b>${esc(reservation.nick)}</b> wprowadził wynik · oczekuje na akceptację`
                : isOwner
                  ? `🧪 <b>Oczekuje na wynik</b> · Twoja rezerwacja · kliknij, aby wprowadzić wynik · do ${reservationClock(reservation.expiresAt)}`
                  : `⏳ <b>Oczekuje na wynik</b> · ${esc(reservation.nick)} bada tę recepturę · do ${reservationClock(reservation.expiresAt)}`
              : "🔓 Wolna · kliknij, aby zaklepać na 12 h"
          }
        </div>
      </div>`;
    };

    body = `
      <details open style="margin-bottom:8px">
        <summary style="font-weight:800;cursor:pointer">🧪 W trakcie badania (${active.length})</summary>
        <div style="margin-top:7px">
          ${active.length ? active.map(r=>recipeHtml(r,recipeReservationFor(r),0,false)).join("") : `<div class="muted">Brak aktywnych rezerwacji.</div>`}
        </div>
      </details>
      <details open>
        <summary style="font-weight:800;cursor:pointer">🔬 Nieodkryte (${free.length})</summary>
        <div style="margin-top:7px">
          <div class="form" style="grid-template-columns:1fr 1fr;display:grid;gap:5px;margin-bottom:7px">
            <select id="tmUnknownFilterBase">
              <option value="">Wszystkie bazy</option>
              ${BASES.map(x=>`<option value="${esc(x)}" ${unknownFilterBase===x?"selected":""}>${esc(displayName(x))}</option>`).join("")}
            </select>
            <select id="tmUnknownFilterYeast">
              <option value="">Wszystkie drożdże</option>
              ${YEASTS.map(x=>`<option value="${esc(x)}" ${unknownFilterYeast===x?"selected":""}>${esc(displayName(x))}</option>`).join("")}
            </select>
            <select id="tmUnknownFilterWater">
              <option value="">Wszystkie wody</option>
              ${WATERS.map(x=>`<option value="${esc(x)}" ${unknownFilterWater===x?"selected":""}>${esc(displayName(x))}</option>`).join("")}
            </select>
            <select id="tmUnknownFilterProgram">
              <option value="">Wszystkie programy</option>
              ${PROGRAMS.map(x=>`<option value="${x}" ${unknownFilterProgram===String(x)?"selected":""}>P${x}</option>`).join("")}
            </select>
          </div>
          <div class="muted" style="margin-bottom:6px">
            Pokazano ${free.length} z ${freeAll.length} wolnych recept.
          </div>
          ${free.length ? free.map((r,i)=>recipeHtml(r,null,i,true)).join("") : `<div class="muted">Brak wolnych recept dla wybranych filtrów.</div>`}
        </div>
      </details>`;

    optPanel.dataset.freeUnknown = JSON.stringify(free.map(r => key(r.baza,r.drozdze,r.woda,r.program)));
  }


  // =========================================================
  // DODAJ — FORMULARZ WEWNĄTRZ DESTYLARNI
  // =========================================================

  if (currentTab === "submit") {
    const savedNick =
      localStorage.getItem(NICK_KEY) || "";

    body = `
      <div class="card" style="padding:10px">
        <b>➕ Dodaj recepturę</b>
        <div class="muted" style="margin:4px 0 10px">
          Wyślij wynik do wspólnej bazy do weryfikacji administratora.
        </div>

        <form id="inlineRecipeForm" class="form">
          <label>
            Nick
            <input id="inlineRecipeNick" type="text" maxlength="40" value="${esc(savedNick)}" required>
          </label>

          <label>
            Baza
            <select id="inlineRecipeBase">
              ${BASES.map(x => `<option value="${esc(x)}">${esc(displayName(x))}</option>`).join("")}
            </select>
          </label>

          <label>
            Drożdże
            <select id="inlineRecipeYeast">
              ${YEASTS.map(x => `<option value="${esc(x)}">${esc(displayName(x))}</option>`).join("")}
            </select>
          </label>

          <label>
            Woda
            <select id="inlineRecipeWater">
              ${WATERS.map(x => `<option value="${esc(x)}">${esc(displayName(x))}</option>`).join("")}
            </select>
          </label>

          <label>
            Program
            <select id="inlineRecipeProgram">
              ${PROGRAMS.map(x => `<option value="${x}">P${x}</option>`).join("")}
            </select>
          </label>

          <label>
            Wynik w litrach
            <input id="inlineRecipeLiters" type="text" inputmode="decimal" placeholder="np. 4,18" required>
          </label>

          <label>
            Uwagi
            <textarea id="inlineRecipeNotes" rows="3" maxlength="250" placeholder="opcjonalnie"></textarea>
          </label>

          <div id="inlineRecipeInfo" class="submitInfo"></div>

          <button type="submit" class="sendBtn">
            Wyślij do weryfikacji
          </button>

          <div id="inlineRecipeStatus" class="submitStatus"></div>
        </form>
      </div>
    `;
  }


  // =========================================================
  // POSTĘP
  // =========================================================

  if (currentTab === "progress") {

    const globalKnown =
      RECIPES.filter(x => x.litry !== null).length;

    const gp =
      globalKnown /
      RECIPES.length *
      100;

    const ap =
      available.length
        ? known.length /
          available.length *
          100
        : 0;


    body = `

      <b>Cała baza</b>
      <br>

      Znane:
      <b>
        ${globalKnown} / ${RECIPES.length}
      </b>

      <br>

      Nieodkryte:
      <b>
        ${RECIPES.length - globalKnown}
      </b>

      <br>

      Postęp:
      <b>
        ${gp.toFixed(1).replace(".",",")}%
      </b>

      <div class="bar">
        <div style="width:${gp}%"></div>
      </div>


      <b>Dla Twoich składników</b>
      <br>

      Znane:
      <b>
        ${known.length} / ${available.length}
      </b>

      <br>

      Nieodkryte:
      <b>
        ${unknown.length}
      </b>

      <br>

      Postęp:
      <b>
        ${ap.toFixed(1).replace(".",",")}%
      </b>

      <div class="bar">
        <div style="width:${ap}%"></div>
      </div>

      <br>
      <b>🏆 Ranking odkrywców</b>
      <div style="margin-top:7px">
        ${
          recipeRanking.length
            ? recipeRanking.slice(0,15).map((item,index) => `
                <div class="card" style="padding:6px 8px;margin-bottom:4px">
                  <span><b>${index+1}.</b> ${esc(item.nick)}</span>
                  <span style="float:right"><b>${Number(item.count) || 0}</b></span>
                </div>
              `).join("")
            : `<div class="muted">Brak zaakceptowanych odkryć do rankingu.</div>`
        }
      </div>
      <div class="muted" style="margin-top:5px">
        Jedna unikalna receptura daje maksymalnie 1 punkt. Duplikaty i korekty nie dodają punktu.
      </div>

    `;
  }


  optPanel
    .querySelector(".body")
    .innerHTML = body;

  if (currentTab === "unknown") {
    [
      ["#tmUnknownFilterBase","unknownFilterBase"],
      ["#tmUnknownFilterYeast","unknownFilterYeast"],
      ["#tmUnknownFilterWater","unknownFilterWater"],
      ["#tmUnknownFilterProgram","unknownFilterProgram"]
    ].forEach(([selector,keyName]) => {
      const select =
        optPanel.querySelector(selector);

      if (select) {
        select.onchange = () => {
          optPanel.dataset[keyName] =
            select.value;
          renderOptimizer();
        };
      }
    });
  }

  if (currentTab === "submit") {
    const form = optPanel.querySelector("#inlineRecipeForm");

    if (form) {
      const submissionKey = () =>
        key(
          optPanel.querySelector("#inlineRecipeBase").value,
          optPanel.querySelector("#inlineRecipeYeast").value,
          optPanel.querySelector("#inlineRecipeWater").value,
          Number(optPanel.querySelector("#inlineRecipeProgram").value)
        );

      const updateInfo = () => {
        const known = currentKnownValue(submissionKey());
        const info = optPanel.querySelector("#inlineRecipeInfo");

        info.innerHTML =
          known === null
            ? "🔬 Ta receptura jest obecnie <b>nieodkryta</b>."
            : `ℹ️ Aktualny znany wynik: <b>${fmt(known)} l</b>. Możesz wysłać korektę.`;
      };

      [
        "#inlineRecipeBase",
        "#inlineRecipeYeast",
        "#inlineRecipeWater",
        "#inlineRecipeProgram"
      ].forEach(selector => {
        optPanel
          .querySelector(selector)
          .addEventListener("change", updateInfo);
      });

      form.addEventListener("submit", event => {
        event.preventDefault();

        const status =
          optPanel.querySelector("#inlineRecipeStatus");

        const nick =
          optPanel.querySelector("#inlineRecipeNick").value.trim();

        const litry =
          Number(
            optPanel.querySelector("#inlineRecipeLiters")
              .value.trim()
              .replace(/\s+/g,"")
              .replace(",",".")
          );

        if (!nick) {
          status.textContent = "Podaj nick.";
          return;
        }

        if (!Number.isFinite(litry) || litry <= 0) {
          status.textContent = "Podaj poprawny wynik.";
          return;
        }

        localStorage.setItem(NICK_KEY,nick);

        status.textContent = "Wysyłanie...";

        GM_xmlhttpRequest({
          method:"POST",
          url:BACKEND_URL,
          headers:{
            "Content-Type":"text/plain;charset=UTF-8"
          },
          data:JSON.stringify({
            nick,
            baza:optPanel.querySelector("#inlineRecipeBase").value,
            drozdze:optPanel.querySelector("#inlineRecipeYeast").value,
            woda:optPanel.querySelector("#inlineRecipeWater").value,
            program:Number(optPanel.querySelector("#inlineRecipeProgram").value),
            litry,
            uwagi:optPanel.querySelector("#inlineRecipeNotes").value.trim()
          }),
          onload:response => {
            try {
              const result = JSON.parse(response.responseText);

              if (result.ok) {
                status.textContent =
                  "✅ Zgłoszenie wysłane do weryfikacji.";
                optPanel.querySelector("#inlineRecipeLiters").value = "";
                optPanel.querySelector("#inlineRecipeNotes").value = "";
              } else {
                status.textContent =
                  "⚠️ " + (result.error || "Nie udało się wysłać.");
              }
            } catch {
              status.textContent =
                "⚠️ Nieprawidłowa odpowiedź serwera.";
            }
          },
          onerror:() => {
            status.textContent =
              "⚠️ Błąd połączenia z serwerem.";
          }
        });
      });

      updateInfo();
    }
  }


  if (currentTab === "unknown") {
    const freeKeys = (() => {
      try { return JSON.parse(optPanel.dataset.freeUnknown || "[]"); }
      catch { return []; }
    })();
    const ranked = unknown
      .map(r => ({...r,trioMax:maxForTrio(r)}))
      .sort((a,b) =>
        (b.trioMax ?? -1) - (a.trioMax ?? -1) ||
        a.baza.localeCompare(b.baza) ||
        a.program - b.program
      );

    optPanel
      .querySelectorAll("[data-reserve-index]")
      .forEach(card => {
        card.onclick = () => {
          const selectedKey = freeKeys[Number(card.dataset.reserveIndex)];
          const recipe = ranked.find(r => key(r.baza,r.drozdze,r.woda,r.program) === selectedKey);
          if (recipe) reserveUnknownRecipe(recipe);
        };
      });

    optPanel
      .querySelectorAll(
        "[data-owned-research]"
      )
      .forEach(card => {
        card.onclick = () => {
          const recipeKey =
            card.dataset
              .ownedResearch;

          const recipe =
            ranked.find(
              item =>
                key(
                  item.baza,
                  item.drozdze,
                  item.woda,
                  item.program
                ) === recipeKey
            );

          if (!recipe) return;

          submitReservedRecipe(
            recipe,
            recipeReservationFor(recipe)
          );
        };
      });
  }


  optPanel
    .querySelectorAll(".tab")
    .forEach(
      t =>
        t.classList.toggle(
          "active",
          t.dataset.tab === currentTab
        )
    );
}

  function openOptimizer() {
    if (adminPanel) { adminPanel.remove(); adminPanel=null; }
	if (paymentsPanel) {
  paymentsPanel.remove();
  paymentsPanel = null;
}
    if (optPanel) { optPanel.remove(); optPanel=null; return; }
    if (mapPanel) { mapPanel.remove(); mapPanel=null; }
	if (submitPanel) {
  	submitPanel.remove();
  	submitPanel = null;
	}
    if (!root) mount();
    optPanel = document.createElement("div"); optPanel.className="panel";
    optPanel.innerHTML = `<div class="head"><span>⚗ MenelWars — Destylarnia</span><span class="close">×</span></div>
      <div class="premium"><div class="ptitle">Posiadane składniki premium</div>
      <div class="checks">${[...PREMIUM.baza,...PREMIUM.drozdze].map(checkboxHtml).join("")}</div></div>
      <div class="tabs"><div class="tab active" data-tab="top">Dostępne recepty</div>
      <div class="tab" data-tab="unknown">Nieodkryte</div>
      <div class="tab" data-tab="submit">Dodaj</div>
      <div class="tab" data-tab="progress">Postęp</div></div>
      <div class="body"></div>`;
    root.appendChild(optPanel);
    optPanel.querySelector(".close").onclick=()=>{optPanel.remove();optPanel=null;};
    optPanel.querySelectorAll(".tab").forEach(t=>t.onclick=()=>{
      currentTab=t.dataset.tab;
      renderOptimizer();
    });
    optPanel.querySelectorAll("[data-premium]").forEach(cb=>cb.onchange=()=>{
      premiumState[cb.dataset.premium]=cb.checked;
      localStorage.setItem(PREMIUM_KEY,JSON.stringify(premiumState));
      renderOptimizer();
    });
    renderOptimizer();
  }

function currentKnownValue(k) {

  if (
    Object.prototype.hasOwnProperty.call(
      remoteApproved,
      k
    )
  ) {
    return Number(remoteApproved[k]);
  }

  if (
    Object.prototype.hasOwnProperty.call(
      KNOWN,
      k
    )
  ) {
    return Number(KNOWN[k]);
  }

  return null;
}


function openSubmit() {

if (adminPanel) {
  adminPanel.remove();
  adminPanel = null;
}

if (paymentsPanel) {
  paymentsPanel.remove();
  paymentsPanel = null;
}

  if (submitPanel) {
    submitPanel.remove();
    submitPanel = null;
    return;
  }

  if (optPanel) {
    optPanel.remove();
    optPanel = null;
  }

  if (mapPanel) {
    mapPanel.remove();
    mapPanel = null;
  }

  if (!root) {
    mount();
  }

  submitPanel =
    document.createElement("div");

  submitPanel.className =
    "panel";

  const savedNick =
    localStorage.getItem(NICK_KEY) || "";

  submitPanel.innerHTML = `

    <div class="head">

      <span>
        ➕ Zgłoś recepturę
      </span>

      <span class="close">
        ×
      </span>

    </div>

    <div class="body">

      <form
        id="recipeForm"
        class="form">

        <label>
          Nick

          <input
            id="recipeNick"
            type="text"
            maxlength="40"
            value="${esc(savedNick)}"
            required>
        </label>

        <label>
          Baza

          <select id="recipeBase">

            ${
              BASES
                .map(
                  x =>
                    `<option value="${esc(x)}">${esc(displayName(x))}</option>`
                )
                .join("")
            }

          </select>
        </label>

        <label>
          Drożdże

          <select id="recipeYeast">

            ${
              YEASTS
                .map(
                  x =>
                    `<option value="${esc(x)}">${esc(displayName(x))}</option>`
                )
                .join("")
            }

          </select>
        </label>

        <label>
          Woda

          <select id="recipeWater">

            ${
              WATERS
                .map(
                  x =>
                    `<option value="${esc(x)}">${esc(displayName(x))}</option>`
                )
                .join("")
            }

          </select>
        </label>

        <label>
          Program

          <select id="recipeProgram">

            ${
              PROGRAMS
                .map(
                  x =>
                    `<option value="${x}">P${x}</option>`
                )
                .join("")
            }

          </select>
        </label>

        <label>
          Wynik w litrach

          <input
            id="recipeLiters"
            type="text"
            inputmode="decimal"
            placeholder="np. 4,18"
            required>
        </label>

        <label>
          Uwagi

          <textarea
            id="recipeNotes"
            rows="3"
            maxlength="250"
            placeholder="opcjonalnie"></textarea>
        </label>

        <div
          id="recipeInfo"
          class="submitInfo">
        </div>

        <button
          type="submit"
          class="sendBtn">

          Wyślij do weryfikacji

        </button>

        <div
          id="recipeStatus"
          class="submitStatus">
        </div>

      </form>

    </div>
  `;

  root.appendChild(
    submitPanel
  );

  submitPanel
    .querySelector(".close")
    .onclick = () => {

      submitPanel.remove();
      submitPanel = null;
    };


  function submissionKey() {

    return key(
      submitPanel.querySelector("#recipeBase").value,
      submitPanel.querySelector("#recipeYeast").value,
      submitPanel.querySelector("#recipeWater").value,
      Number(
        submitPanel.querySelector("#recipeProgram").value
      )
    );
  }


  function updateRecipeInfo() {

    const known =
      currentKnownValue(
        submissionKey()
      );

    const info =
      submitPanel.querySelector("#recipeInfo");

    if (known === null) {

      info.innerHTML =
        "🔬 Ta receptura jest obecnie <b>nieodkryta</b>.";

    } else {

      info.innerHTML =
        "ℹ️ Aktualny znany wynik: <b>" +
        fmt(known) +
        " l</b>. Możesz wysłać korektę.";
    }
  }


  [
    "#recipeBase",
    "#recipeYeast",
    "#recipeWater",
    "#recipeProgram"
  ].forEach(selector => {

    submitPanel
      .querySelector(selector)
      .addEventListener(
        "change",
        updateRecipeInfo
      );
  });


  submitPanel
    .querySelector("#recipeForm")
    .addEventListener(
      "submit",
      event => {

        event.preventDefault();

        const status =
          submitPanel.querySelector(
            "#recipeStatus"
          );

        const nick =
          submitPanel
            .querySelector("#recipeNick")
            .value
            .trim();

        const litryRaw =
          submitPanel
            .querySelector("#recipeLiters")
            .value
            .trim();

        const litry =
          Number(
            litryRaw
              .replace(/\s+/g, "")
              .replace(",", ".")
          );

        if (!nick) {

          status.textContent =
            "Podaj nick.";

          return;
        }

        if (
          !Number.isFinite(litry) ||
          litry <= 0
        ) {

          status.textContent =
            "Podaj poprawny wynik.";

          return;
        }

        localStorage.setItem(
          NICK_KEY,
          nick
        );

        const payload = {

          nick,

          baza:
            submitPanel
              .querySelector("#recipeBase")
              .value,

          drozdze:
            submitPanel
              .querySelector("#recipeYeast")
              .value,

          woda:
            submitPanel
              .querySelector("#recipeWater")
              .value,

          program:
            Number(
              submitPanel
                .querySelector("#recipeProgram")
                .value
            ),

          litry,

          uwagi:
            submitPanel
              .querySelector("#recipeNotes")
              .value
              .trim()
        };

        status.textContent =
          "Wysyłanie...";


        GM_xmlhttpRequest({

          method: "POST",

          url: BACKEND_URL,

          headers: {
            "Content-Type":
              "text/plain;charset=UTF-8"
          },

          data:
            JSON.stringify(payload),

          onload: response => {

            try {

              const result =
                JSON.parse(
                  response.responseText
                );

              if (result.ok) {

                status.textContent =
                  "✅ Zgłoszenie wysłane do weryfikacji.";

                submitPanel
                  .querySelector("#recipeLiters")
                  .value = "";

                submitPanel
                  .querySelector("#recipeNotes")
                  .value = "";

              } else {

                status.textContent =
                  "⚠️ " +
                  (
                    result.error ||
                    "Nie udało się wysłać."
                  );
              }

            } catch {

              status.textContent =
                "⚠️ Nieprawidłowa odpowiedź serwera.";
            }
          },

          onerror: () => {

            status.textContent =
              "⚠️ Błąd połączenia z serwerem.";
          }
        });
      }
    );


  updateRecipeInfo();
}

  function openMap() {
    if (mapPanel) {
      mapPanel.remove();
      mapPanel = null;
      return;
    }

    if (adminPanel) { adminPanel.remove(); adminPanel=null; }
    if (submitPanel) { submitPanel.remove(); submitPanel=null; }
    if (paymentsPanel) { paymentsPanel.remove(); paymentsPanel=null; }
    if (optPanel) { optPanel.remove(); optPanel=null; }

    if (!root) mount();

    const markers = MAP.map(([district, action, icon]) => {
      const p = MAP_POSITIONS[district];
      if (!p) return "";

      return `
        <div class="mapMarker ${action ? "" : "unknown"}"
          style="left:${p.x}%;top:${p.y}%">
          ${icon} ${esc(action || "Nieodkryte")}
        </div>
      `;
    }).join("");

    mapPanel = document.createElement("div");
    mapPanel.className = "panel";
    mapPanel.innerHTML = `
      <div class="head">
        <span>🗺 Ściąga — Mapa</span>
        <span class="close">×</span>
      </div>
      <div class="mapbody">
        <div class="mapStage">
          <img src="${MAP_IMAGE_URL}" alt="Mapa dzielnic">
          ${markers}
        </div>
        <div class="mapLegend">
          ⚪ Neutralny · 🙏 Błagalny · 🤝 Przyjacielski · ⚔️ Agresywny
        </div>
      </div>
    `;

    root.appendChild(mapPanel);

    mapPanel.querySelector(".close").onclick = () => {
      mapPanel.remove();
      mapPanel = null;
    };
  }

// ============================================================
// WPŁATY GANGU — LOGOWANIE + CHRONIONE DANE
// ============================================================

function gangToken() {
  return localStorage.getItem(GANG_TOKEN_KEY) || "";
}

function setGangToken(token) {

  if (token) {
    localStorage.setItem(
      GANG_TOKEN_KEY,
      token
    );
  } else {
    localStorage.removeItem(
      GANG_TOKEN_KEY
    );
  }
}


function makeGangNonce() {

  if (
    globalThis.crypto &&
    typeof globalThis.crypto.randomUUID === "function"
  ) {
    return globalThis.crypto.randomUUID();
  }

  const bytes =
    new Uint8Array(24);

  globalThis.crypto
    .getRandomValues(bytes);

  return Array.from(
    bytes,
    b =>
      b
        .toString(16)
        .padStart(2,"0")
  ).join("");
}


function gmJsonRequest(
  method,
  url,
  body=null
) {

  return new Promise(
    (resolve,reject) => {

      GM_xmlhttpRequest({

        method,

        url,

        headers:
          body
            ? {
                "Content-Type":
                  "text/plain;charset=UTF-8",

                "Accept":
                  "application/json"
              }
            : {
                "Accept":
                  "application/json"
              },

        data:
          body
            ? JSON.stringify(body)
            : undefined,

        timeout: 12000,

        onload: response => {

          try {

            resolve(
              JSON.parse(
                response.responseText
              )
            );

          } catch (err) {

            reject(
              new Error(
                "Nieprawidłowa odpowiedź serwera."
              )
            );
          }
        },

        ontimeout: () =>
          reject(
            new Error(
              "Przekroczono czas odpowiedzi serwera."
            )
          ),

        onerror: () =>
          reject(
            new Error(
              "Błąd połączenia z serwerem."
            )
          )
      });
    }
  );
}


function playerIdentityToken() {
  const current = localStorage.getItem(PLAYER_IDENTITY_KEY) || "";
  if (current) return current;

  const legacy = localStorage.getItem(COMPANY_SALARY_IDENTITY_KEY) || "";
  if (legacy) localStorage.setItem(PLAYER_IDENTITY_KEY,legacy);
  return legacy;
}

function setPlayerIdentityToken(token) {
  if (token) {
    localStorage.setItem(PLAYER_IDENTITY_KEY,token);
    localStorage.setItem(COMPANY_SALARY_IDENTITY_KEY,token);
  } else {
    localStorage.removeItem(PLAYER_IDENTITY_KEY);
    localStorage.removeItem(COMPANY_SALARY_IDENTITY_KEY);
  }
}

function companySalaryIdentityToken() {
  return playerIdentityToken();
}

function setCompanySalaryIdentityToken(token) {
  setPlayerIdentityToken(token);
}

async function companySalaryPostAction(action,data={}) {
  const nonce = makeGangNonce();

  const start = await gmJsonRequest("POST",BACKEND_URL,{
    action,
    nonce,
    ...data
  });

  if (start && start.ok === false) {
    throw new Error(start.error || "Nie udało się rozpocząć operacji.");
  }

  let result = null;

  for (let attempt=0; attempt<20; attempt++) {
    await new Promise(resolve => setTimeout(resolve,300));

    result = await gmJsonRequest(
      "GET",
      BACKEND_URL +
        "?action=companySalaryActionResult" +
        "&nonce=" + encodeURIComponent(nonce) +
        "&_=" + Date.now()
    );

    if (result && !result.pending) break;
  }

  if (!result || result.pending) {
    throw new Error("Serwer nie zwrócił wyniku operacji.");
  }

  if (!result.ok) {
    throw new Error(result.error || "Operacja nie powiodła się.");
  }

  return result;
}


function paymentsDate(value) {

  const text =
    String(value || "").trim();

  if (!text) {
    return "—";
  }

  const display =
    /^(\d{2})\.(\d{2})\.(\d{4}),\s*(\d{2}):(\d{2})(?::(\d{2}))?$/
      .exec(text);

  if (display) {
    return (
      `${display[1]}.${display[2]}.${display[3]} ` +
      `${display[4]}:${display[5]}` +
      (display[6] ? `:${display[6]}` : "")
    );
  }

  const dateOnly =
    /^(\d{4})-(\d{2})-(\d{2})$/
      .exec(text);

  if (dateOnly) {
    return `${dateOnly[3]}.${dateOnly[2]}.${dateOnly[1]}`;
  }

  const date =
    new Date(text);

  if (Number.isFinite(date.getTime())) {
    return date.toLocaleString(
      "pl-PL",
      {
        day:"2-digit",
        month:"2-digit",
        year:"numeric",
        hour:"2-digit",
        minute:"2-digit",
        second:"2-digit"
      }
    );
  }

  return text;
}


function paymentAmount(value) {

  return Number(value)
    .toLocaleString(
      "pl-PL",
      {
        maximumFractionDigits:2
      }
    );
}


function paymentShare(value) {

  const share =
    Math.max(
      0,
      Number(value) || 0
    );

  return (share * 100)
    .toFixed(2)
    .replace(".", ",") + "%";
}


function paymentRankBadge(index) {
  const position = index + 1;

  if (position === 1) return "🥇";
  if (position === 2) return "🥈";
  if (position === 3) return "🥉";

  return `<span style="
    display:inline-flex;
    width:22px;
    height:22px;
    align-items:center;
    justify-content:center;
    border-radius:50%;
    background:#eee5d6;
    font-weight:900;
    font-size:11px;
  ">${position}</span>`;
}

function paymentRow(player,index=0) {
  const saldo = Number(player.saldo) || 0;

  let status = "🟢 Na bieżąco";
  let bg = "#f5f7f1";
  let border = "#ccd6c5";
  let value = "0 zł";

  if (saldo < 0) {
    status = "🔴 Dług";
    bg = "#fff1f1";
    border = "#e3b2b2";
    value = "-" + adminMoney(Math.abs(saldo)) + " zł";
  } else if (saldo > 0) {
    status = "🔵 Nadpłata";
    bg = "#eef8f0";
    border = "#b6d9bd";
    value = "+" + adminMoney(saldo) + " zł";
  }

  return `
    <div class="card" style="
      background:${bg};
      border-color:${border};
      display:grid;
      grid-template-columns:28px minmax(0,1fr) auto;
      gap:7px;
      align-items:center;
    ">
      <div style="text-align:center">
        ${paymentRankBadge(index)}
      </div>

      <div>
        <b>${esc(player.nick)}</b>
        <div class="muted" style="margin-top:3px">
          ${status}
        </div>
      </div>

      <div style="font-weight:900;white-space:nowrap">
        ${value}
      </div>
    </div>
  `;
}


function renderPaymentsLogin(
  message=""
) {

  if (!paymentsPanel) {
    return;
  }

  paymentsPanel
    .querySelector(
      ".paymentsWrap"
    )
    .innerHTML = `

      <form
        id="gangLoginForm"
        class="paymentsLogin">

        <div>
          <b>
            🔐 Dostęp tylko dla członków gangu
          </b>
        </div>

        <div class="muted">
          Wpisz hasło gangu.
          Dostęp zostanie zapamiętany
          na tym urządzeniu.
        </div>

        <input
          id="gangPassword"
          type="password"
          autocomplete="current-password"
          placeholder="Hasło gangu"
          required>

        <button
          class="sendBtn"
          type="submit">

          Odblokuj wpłaty

        </button>

        <div class="paymentsStatus">
          ${esc(message)}
        </div>

      </form>
    `;

  paymentsPanel
    .querySelector(
      "#gangLoginForm"
    )
    .onsubmit =
      loginPayments;
}


function renderGangSection(section="payments") {

  if (!paymentsPanel || !latestGangPayload) return;

  const payload = latestGangPayload;
  const players = Array.isArray(payload.players) ? payload.players : [];
  const wrap = paymentsPanel.querySelector(".paymentsWrap");

  const money = value =>
    (Number(value) || 0).toLocaleString("pl-PL", {maximumFractionDigits:2}) + " zł";

  const nav = `
    <div class="tabs" style="margin-bottom:10px;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:6px">
      <div class="tab ${section === "payments" ? "active" : ""}" data-gang-tab="payments">Wpłaty</div>
      <div class="tab ${section === "company" ? "active" : ""}" data-gang-tab="company">Spółka</div>
      <div class="tab ${section === "goals" ? "active" : ""}" data-gang-tab="goals">Cele</div>
      <div class="tab ${section === "announcements" ? "active" : ""}" data-gang-tab="announcements">Ogłoszenia</div>
      <div class="tab" data-gang-tab="admin">Admin</div>
    </div>
  `;

  let body = "";

  if (section === "payments") {
    body = `
      <div class="paymentsTop">
        <div class="paymentsMeta">
          <b>Stan na: ${paymentsDate(payload.updatedAtDisplay || payload.updatedAt || payload.saldoDate)}</b><br>
          <span class="muted">Graczy: ${players.length}</span>
        </div>
        <div class="paymentsActions">
          <button id="paymentsRefresh">↻ Odśwież</button>
          <button id="paymentsLogout" class="logoutSoft">↪ Wyloguj</button>
        </div>
      </div>
      <div id="paymentsStatus" class="paymentsStatus"></div>
      <div>${
        players.length
          ? players
              .slice()
              .sort((a,b) =>
                (Number(b.saldo)||0) -
                (Number(a.saldo)||0)
                ||
                String(a.nick||"").localeCompare(String(b.nick||""),"pl")
              )
              .map((player,index) => paymentRow(player,index))
              .join("")
          : `<div class="muted">Brak danych do wyświetlenia.</div>`
      }</div>
    `;
  }

  if (section === "polls") {
    body = `
      <div id="tmGangPolls">
        <div class="muted">Ładowanie ankiet...</div>
      </div>
    `;
  }

  if (section === "settings") {
    body = `
      <div id="tmPlayerIdentitySettings">
        <div class="muted">Ładowanie ustawień...</div>
      </div>
    `;
  }

  if (section === "company") {
    const eligible = players
      .filter(p => Number(p.share) > 0 || Number(p.salary) > 0)
      .sort((a,b) => Number(b.contribution || 0) - Number(a.contribution || 0));

    body = `
      <div class="card"><b>Dzienny dochód:</b> ${money(payload.companyIncome)}</div>
      <div class="card"><b>Budżet pensji 50%:</b> ${money(payload.salaryBudget)}</div>
      <div class="card"><b>Rozwój 50%:</b> ${money(payload.developmentBudget)}</div>
      <div class="card"><b>Udziałowcy ≥ 30 000:</b> ${Number(payload.eligibleCount) || 0}</div>

      ${
        Number(payload.waivedToFund) > 0
          ? `
              <div class="card" style="background:#eef7ef;border-color:#9fc3a4">
                💚 <b>Dobrowolnie do Funduszu:</b> +${money(payload.waivedToFund)}
                <br>
                <span class="muted">Fundusz z częścią rozwojową: ${money(payload.fundTotal)}</span>
              </div>
            `
          : ""
      }

      <div id="tmCompanySalarySelf" style="margin:8px 0"></div>

      <br><b>Udziały i przewidywane pensje</b>

      ${eligible.length
        ? eligible.map(p => `
            <div class="card" style="background:#eef8f0;border-color:#b6d9bd">
              <b>${esc(p.nick)}${p.salaryWaived ? ` 💚` : ""}</b>
              <div class="muted" style="margin-top:3px">
                🏢 Wkład: <b>${money(p.contribution)}</b>
                · Udział: <b>${(Number(p.share || 0)*100).toLocaleString("pl-PL",{minimumFractionDigits:2,maximumFractionDigits:2})}%</b>
                · 💰 Należna: <b>${money(p.salary)}</b>
                ${p.salaryWaived ? ` · 🎮 Do gry: <b>${money(p.payoutSalary)}</b> · 💚 Fundusz: <b>${money(p.waivedAmount)}</b>` : ""}
              </div>
            </div>
          `).join("")
        : `<div class="muted">Nikt nie osiągnął jeszcze progu 30 000 zł wkładu.</div>`}

      <div class="muted" style="margin-top:8px">
        Rezygnacja z pensji nie zwiększa wypłat innych graczy. Kwota ponad minimalne 160 zł trafia do Funduszu.
      </div>
    `;
  }

  if (section === "goals") {
    const goal = payload.goal;

    if (!goal) {
      body = `<div class="card"><b>🎯 Cele gangu</b><div class="muted" style="margin-top:6px">Administrator nie ustawił jeszcze aktywnego celu.</div></div>`;
    } else {
      const current = Math.max(0,Number(goal.current) || 0);
      const target = Math.max(0,Number(goal.target) || 0);
      const percent = target > 0
        ? Math.max(0,Math.min(100,current/target*100))
        : 0;
      const unit = String(goal.unit || "").trim();
      const suffix = unit ? " " + esc(unit) : "";

      body = `
        <div class="card">
          <b>🎯 ${esc(goal.title)}</b>
          <div style="margin-top:7px">
            <b>${current.toLocaleString("pl-PL")}${suffix}</b>
            / ${target.toLocaleString("pl-PL")}${suffix}
          </div>
          <div class="bar"><div style="width:${percent}%"></div></div>
          <div class="muted">
            ${percent.toFixed(1).replace(".",",")}% ukończone
            ${current < target
              ? ` · brakuje ${(target-current).toLocaleString("pl-PL")}${suffix}`
              : " · ✅ cel osiągnięty"}
          </div>
        </div>`;
    }
  }

  if (section === "announcements") {
    const announcements =
      Array.isArray(payload.announcements)
        ? payload.announcements
        : [];

    body = announcements.length
      ? announcements.map(item => `
          <div class="card" style="${item.important ? "background:#fff2c7;border-color:#c3923f;" : ""}">
            <div style="display:flex;justify-content:space-between;gap:8px;margin-bottom:5px">
              <b>${item.important ? "📌 Ważne" : "📢 Ogłoszenie"}</b>
              <span class="muted">
                ${new Date(Number(item.createdAt)).toLocaleString("pl-PL",{day:"2-digit",month:"2-digit",hour:"2-digit",minute:"2-digit"})}
              </span>
            </div>
            <div style="white-space:pre-wrap">${esc(item.text)}</div>
          </div>
        `).join("")
      : `<div class="card"><b>📢 Ogłoszenia</b><div class="muted" style="margin-top:6px">Brak aktywnych ogłoszeń.</div></div>`;
  }

  wrap.innerHTML = nav + body;
  if (section === "polls") {
    renderTmGangPolls();
  }

  if (section === "settings") {
    renderTmPlayerIdentitySettings();
  }

  if (section === "company") {
    renderTmCompanySalarySelf(payload);
  }

  wrap.querySelectorAll("[data-gang-tab]").forEach(tab => {
    tab.onclick = () => {
      const target = tab.dataset.gangTab;
      if (target === "admin") {
        openAdmin();
        return;
      }
      renderGangSection(target);
    };
  });

  const refresh = wrap.querySelector("#paymentsRefresh");
  if (refresh) refresh.onclick = loadPayments;

  const logout = wrap.querySelector("#paymentsLogout");
  if (logout) logout.onclick = () => {
    setGangToken("");
    latestGangPayload = null;
    renderPaymentsLogin("Dostęp do modułu Gang na tym urządzeniu został usunięty.");
  };
}

function renderPaymentsData(payload) {
  latestGangPayload = payload;
  renderGangSection("payments");
}


async function loginPayments(
  event
) {

  event.preventDefault();

  if (!paymentsPanel) {
    return;
  }

  const password =
    paymentsPanel
      .querySelector(
        "#gangPassword"
      )
      .value;

  const status =
    paymentsPanel
      .querySelector(
        ".paymentsStatus"
      );

  if (!password) {

    status.textContent =
      "Wpisz hasło gangu.";

    return;
  }

  status.textContent =
    "Sprawdzanie hasła...";

  const nonce =
    makeGangNonce();

  try {

    await gmJsonRequest(
      "POST",
      BACKEND_URL,
      {
        action:
          "gangLogin",

        nonce,

        password
      }
    );

    let result = null;

    for (
      let i=0;
      i<12;
      i++
    ) {

      await new Promise(
        resolve =>
          setTimeout(
            resolve,
            500
          )
      );

      result =
        await gmJsonRequest(
          "GET",

          BACKEND_URL +
            "?action=gangLoginResult" +
            "&nonce=" +
            encodeURIComponent(
              nonce
            ) +
            "&_=" +
            Date.now()
        );

      if (
        !result ||
        !result.pending
      ) {
        break;
      }
    }

    if (
      !result ||
      result.pending
    ) {

      throw new Error(
        "Serwer nie zwrócił wyniku logowania."
      );
    }

    if (
      !result.ok ||
      !result.token
    ) {

      status.textContent =
        result.error ||
        "Nieprawidłowe hasło.";

      return;
    }

    setGangToken(
      result.token
    );

    await loadPayments();

  } catch (err) {

    status.textContent =
      err &&
      err.message

        ? err.message

        : "Nie udało się zalogować.";
  }
}


async function loadPayments() {

  if (!paymentsPanel) {
    return;
  }

  const token =
    gangToken();

  if (!token) {

    renderPaymentsLogin();

    return;
  }

  paymentsPanel
    .querySelector(
      ".paymentsWrap"
    )
    .innerHTML =
      `
        <div class="paymentsStatus">
          Pobieranie danych...
        </div>
      `;

  try {

    const payload =
      await gmJsonRequest(
        "GET",

        BACKEND_URL +
          "?action=payments" +
          "&token=" +
          encodeURIComponent(
            token
          ) +
          "&_=" +
          Date.now()
      );

    if (
      !payload ||
      !payload.ok
    ) {

      if (
        payload &&
        String(
          payload.error || ""
        )
          .toLowerCase()
          .includes(
            "brak dostępu"
          )
      ) {

        setGangToken("");

        renderPaymentsLogin(
          "Dostęp wygasł. Wpisz hasło ponownie."
        );

        return;
      }

      throw new Error(
        payload &&
        payload.error

          ? payload.error

          : "Nie udało się pobrać wpłat."
      );
    }

    renderPaymentsData(
      payload
    );

  } catch (err) {

    renderPaymentsLogin(
      err &&
      err.message

        ? err.message

        : "Nie udało się pobrać danych."
    );
  }
}


function openPayments() {

  if (adminPanel) {
    adminPanel.remove();
    adminPanel = null;
  }

  if (paymentsPanel) {

    paymentsPanel.remove();
    paymentsPanel = null;

    return;
  }

  if (optPanel) {
    optPanel.remove();
    optPanel = null;
  }

  if (mapPanel) {
    mapPanel.remove();
    mapPanel = null;
  }

  if (submitPanel) {
    submitPanel.remove();
    submitPanel = null;
  }

  if (!root) {
    mount();
  }

  paymentsPanel =
    document.createElement(
      "div"
    );

  paymentsPanel.className =
    "panel";

  paymentsPanel.innerHTML = `

    <div class="head">

      <span>
        👥 Gang
      </span>

      <span class="close">
        ×
      </span>

    </div>

    <div class="paymentsWrap">
    </div>
  `;

  root.appendChild(
    paymentsPanel
  );

  paymentsPanel
    .querySelector(
      ".close"
    )
    .onclick = () => {

      paymentsPanel.remove();
      paymentsPanel = null;
    };

  loadPayments();
}


// ============================================================
// PANEL ADMINISTRATORA — WERSJA TAMPERMONKEY
// ============================================================

function adminToken() {
  return localStorage.getItem(ADMIN_TOKEN_KEY) || "";
}

function setAdminToken(token) {
  if (token) {
    localStorage.setItem(ADMIN_TOKEN_KEY, token);
  } else {
    localStorage.removeItem(ADMIN_TOKEN_KEY);
  }
}

function adminQ(selector) {
  return adminPanel
    ? adminPanel.querySelector(selector)
    : null;
}

function adminSetStatus(message="") {
  const box = adminQ("#adminMainStatus");
  if (box) box.textContent = message;
}

function adminDate(value) {
  const m =
    /^(\d{4})-(\d{2})-(\d{2})$/
      .exec(String(value || ""));
  return m
    ? `${m[3]}.${m[2]}.${m[1]}`
    : (value || "—");
}

function adminMoney(value) {
  return Number(value || 0)
    .toLocaleString(
      "pl-PL",
      {
        minimumFractionDigits:0,
        maximumFractionDigits:2
      }
    );
}

function renderAdminLogin(message="") {
  if (!adminPanel) return;

  adminPanel.querySelector(".adminWrap").innerHTML = `
    <form id="adminLoginForm" class="paymentsLogin">
      <div>
        <b>🔐 Dostęp administratora</b>
      </div>

      <div class="muted">
        Zaloguj się hasłem administratora.
        Sesja jest zapamiętywana na tym urządzeniu.
      </div>

      <input
        id="adminPassword"
        type="password"
        autocomplete="current-password"
        placeholder="Hasło administratora"
        required>

      <button
        class="sendBtn"
        type="submit">
        🔓 Zaloguj
      </button>

      <div class="adminStatus">
        ${esc(message)}
      </div>
    </form>
  `;

  adminQ("#adminLoginForm").onsubmit =
    loginAdmin;
}

async function loginAdmin(event) {
  event.preventDefault();

  const password =
    adminQ("#adminPassword").value;

  const status =
    adminQ(".adminStatus");

  if (!password) {
    status.textContent =
      "Wpisz hasło administratora.";
    return;
  }

  const nonce =
    makeGangNonce();

  status.textContent =
    "Sprawdzanie hasła...";

  try {
    const start =
      await gmJsonRequest(
        "POST",
        BACKEND_URL,
        {
          action:"adminLogin",
          nonce,
          password
        }
      );

    if (start && start.ok === false) {
      throw new Error(
        start.error ||
        "Nie udało się rozpocząć logowania."
      );
    }

    let result = null;

    for (let i=0; i<12; i++) {
      await new Promise(
        resolve =>
          setTimeout(resolve,500)
      );

      result =
        await gmJsonRequest(
          "GET",
          BACKEND_URL +
            "?action=adminLoginResult" +
            "&nonce=" +
            encodeURIComponent(nonce) +
            "&_=" +
            Date.now()
        );

      if (
        !result ||
        !result.pending
      ) {
        break;
      }
    }

    if (!result || result.pending) {
      throw new Error(
        "Serwer nie zwrócił wyniku logowania."
      );
    }

    if (!result.ok || !result.token) {
      status.textContent =
        result.error ||
        "Nieprawidłowe hasło administratora.";
      return;
    }

    setAdminToken(result.token);
    renderAdminHome();
    await checkAdminToken();

  } catch (err) {
    status.textContent =
      err && err.message
        ? err.message
        : "Nie udało się zalogować.";
  }
}

function renderAdminHome() {
  if (!adminPanel) return;

  adminPanel.querySelector(".adminWrap").innerHTML = `
    <div class="paymentsTop">
      <div class="paymentsMeta">
        <b>✅ Dostęp administratora aktywny</b>
        <div id="adminMainStatus" class="muted"></div>
      </div>

      <div class="paymentsActions">
        <button id="adminRefreshAll">
          ↻ Odśwież
        </button>

        <button id="adminLogout">
          🔒 Wyloguj
        </button>
      </div>
    </div>

    <div class="adminTabs">
      <button
        data-admin-tab="payments"
        class="active">
        💰 Wpłaty
      </button>

      <button
        data-admin-tab="submissions">
        📋 Zgłoszenia
      </button>

      <button
        data-admin-tab="players">
        👥 Gracze
      </button>

      <button data-admin-tab="reservations">
        🔒 Rezerwacje
      </button>

      <button data-admin-tab="goal">
        🎯 Cel
      </button>

      <button data-admin-tab="announcements">
        📢 Ogłoszenia
      </button>
    </div>

    <div id="adminSection"></div>
  `;

  adminQ("#adminLogout").onclick = () => {
    setAdminToken("");
    renderAdminLogin(
      "Wylogowano administratora."
    );
  };

  adminQ("#adminRefreshAll").onclick = () => {
    const active =
      adminQ("[data-admin-tab].active");
    loadAdminTab(
      active
        ? active.dataset.adminTab
        : "payments"
    );
  };

  adminPanel
    .querySelectorAll("[data-admin-tab]")
    .forEach(button => {
      button.onclick = () => {
        adminPanel
          .querySelectorAll(
            "[data-admin-tab]"
          )
          .forEach(
            x =>
              x.classList.toggle(
                "active",
                x === button
              )
          );

        loadAdminTab(
          button.dataset.adminTab
        );
      };
    });

  loadAdminTab("payments");
}

async function checkAdminToken() {
  const token =
    adminToken();

  if (!token) {
    renderAdminLogin();
    return false;
  }

  try {
    const result =
      await gmJsonRequest(
        "GET",
        BACKEND_URL +
          "?action=adminTest" +
          "&token=" +
          encodeURIComponent(token) +
          "&_=" +
          Date.now()
      );

    if (!result || !result.ok) {
      setAdminToken("");
      renderAdminLogin(
        "Sesja administratora wygasła."
      );
      return false;
    }

    return true;

  } catch (err) {
    adminSetStatus(
      err && err.message
        ? err.message
        : "Nie udało się sprawdzić dostępu."
    );
    return false;
  }
}

function loadAdminTab(tab) {
  if (!adminPanel) return;

  if (tab === "submissions") {
    renderAdminSubmissions();
    return;
  }

  if (tab === "players") {
    renderAdminPlayers();
    return;
  }

  if (tab === "reservations") {
    renderAdminReservations();
    return;
  }

  if (tab === "goal") {
    renderAdminGoal();
    return;
  }

  if (tab === "announcements") {
    renderAdminAnnouncements();
    return;
  }

  renderAdminPayments();
}

async function adminGangToolsData() {
  return gmJsonRequest(
    "GET",
    BACKEND_URL +
      "?action=adminGangTools" +
      "&token=" +
      encodeURIComponent(adminToken()) +
      "&_=" +
      Date.now()
  );
}

function tmSetBusy(button,status,text) {
  if (button) {
    button.disabled = true;
    button.dataset.originalText =
      button.dataset.originalText ||
      button.innerHTML;
    button.innerHTML = `⏳ ${esc(text)}`;
  }

  if (status) {
    status.textContent = `⏳ ${text}`;
  }
}

function tmClearBusy(button) {
  if (!button) return;

  button.disabled = false;

  if (button.dataset.originalText) {
    button.innerHTML = button.dataset.originalText;
    delete button.dataset.originalText;
  }
}

async function adminGangPost(action,data={}) {
  return gmJsonRequest(
    "POST",
    BACKEND_URL,
    {
      action,
      token:adminToken(),
      ...data
    }
  );
}

function adminRecipeText(item) {
  return [
    item.baza,
    item.drozdze,
    item.woda,
    "P" + (Number(item.program) || 0)
  ].filter(Boolean).join(" · ");
}

async function renderAdminReservations() {
  const section = adminQ("#adminSection");
  if (!section) return;

  section.innerHTML =
    `<div class="adminStatus">Pobieranie rezerwacji...</div>`;

  try {
    const payload = await adminGangToolsData();

    if (!payload || !payload.ok) {
      throw new Error(payload && payload.error || "Nie udało się pobrać rezerwacji.");
    }

    const list = Array.isArray(payload.reservations) ? payload.reservations : [];

    section.innerHTML = `
      <div style="display:flex;justify-content:space-between;gap:8px;align-items:center;margin-bottom:8px">
        <b>🔒 Aktywne rezerwacje (${list.length})</b>
        <button id="adminClearAllReservations">🧹 Wyczyść wszystkie</button>
      </div>

      ${list.length
        ? list.map(item => `
            <div class="card">
              <b>${esc(item.nick)}</b>
              <div class="muted">${esc(adminRecipeText(item))}</div>
              <div class="muted">
                Do ${new Date(Number(item.expiresAt)).toLocaleTimeString("pl-PL",{hour:"2-digit",minute:"2-digit"})}
              </div>
              <button
                data-clear-reservation="${esc(item.recipeKey)}"
                style="margin-top:6px">
                🗑 Zwolnij
              </button>
            </div>
          `).join("")
        : `<div class="muted">Brak aktywnych rezerwacji.</div>`}
    `;

    const clearAll = adminQ("#adminClearAllReservations");
    if (clearAll) {
      clearAll.onclick = async () => {
        if (!confirm("Wyczyścić WSZYSTKIE aktywne rezerwacje?")) return;
        await adminGangPost("adminClearAllReservations");
        renderAdminReservations();
        fetchApproved();
      };
    }

    section
      .querySelectorAll("[data-clear-reservation]")
      .forEach(button => {
        button.onclick = async () => {
          if (!confirm("Usunąć tę rezerwację?")) return;
          await adminGangPost(
            "adminClearReservation",
            {recipeKey:button.dataset.clearReservation}
          );
          renderAdminReservations();
          fetchApproved();
        };
      });

  } catch (err) {
    section.innerHTML =
      `<div class="adminStatus">${esc(err.message || "Błąd.")}</div>`;
  }
}

async function renderAdminGoal() {
  const section = adminQ("#adminSection");
  if (!section) return;

  const payload = await adminGangToolsData();
  const goal = payload && payload.goal;

  section.innerHTML = `
    <div class="card">
      <b>🎯 Cel gangu</b>

      <form id="adminGoalForm" class="form" style="margin-top:8px">
        <label>
          Tytuł
          <input id="adminGoalTitle" type="text" maxlength="120" value="${esc(goal ? goal.title : "")}" placeholder="np. Budowa spółki">
        </label>

        <label>
          Aktualnie
          <input id="adminGoalCurrent" type="text" inputmode="decimal" value="${goal ? esc(String(goal.current)) : ""}">
        </label>

        <label>
          Cel
          <input id="adminGoalTarget" type="text" inputmode="decimal" value="${goal ? esc(String(goal.target)) : ""}">
        </label>

        <label>
          Jednostka
          <input id="adminGoalUnit" type="text" maxlength="20" value="${esc(goal ? goal.unit || "" : "")}" placeholder="np. zł">
        </label>

        <button type="submit" class="sendBtn">💾 Zapisz cel</button>
        <button id="adminGoalDelete" type="button" style="background:#fff0f0;border-color:#d9a4a4;color:#8a2f2f;font-weight:700">🗑 Usuń cel</button>

        <div id="adminGoalStatus" class="submitStatus"></div>
      </form>
    </div>
  `;

  adminQ("#adminGoalForm").onsubmit = async event => {
    event.preventDefault();

    const button =
      adminQ("#adminGoalForm button[type='submit']");
    const status =
      adminQ("#adminGoalStatus");

    const current = Number(
      adminQ("#adminGoalCurrent").value.replace(/\s+/g,"").replace(",",".")
    );
    const target = Number(
      adminQ("#adminGoalTarget").value.replace(/\s+/g,"").replace(",",".")
    );

    tmSetBusy(
      button,
      status,
      "Zapisywanie celu..."
    );

    try {
      const result = await adminGangPost(
        "adminSaveGoal",
        {
          title:adminQ("#adminGoalTitle").value.trim(),
          current,
          target,
          unit:adminQ("#adminGoalUnit").value.trim()
        }
      );

      status.textContent =
        result && result.ok
          ? "✅ Cel zapisany."
          : "⚠️ " + (result && result.error || "Nie udało się zapisać.");

    } catch (err) {
      status.textContent =
        "⚠️ " + (err.message || "Nie udało się zapisać.");
    } finally {
      tmClearBusy(button);
    }
  };

  adminQ("#adminGoalDelete").onclick = async () => {
    if (!confirm("Usunąć cel gangu?")) return;
    await adminGangPost("adminDeleteGoal");
    await renderAdminGoal();
    const status = adminQ("#adminGoalStatus");
    if (status) status.textContent = "✅ Cel został usunięty.";
  };
}

async function renderAdminAnnouncements() {
  const section = adminQ("#adminSection");
  if (!section) return;

  const payload = await adminGangToolsData();
  const list = Array.isArray(payload && payload.announcements)
    ? payload.announcements
    : [];

  section.innerHTML = `
    <div class="card">
      <b>📢 Dodaj ogłoszenie</b>

      <form id="adminAnnouncementForm" class="form" style="margin-top:8px">
        <textarea id="adminAnnouncementText" rows="4" maxlength="1200" placeholder="Treść ogłoszenia..."></textarea>

        <label style="display:flex;gap:6px;align-items:center">
          <input id="adminAnnouncementImportant" type="checkbox" style="width:auto">
          📌 Ważne
        </label>

        <button type="submit" class="sendBtn">➕ Dodaj ogłoszenie</button>
        <div id="adminAnnouncementStatus" class="submitStatus"></div>
      </form>
    </div>

    ${list.length
      ? list.map(item => `
          <div class="card" style="${item.important ? "background:#fff2c7;border-color:#c3923f" : ""}">
            <b>${item.important ? "📌 Ważne" : "📢 Ogłoszenie"}</b>
            <div class="muted">
              ${new Date(Number(item.createdAt)).toLocaleString("pl-PL")}
            </div>
            <div style="white-space:pre-wrap;margin:7px 0">${esc(item.text)}</div>

            <button
              data-toggle-announcement="${esc(item.id)}"
              data-important="${item.important ? "1" : "0"}">
              ${item.important ? "📌 Odepnij" : "📌 Oznacz Ważne"}
            </button>

            <button data-delete-announcement="${esc(item.id)}">
              🗑 Usuń
            </button>
          </div>
        `).join("")
      : `<div class="muted">Brak ogłoszeń.</div>`}
  `;

  adminQ("#adminAnnouncementForm").onsubmit = async event => {
    event.preventDefault();

    const text = adminQ("#adminAnnouncementText").value.trim();
    const button =
      adminQ("#adminAnnouncementForm button[type='submit']");
    const status =
      adminQ("#adminAnnouncementStatus");

    if (!text) {
      status.textContent = "Wpisz treść ogłoszenia.";
      return;
    }

    tmSetBusy(
      button,
      status,
      "Dodawanie ogłoszenia..."
    );

    try {
      await adminGangPost(
        "adminAddAnnouncement",
        {
          text,
          important:adminQ("#adminAnnouncementImportant").checked
        }
      );

      status.textContent =
        "✅ Ogłoszenie dodane.";

      setTimeout(
        () => renderAdminAnnouncements(),
        250
      );

    } catch (err) {
      status.textContent =
        "⚠️ " + (err.message || "Nie udało się dodać ogłoszenia.");
    } finally {
      tmClearBusy(button);
    }
  };

  section
    .querySelectorAll("[data-toggle-announcement]")
    .forEach(button => {
      button.onclick = async () => {
        await adminGangPost(
          "adminSetAnnouncementImportant",
          {
            id:button.dataset.toggleAnnouncement,
            important:button.dataset.important !== "1"
          }
        );
        renderAdminAnnouncements();
      };
    });

  section
    .querySelectorAll("[data-delete-announcement]")
    .forEach(button => {
      button.onclick = async () => {
        if (!confirm("Usunąć to ogłoszenie?")) return;
        await adminGangPost(
          "adminDeleteAnnouncement",
          {id:button.dataset.deleteAnnouncement}
        );
        renderAdminAnnouncements();
      };
    });
}

async function renderAdminSubmissions() {
  const section =
    adminQ("#adminSection");

  if (!section) return;

  section.innerHTML = `
    <div class="adminStatus">
      Pobieranie zgłoszeń...
    </div>
  `;

  try {
    const payload =
      await gmJsonRequest(
        "GET",
        BACKEND_URL +
          "?action=adminSubmissions" +
          "&token=" +
          encodeURIComponent(
            adminToken()
          ) +
          "&_=" +
          Date.now()
      );

    if (!payload || !payload.ok) {
      throw new Error(
        payload && payload.error
          ? payload.error
          : "Nie udało się pobrać zgłoszeń."
      );
    }

    const items =
      Array.isArray(
        payload.submissions
      )
        ? payload.submissions
        : [];

    section.innerHTML = `
      <div class="adminBox">
        Oczekujące zgłoszenia:
        <b>${items.length}</b>
      </div>

      ${
        items.length
          ? items.map(item => `
              <div
                class="adminBox"
                data-submission-row="${item.row}">

                <div style="
                  display:flex;
                  justify-content:space-between;
                  gap:8px;
                ">
                  <strong>
                    ${esc(item.nick)}
                  </strong>

                  <strong>
                    ${adminMoney(item.litry)} l
                  </strong>
                </div>

                <div style="
                  margin-top:4px;
                  font-size:12px;
                ">
                  ${esc(displayName(item.baza))}
                  ·
                  ${esc(displayName(item.drozdze))}
                  ·
                  ${esc(displayName(item.woda))}
                  ·
                  P${Number(item.program) || 0}
                </div>

                <div class="muted"
                  style="margin-top:3px">
                  ${esc(item.date || "")}
                </div>

                ${
                  item.uwagi
                    ? `
                        <div class="muted"
                          style="margin-top:5px">
                          💬 ${esc(item.uwagi)}
                        </div>
                      `
                    : ""
                }

                ${
                  item.duplicate
                    ? `<div class="muted" style="margin-top:6px">♻️ Identyczny wynik ${adminMoney(item.knownLiters)} l jest już zatwierdzony.</div>`
                    : item.correction
                      ? `<div class="muted" style="margin-top:6px">⚠️ Znany wynik: <b>${adminMoney(item.knownLiters)} l</b> · nowe zgłoszenie: <b>${adminMoney(item.litry)} l</b>.</div>`
                      : ""
                }

                <div style="
                  display:flex;
                  gap:6px;
                  margin-top:8px;
                ">
                  <button
                    class="adminGood"
                    style="flex:1"
                    data-submission-action="${item.duplicate ? "DUPLIKAT" : "ZATWIERDZONE"}"
                    data-correction="${item.correction ? "1" : "0"}"
                    data-row="${item.row}">
                    ${
                      item.duplicate
                        ? "♻️ Oznacz duplikat"
                        : item.correction
                          ? "✅ Zatwierdź korektę"
                          : "✅ Zatwierdź"
                    }
                  </button>

                  <button
                    class="adminDanger"
                    style="flex:1"
                    data-submission-action="ODRZUCONE"
                    data-row="${item.row}">
                    ❌ Odrzuć
                  </button>
                </div>
              </div>
            `).join("")
          : `
              <div class="adminBox adminGood">
                ✅ Brak zgłoszeń oczekujących na weryfikację.
              </div>
            `
      }

      <div id="adminSubmissionsStatus"
        class="adminStatus"></div>
    `;

    section
      .querySelectorAll(
        "[data-submission-action]"
      )
      .forEach(button => {
        button.onclick = () =>
          changeSubmissionStatus(
            Number(button.dataset.row),
            button.dataset.submissionAction,
            button.dataset.correction === "1"
          );
      });

  } catch (err) {
    section.innerHTML = `
      <div class="adminBox adminDanger">
        ${esc(
          err && err.message
            ? err.message
            : "Nie udało się pobrać zgłoszeń."
        )}
      </div>
    `;
  }
}

async function changeSubmissionStatus(
  row,
  status,
  correction=false
) {
  const approve =
    status === "ZATWIERDZONE";
  const duplicate =
    status === "DUPLIKAT";

  if (
    !window.confirm(
      duplicate
        ? "Oznaczyć to zgłoszenie jako duplikat?"
        : approve
          ? (correction
              ? "Zatwierdzić ten wynik jako korektę istniejącej receptury?"
              : "Zatwierdzić tę recepturę?")
          : "Odrzucić tę recepturę?"
    )
  ) {
    return;
  }

  const box =
    adminQ(
      "#adminSubmissionsStatus"
    );

  if (box) {
    box.textContent =
      approve
        ? "Zatwierdzanie..."
        : "Odrzucanie...";
  }

  try {
    const result =
      await gmJsonRequest(
        "POST",
        BACKEND_URL,
        {
          action:
            "adminSetSubmissionStatus",
          token:adminToken(),
          row,
          status,
          correction:Boolean(correction)
        }
      );

    if (!result || !result.ok) {
      throw new Error(
        result && result.error
          ? result.error
          : "Nie udało się zmienić statusu."
      );
    }

    if (approve) {
      fetchApproved();
    }

    await renderAdminSubmissions();

  } catch (err) {
    if (box) {
      box.textContent =
        err && err.message
          ? err.message
          : "Nie udało się zmienić statusu.";
    }
  }
}

async function renderAdminPlayers() {
  const section =
    adminQ("#adminSection");

  if (!section) return;

  section.innerHTML = `
    <div class="adminBox">
      <form id="adminAddPlayerForm"
        class="form">
        <label>
          Nick nowego gracza
          <input
            id="adminPlayerNick"
            type="text"
            maxlength="50"
            placeholder="Nick gracza"
            required>
        </label>

        <button class="sendBtn"
          type="submit">
          ➕ Dodaj gracza
        </button>
      </form>
    </div>

    <div id="adminPlayersStatus"
      class="adminStatus">
      Pobieranie graczy...
    </div>

    <div id="adminPlayersList"></div>
  `;

  adminQ(
    "#adminAddPlayerForm"
  ).onsubmit =
    addAdminPlayer;

  await loadAdminPlayersList();
}

async function loadAdminPlayersList() {
  const list =
    adminQ("#adminPlayersList");

  const status =
    adminQ("#adminPlayersStatus");

  if (!list || !status) return;

  try {
    const payload =
      await gmJsonRequest(
        "GET",
        BACKEND_URL +
          "?action=adminPaymentsStatus" +
          "&token=" +
          encodeURIComponent(
            adminToken()
          ) +
          "&_=" +
          Date.now()
      );

    if (!payload || !payload.ok) {
      throw new Error(
        payload && payload.error
          ? payload.error
          : "Nie udało się pobrać graczy."
      );
    }

    const players =
      Array.isArray(payload.players)
        ? payload.players
        : [];

    list.innerHTML =
      players.length
        ? players.map(player => `
            <div class="adminPlayer">
              <strong>
                ${esc(player.nick)}
              </strong>

              <button
                class="adminDanger"
                data-delete-player="${esc(player.nick)}">
                🗑 Usuń
              </button>
            </div>
          `).join("")
        : `
            <div class="adminBox">
              Brak graczy.
            </div>
          `;

    list
      .querySelectorAll(
        "[data-delete-player]"
      )
      .forEach(button => {
        button.onclick = () =>
          deleteAdminPlayer(
            button.dataset
              .deletePlayer
          );
      });

    status.textContent = "";

  } catch (err) {
    status.textContent =
      err && err.message
        ? err.message
        : "Nie udało się pobrać graczy.";
  }
}

async function addAdminPlayer(event) {
  event.preventDefault();

  const input =
    adminQ("#adminPlayerNick");

  const status =
    adminQ("#adminPlayersStatus");

  const nick =
    String(
      input ? input.value : ""
    ).trim();

  if (!nick) {
    status.textContent =
      "Podaj nick gracza.";
    return;
  }

  status.textContent =
    "Dodawanie gracza...";

  try {
    const result =
      await gmJsonRequest(
        "POST",
        BACKEND_URL,
        {
          action:"adminAddPlayer",
          token:adminToken(),
          nick
        }
      );

    if (!result || !result.ok) {
      throw new Error(
        result && result.error
          ? result.error
          : "Nie udało się dodać gracza."
      );
    }

    input.value = "";
    status.textContent =
      result.message ||
      `✅ Dodano gracza ${nick}.`;

    await loadAdminPlayersList();

  } catch (err) {
    status.textContent =
      err && err.message
        ? err.message
        : "Nie udało się dodać gracza.";
  }
}

async function deleteAdminPlayer(nick) {
  const status =
    adminQ("#adminPlayersStatus");

  const first =
    window.confirm(
      `Czy na pewno chcesz usunąć gracza "${nick}"?`
    );

  if (!first) return;

  const confirmation =
    window.prompt(
      `UWAGA!\n\n` +
      `Usunięcie gracza "${nick}" usunie jego bieżącą historię z tabeli.\n\n` +
      `Aby potwierdzić, wpisz dokładnie nick gracza:`
    );

  if (confirmation === null) return;

  if (
    confirmation.trim()
      .toLocaleLowerCase("pl-PL") !==
    nick.trim()
      .toLocaleLowerCase("pl-PL")
  ) {
    status.textContent =
      "Usuwanie anulowane — nick potwierdzający jest nieprawidłowy.";
    return;
  }

  status.textContent =
    `Usuwanie gracza ${nick}...`;

  try {
    const result =
      await gmJsonRequest(
        "POST",
        BACKEND_URL,
        {
          action:"adminDeletePlayer",
          token:adminToken(),
          nick,
          confirmationNick:
            confirmation.trim()
        }
      );

    if (!result || !result.ok) {
      throw new Error(
        result && result.error
          ? result.error
          : "Nie udało się usunąć gracza."
      );
    }

    status.textContent =
      result.message ||
      `✅ Usunięto gracza ${nick}.`;

    await loadAdminPlayersList();

  } catch (err) {
    status.textContent =
      err && err.message
        ? err.message
        : "Nie udało się usunąć gracza.";
  }
}

function adminReportDate(value) {

  const match =
    /^(\d{4})-(\d{2})-(\d{2})$/
      .exec(
        String(value || "")
      );

  if (!match) {
    return String(value || "");
  }

  return (
    match[3] +
    "." +
    match[2] +
    "." +
    match[1]
  );
}


function adminReportAmount(value) {

  const number =
    Number(value);

  if (!Number.isFinite(number)) {
    return "0";
  }

  const rounded =
    Math.round(number);

  const formatted =
    Math.abs(rounded)
      .toLocaleString(
        "pl-PL",
        {
          maximumFractionDigits:0
        }
      );

  if (number > 0) {
    return "+" + formatted;
  }

  if (number < 0) {
    return "-" + formatted;
  }

  return "0";
}


function adminReportNick(value) {

  const nick =
    String(value || "");

  const width = 22;

  if (nick.length >= width) {
    return nick.slice(0,width);
  }

  return (
    nick +
    " ".repeat(
      width - nick.length
    )
  );
}


function buildAdminDailyReport(payload) {

  const players =
    Array.isArray(
      payload &&
      payload.players
    )
      ? payload.players
      : [];

  const date =
    adminReportDate(
      payload &&
      payload.saldoDate
    );

  const rows =
    players
      .map(
        player =>
          adminReportNick(
            player.nick
          ) +
          adminReportAmount(
            player.saldo
          )
      )
      .join("\n");

  return (
`📊 Dzienne podsumowanie wpłat — ${date}

🔴 wartość ujemna — dług do nadrobienia
🟢 0 — wszystko na bieżąco
🔵 wartość dodatnia — wkład w firmę

Każdego dnia naliczany jest wymóg 2 000 zł.
Nadpłata przechodzi na kolejne dni i jednocześnie stanowi wkład w firmę.

🏢 Od 30 000 zł wkładu gracz kwalifikuje się do udziału w spółce.

\`\`\`
${rows}
\`\`\`

🔎 MenelWars Tools
https://roq665.github.io/Menelwars-Tools/
(Hasło do wpłat: 6N4X38)

Dziękuję wszystkim za regularne wpłaty i dodatkowe wsparcie. ❤️`
  );
}


async function copyAdminDailyReport() {

  const status =
    adminQ(
      "#adminCopyDailyReportStatus"
    );


  if (!adminPaymentsSnapshot) {

    if (status) {
      status.textContent =
        "Najpierw pobierz dane wpłat.";
    }

    return;
  }


  const report =
    buildAdminDailyReport(
      adminPaymentsSnapshot
    );


  try {

    await navigator.clipboard
      .writeText(
        report
      );


    if (status) {

      status.textContent =
        "✅ Raport skopiowany do schowka.";

      setTimeout(
        () => {

          if (status) {
            status.textContent = "";
          }

        },
        2000
      );
    }


  } catch (err) {

    if (status) {
      status.textContent =
        "Nie udało się skopiować raportu.";
    }
  }
}


function companyMoney(value) {

  return Number(value || 0)
    .toLocaleString(
      "pl-PL",
      {
        minimumFractionDigits:0,
        maximumFractionDigits:2
      }
    );
}


function companyPlan(
  payload,
  income
) {

  const players =
    Array.isArray(
      payload &&
      payload.players
    )
      ? payload.players
      : [];

  const safeIncome =
    Math.max(
      0,
      Number(income) || 0
    );

  const eligible =
    players
      .map(player => ({
        nick: player.nick,
        contribution:
          Math.max(
            0,
            Number(
              player.contribution
            ) || 0
          )
      }))
      .filter(
        player =>
          player.contribution >=
          COMPANY_MIN_CONTRIBUTION
      );

  const eligibleContribution =
    eligible.reduce(
      (sum, player) =>
        sum +
        player.contribution,
      0
    );

  const targetSalaryBudget =
    safeIncome *
    COMPANY_SALARY_RATIO;

  const baseTotal =
    eligible.length *
    COMPANY_BASE_SALARY;

  // Budżet 80/20 wynika z dochodu spółki
  // niezależnie od liczby zatrudnionych.
  const salaryBudget =
    targetSalaryBudget;

  const developmentBudget =
    safeIncome *
    (1 - COMPANY_SALARY_RATIO);

  const bonusPool =
    Math.max(
      0,
      salaryBudget -
      baseTotal
    );

  const rows =
    eligible.map(player => {

      const share =
        eligibleContribution > 0
          ? player.contribution /
            eligibleContribution
          : 0;

      return {
        ...player,
        share,
        salary:
          COMPANY_BASE_SALARY +
          bonusPool * share
      };
    });

  const actualSalaryTotal =
    rows.reduce(
      (sum, player) =>
        sum +
        Number(player.salary || 0),
      0
    );

  return {
    income:safeIncome,
    salaryBudget,
    developmentBudget,
    actualSalaryTotal,
    baseTotal,
    bonusPool,
    eligibleContribution,
    rows
  };
}


function renderAdminCompanyPlan(
  payload =
    adminPaymentsSnapshot
) {

  const result =
    adminQ(
      "#adminCompanyResult"
    );

  const input =
    adminQ(
      "#adminCompanyIncome"
    );

  if (
    !result ||
    !input ||
    !payload
  ) {
    return;
  }

  const income =
    Math.max(
      0,
      Number(
        payload.companyIncome ??
        String(
          input.value || ""
        )
          .replace(/\s+/g,"")
          .replace(",",".")
      ) || 0
    );

  input.value =
    String(income);

  const plan =
    companyPlan(
      payload,
      income
    );

  const totalContribution =
    (Array.isArray(payload.players)
      ? payload.players
      : []
    ).reduce(
      (sum, player) =>
        sum +
        Math.max(
          0,
          Number(
            player.contribution
          ) || 0
        ),
      0
    );

  const rows =
    plan.rows.length
      ? plan.rows
          .map(player => `
            <div class="miniRow">
              <span>
                <b>${esc(player.nick)}</b>
                <span class="muted">
                  · ${companyMoney(
                    player.contribution
                  )} zł
                </span>
              </span>

              <span style="text-align:right">
                <b>
                  ${(
                    player.share * 100
                  )
                    .toFixed(2)
                    .replace(".",",")}%
                </b>
                ·
                <b>
                  ${companyMoney(
                    player.salary
                  )} zł
                </b>
              </span>
            </div>
          `)
          .join("")
      : `
          <div class="muted">
            Nikt nie osiągnął jeszcze progu
            ${companyMoney(
              COMPANY_MIN_CONTRIBUTION
            )} zł.
          </div>
        `;

  result.innerHTML = `
    <div class="adminGrid">
      <div class="adminBox">
        <span class="adminLabel">
          Łączny wkład
        </span>
        <strong>
          ${companyMoney(
            totalContribution
          )} zł
        </strong>
      </div>

      <div class="adminBox">
        <span class="adminLabel">
          Kwalifikowani
        </span>
        <strong>
          ${plan.rows.length}
        </strong>
      </div>

      <div class="adminBox">
        <span class="adminLabel">
          Budżet pensji 50%
        </span>
        <strong>
          ${companyMoney(
            plan.salaryBudget
          )} zł
        </strong>
      </div>
    </div>

    <div class="adminBox">
      <span class="adminLabel">
        Do wypłaty
      </span>
      <strong>
        ${companyMoney(
          plan.actualSalaryTotal
        )} zł
      </strong>
    </div>

    <div class="adminBox">
      <span class="adminLabel">
        Rozwój 50%
      </span>
      <strong>
        ${companyMoney(
          plan.developmentBudget
        )} zł
      </strong>
    </div>

    <div class="muted"
      style="margin-bottom:6px">
      Próg:
      <b>
        ${companyMoney(
          COMPANY_MIN_CONTRIBUTION
        )} zł
      </b>.
      Pensja = 160 zł +
      udział w pozostałej puli 50%.
    </div>

    ${rows}
  `;
}

function renderAdminPayments() {
  const section =
    adminQ("#adminSection");

  if (!section) return;

  section.innerHTML = `
    <div id="adminPaymentsMeta"></div>

    <div class="adminBox">

      <button
        id="adminCopyDailyReport"
        class="sendBtn"
        type="button"
        style="margin-bottom:10px"
      >
        📋 Kopiuj raport dzienny
      </button>

      <div
        id="adminCopyDailyReportStatus"
        class="adminStatus"
        style="margin-bottom:6px">
      </div>

      <div
        class="adminBox"
        style="margin:8px 0"
      >
        <b>
          🏢 Spółka gangowa
        </b>

        <div
          class="muted"
          style="margin:4px 0 7px"
        >
          Próg udziału: 30 000 zł.
          50% dochodu na pensje,
          50% na rozwój.
        </div>

        <label
          style="
            display:grid;
            gap:4px;
            margin-bottom:7px;
          "
        >
          <b>Dzienny dochód spółki</b>

          <input
            id="adminCompanyIncome"
            type="text"
            inputmode="decimal"
            style="
              width:100%;
              border:1px solid #ccb797;
              border-radius:7px;
              background:#fffdf8;
              color:#332a20;
              padding:8px 9px;
            "
          >
        </label>

        <div id="adminCompanyResult"></div>
      </div>

      <b>📋 Wklej ranking wpłat</b>

      <div class="muted"
        style="margin:4px 0 7px">
        Najpierw sprawdź raport.
        Bieżący dzień jest ignorowany.
      </div>

      <textarea
        id="adminPaymentsReport"
        class="adminTextarea"
        placeholder="Wklej pełny ranking łącznych wpłat..."></textarea>

      <button
        id="adminPaymentsPreview"
        class="sendBtn"
        style="margin-top:7px">
        🔍 Sprawdź dane
      </button>

      <button
        id="adminPaymentsImport"
        class="sendBtn"
        style="margin-top:7px"
        hidden>
        ✅ Wprowadź dane
      </button>

      <div
        id="adminPaymentsStatus"
        class="adminStatus"
        style="margin-top:7px">
      </div>

      <div id="adminPaymentsPreviewResult"></div>
    </div>
  `;

  adminQ(
    "#adminPaymentsPreview"
  ).onclick =
    previewAdminPayments;

  adminQ(
    "#adminPaymentsImport"
  ).onclick =
    importAdminPayments;

  adminQ(
    "#adminCopyDailyReport"
  ).onclick =
    copyAdminDailyReport;

  const companyIncome =
    adminQ(
      "#adminCompanyIncome"
    );

  if (companyIncome) {

    companyIncome.value =
      "25000";

    companyIncome.onchange =
      async () => {

        const income =
          Math.max(
            0,
            Number(
              String(
                companyIncome.value || ""
              )
                .replace(/\s+/g,"")
                .replace(",",".")
            ) || 0
          );

        companyIncome.disabled = true;

        try {

          const query =
            new URLSearchParams({
              action:
                "adminSetCompanyIncome",
              token:
                adminToken(),
              income:
                String(income),
              _:
                String(Date.now())
            });

          const payload =
            await gmJsonRequest(
              "GET",
              BACKEND_URL +
              "?" +
              query.toString()
            );

          if (!payload || !payload.ok) {
            throw new Error(
              payload && payload.error
                ? payload.error
                : "Nie udało się zapisać dochodu spółki."
            );
          }

          await loadAdminPaymentsMeta();

        } catch (err) {

          const status =
            adminQ(
              "#adminPaymentsStatus"
            );

          if (status) {
            status.textContent =
              err && err.message
                ? err.message
                : "Nie udało się zapisać dochodu spółki.";
          }

        } finally {
          companyIncome.disabled = false;
        }
      };
  }

  loadAdminPaymentsMeta();
}

async function loadAdminPaymentsMeta() {
  const box =
    adminQ("#adminPaymentsMeta");

  if (!box) return;

  box.innerHTML = `
    <div class="adminStatus">
      Pobieranie statusu wpłat...
    </div>
  `;

  try {
    const payload =
      await gmJsonRequest(
        "GET",
        BACKEND_URL +
          "?action=adminPaymentsStatus" +
          "&token=" +
          encodeURIComponent(
            adminToken()
          ) +
          "&_=" +
          Date.now()
      );

    if (!payload || !payload.ok) {
      throw new Error(
        payload && payload.error
          ? payload.error
          : "Nie udało się pobrać statusu wpłat."
      );
    }

    adminPaymentsSnapshot = payload;

    renderAdminCompanyPlan(
      payload
    );

    const blocked =
      Boolean(
        payload.writeProtection &&
        payload.writeProtection.blocked
      );

    box.innerHTML = `
      <div class="adminGrid">
        <div class="adminBox">
          <span class="adminLabel">
            Snapshot rankingu do
          </span>
          <strong>
            ${esc(adminDate(payload.saldoDate))}
          </strong>
        </div>

        <div class="adminBox">
          <span class="adminLabel">
            Ostatnia aktualizacja
          </span>
          <strong>
            ${esc(adminDate(payload.lastClose))}
          </strong>
        </div>

        <div class="adminBox">
          <span class="adminLabel">
            Graczy
          </span>
          <strong>
            ${Number(payload.count) || 0}
          </strong>
        </div>
      </div>

      <div class="adminBox ${blocked ? "" : "adminGood"}">
        ${
          blocked
            ? `
                🌙 <b>Okres ochronny 00:00–04:00</b>
                <div class="muted">
                  Sprawdzanie działa, zapis jest zablokowany.
                </div>
              `
            : `
                ✅ <b>Wprowadzanie danych dostępne</b>
              `
        }
      </div>
    `;

  } catch (err) {
    box.innerHTML = `
      <div class="adminBox adminDanger">
        ${esc(
          err && err.message
            ? err.message
            : "Nie udało się pobrać statusu."
        )}
      </div>
    `;
  }
}

function previewPlayerRows(day) {
  const players =
    Array.isArray(day.players)
      ? day.players
      : [];

  const groups = [
    ["missing","🔴 Braki"],
    ["freshman","🟦 Świeżak"],
    ["zero","🟡 Nie wpłacili"],
    ["paid","✅ Wpłacili"]
  ];

  return groups.map(([status,label]) => {
    const list =
      players.filter(
        p => p.status === status
      );

    if (!list.length) return "";

    return `
      <div style="margin-top:6px">
        <b>${label} (${list.length})</b>

        ${
          list.map(player => `
            <div class="miniRow">
              <span>
                ${esc(player.nick)}
              </span>

              <strong>
                ${
                  status === "paid"
                    ? adminMoney(player.amount)
                    : status === "freshman"
                      ? "Świeżak"
                      : status === "missing"
                        ? "BRAK"
                        : "0"
                }
              </strong>
            </div>
          `).join("")
        }
      </div>
    `;
  }).join("");
}

function renderPaymentsPreview(payload) {

  const result = adminQ("#adminPaymentsPreviewResult");
  const importButton = adminQ("#adminPaymentsImport");
  if (!result || !importButton) return;

  const players = Array.isArray(payload.players) ? payload.players : [];
  const errors = Array.isArray(payload.errors) ? payload.errors : [];
  const warnings = Array.isArray(payload.warnings) ? payload.warnings : [];

  importButton.hidden = !payload.canWrite;
  importButton.disabled = false;

  const messageHtml = [
    ...errors.map(x => `<div style="color:#9b2d2d;margin:4px 0">❌ ${esc(x)}</div>`),
    ...warnings.map(x => `<div style="color:#8a6500;margin:4px 0">⚠️ ${esc(x)}</div>`)
  ].join("");

  const rows = players.map(player => {
    const baseline = player.status === "baseline";
    const waiting = player.status === "waiting_baseline";
    const bad = player.status === "error";
    return `
      <div class="previewDay ${bad ? "bad" : waiting ? "out" : ""}">
        <div style="padding:8px">
          <div style="display:flex;justify-content:space-between;gap:8px"><strong>${esc(player.nick)}</strong><strong>${adminMoney(player.newBalance)} zł</strong></div>
          <div class="muted" style="margin-top:3px;font-size:11px">
            ${baseline ? "Pierwszy odczyt · delta 0 zł" : waiting ? "Oczekiwanie na pierwszy odczyt" : `Nowe wpłaty: +${adminMoney(player.delta)} zł · Obowiązek: -${adminMoney(player.obligation)} zł (${Number(player.chargedDays)||0} dni)`}
          </div>
          ${player.previousTotal != null ? `<div class="muted" style="font-size:11px">Suma: ${adminMoney(player.previousTotal)} → ${adminMoney(player.currentTotal)} zł · wpłaty: ${Number(player.previousCount)||0} → ${Number(player.currentCount)||0}</div>` : ""}
        </div>
      </div>`;
  }).join("");

  result.innerHTML = `
    <div class="adminBox">
      <b>${payload.mode === "initialize" ? "🧭 Pierwszy snapshot" : "✅ Rozliczenie do zapisania"}</b><br>
      Stan rankingu: <b>${esc(adminDate(payload.closeDate))}</b><br>
      Aktywni: <b>${Number(payload.rosterCount)||0}</b> · znalezieni: <b>${Number(payload.matchedCount)||0}</b> · poza rosterem: <b>${Number(payload.ignoredCount)||0}</b>
    </div>
    ${messageHtml}
    ${rows}`;
}

async function previewAdminPayments() {
  const reportBox =
    adminQ("#adminPaymentsReport");

  const status =
    adminQ("#adminPaymentsStatus");

  const result =
    adminQ(
      "#adminPaymentsPreviewResult"
    );

  const importButton =
    adminQ("#adminPaymentsImport");

  if (
    !reportBox ||
    !status ||
    !result ||
    !importButton
  ) {
    return;
  }

  const report =
    reportBox.value.trim();

  if (!report) {
    status.textContent =
      "Wklej ranking wpłat.";
    result.innerHTML = "";
    importButton.hidden = true;
    return;
  }

  status.textContent =
    "Sprawdzanie danych...";

  result.innerHTML = "";
  importButton.hidden = true;

  const nonce =
    makeGangNonce();

  try {
    const start =
      await gmJsonRequest(
        "POST",
        BACKEND_URL,
        {
          action:
            "adminPreviewPayments",
          token:adminToken(),
          nonce,
          report
        }
      );

    if (start && start.ok === false) {
      throw new Error(
        start.error ||
        "Nie udało się rozpocząć sprawdzania."
      );
    }

    let payload = null;

    for (let i=0; i<20; i++) {
      await new Promise(
        resolve =>
          setTimeout(resolve,500)
      );

      payload =
        await gmJsonRequest(
          "GET",
          BACKEND_URL +
            "?action=adminPreviewPaymentsResult" +
            "&token=" +
            encodeURIComponent(
              adminToken()
            ) +
            "&nonce=" +
            encodeURIComponent(nonce) +
            "&_=" +
            Date.now()
        );

      if (
        !payload ||
        !payload.pending
      ) {
        break;
      }
    }

    if (!payload || payload.pending) {
      throw new Error(
        "Serwer nie zwrócił wyniku sprawdzania."
      );
    }

    if (!payload.ok) {
      throw new Error(
        payload.error ||
        "Nie udało się sprawdzić raportu."
      );
    }

    renderPaymentsPreview(payload);
    status.textContent = "";

  } catch (err) {
    status.textContent =
      err && err.message
        ? err.message
        : "Nie udało się sprawdzić danych.";
  }
}

async function importAdminPayments() {
  const reportBox =
    adminQ("#adminPaymentsReport");

  const status =
    adminQ("#adminPaymentsStatus");

  const button =
    adminQ("#adminPaymentsImport");

  if (
    !reportBox ||
    !status ||
    !button
  ) {
    return;
  }

  const report =
    reportBox.value.trim();

  if (!report) {
    status.textContent =
      "Wklej ranking wpłat.";
    return;
  }

  if (
    !window.confirm(
      "Wprowadzić poprawne dni do arkusza?\n\n" +
      "Dni z błędami i poza zakresem zostaną pominięte."
    )
  ) {
    return;
  }

  const nonce =
    makeGangNonce();

  button.disabled = true;
  status.textContent =
    "Wprowadzanie danych...";

  try {
    const start =
      await gmJsonRequest(
        "POST",
        BACKEND_URL,
        {
          action:
            "adminImportPayments",
          token:adminToken(),
          nonce,
          report
        }
      );

    if (start && start.ok === false) {
      throw new Error(
        start.error ||
        "Nie udało się rozpocząć zapisu."
      );
    }

    let payload = null;

    for (let i=0; i<24; i++) {
      await new Promise(
        resolve =>
          setTimeout(resolve,500)
      );

      payload =
        await gmJsonRequest(
          "GET",
          BACKEND_URL +
            "?action=adminImportPaymentsResult" +
            "&token=" +
            encodeURIComponent(
              adminToken()
            ) +
            "&nonce=" +
            encodeURIComponent(nonce) +
            "&_=" +
            Date.now()
        );

      if (
        !payload ||
        !payload.pending
      ) {
        break;
      }
    }

    if (!payload || payload.pending) {
      throw new Error(
        "Serwer nie zwrócił wyniku zapisu."
      );
    }

    if (!payload.ok) {
      throw new Error(
        payload.error ||
        "Nie udało się wprowadzić danych."
      );
    }

    let message =
      `✅ ${payload.message || "Dane zostały zapisane."}`;

    if (
      Array.isArray(payload.written) &&
      payload.written.length
    ) {
      message +=
        "\nZapisane: " +
        payload.written
          .map(item =>
            `${item.date} ${
              item.mode === "overwrite"
                ? "(nadpisano)"
                : "(dodano)"
            }`
          )
          .join(", ");
    }

    if (
      Array.isArray(payload.skipped) &&
      payload.skipped.length
    ) {
      message +=
        "\nPominięte: " +
        payload.skipped
          .map(item =>
            `${item.date} — ${item.reason}`
          )
          .join("; ");
    }

    status.textContent =
      message;

    button.hidden = true;

    await loadAdminPaymentsMeta();

  } catch (err) {
    status.textContent =
      err && err.message
        ? err.message
        : "Nie udało się wprowadzić danych.";
  } finally {
    button.disabled = false;
  }
}

function openAdmin() {
  if (adminPanel) {
    adminPanel.remove();
    adminPanel = null;
    return;
  }

  if (mapPanel) { mapPanel.remove(); mapPanel=null; }
  if (submitPanel) { submitPanel.remove(); submitPanel=null; }
  if (paymentsPanel) { paymentsPanel.remove(); paymentsPanel=null; }
  if (optPanel) { optPanel.remove(); optPanel=null; }

  if (!root) mount();

  adminPanel =
    document.createElement("div");

  adminPanel.className =
    "panel";

  adminPanel.innerHTML = `
    <div class="head">
      <span>🛠 Panel administratora</span>
      <span class="close">×</span>
    </div>

    <div class="adminWrap"></div>
  `;

  root.appendChild(
    adminPanel
  );

  adminPanel
    .querySelector(".close")
    .onclick = () => {
      adminPanel.remove();
      adminPanel = null;
    };

  if (adminToken()) {
    renderAdminHome();
    checkAdminToken();
  } else {
    renderAdminLogin();
  }
}

  function fetchApproved() {

  if (!backendConfigured()) {
    console.warn(
      "[MenelWars Tools] BACKEND_URL nie jest skonfigurowany."
    );
    return;
  }

  const url =
    BACKEND_URL +
    "?action=approved&_=" +
    Date.now();

  GM_xmlhttpRequest({

    method: "GET",

    url: url,

    headers: {
      "Accept": "application/json"
    },

    onload: function(response) {

      try {

        const payload =
          JSON.parse(response.responseText);

        if (
          !payload ||
          !payload.ok ||
          !payload.recipes ||
          typeof payload.recipes !== "object"
        ) {

          console.warn(
            "[MenelWars Tools] Nieprawidłowa odpowiedź backendu:",
            payload
          );

          return;
        }

        remoteApproved =
          payload.recipes;

        recipeReservations =
          payload.reservations && typeof payload.reservations === "object"
            ? payload.reservations
            : {};

        recipeRanking =
          Array.isArray(payload.ranking)
            ? payload.ranking
            : [];

        localStorage.setItem(
          REMOTE_KEY,
          JSON.stringify(remoteApproved)
        );

        RECIPES =
          buildRecipes();

        console.log(
          "[MenelWars Tools] Pobrano zatwierdzone receptury:",
          Object.keys(remoteApproved).length
        );

        if (optPanel) {
          renderOptimizer();
        }

      } catch (err) {

        console.error(
          "[MenelWars Tools] Błąd parsowania backendu:",
          err,
          response.responseText
        );
      }
    },

    onerror: function(err) {

      console.error(
        "[MenelWars Tools] Błąd połączenia z backendem:",
        err
      );
    }
  });
}

  GM_registerMenuCommand("⚗ Otwórz Destylarnię",()=>{mount();openOptimizer();});
  GM_registerMenuCommand("👥 Otwórz Gang",()=>{mount();openPayments();});
  GM_registerMenuCommand("🗺 Otwórz Mapę",()=>{mount();openMap();});

  function boot() {
    if (!document.documentElement) { setTimeout(boot,50); return; }
    mount(); fetchApproved();
    setInterval(fetchApproved,5*60*1000);
    setInterval(()=>{if(!host||!document.documentElement.contains(host))mount();},1000);
  }

  boot();
})();
