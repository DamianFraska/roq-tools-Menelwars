// ==UserScript==
// @name         MenelWars Tools
// @namespace    menelwars.tools
// @author       RoQ
// @description  Optymalizator receptur i dodatkowe narzędzia do MenelWars.
// @match        https://menelwars.pl/*
// @match        https://www.menelwars.pl/*
// @grant        GM_registerMenuCommand
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

  const MAPA = [
    ["Wilanów","⚔️ Agresywnie"],
    ["Mokotów","🤝 Przyjacielski"],
    ["Ursynów","🙏 Błagalny"],
    ["Ochota","⚪ Neutralny"],
    ["Śródmieście","⚔️ Agresywny"],
    ["Bemowo","🤝 Przyjacielski"],
    ["Wola","🙏 Błagalny"],
    ["Żoliborz","⚪ Neutralny"],
    ["Bielany","⚪ Neutralny"],
    ["Praga","🙏 Błagalny"],
    ["Białołęka",null],
    ["Targówek",null]
  ];

  const PREMIUM_KEY = "roq_tools_premium_v1";
  const REMOTE_KEY = "roq_tools_remote_approved_v1";

  let premiumState = {};
  let remoteApproved = {};

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

  let host=null, root=null, optPanel=null, mapPanel=null, currentTab="top";

  const CSS = `
    *{box-sizing:border-box}
    #bar{display:flex;gap:7px;align-items:center;padding:7px 8px;background:rgba(28,24,20,.96);
      border:1px solid #8d7657;border-radius:9px;box-shadow:0 4px 18px #0007;font:12px Arial,sans-serif}
    .title{color:#d9c5a4;font-weight:700;padding:0 3px;white-space:nowrap}
    button{border:1px solid #8d7657;border-radius:6px;background:#dfd0b6;color:#332a20;
      padding:7px 10px;font:700 12px Arial,sans-serif;cursor:pointer}
    .panel{position:fixed;right:10px;top:54px;width:430px;max-height:82vh;overflow:hidden;
      border:1px solid #8d7657;border-radius:13px;background:#f5eddc;color:#332a20;
      box-shadow:0 10px 35px #0007;font:13px Arial,sans-serif}
    .head{display:flex;justify-content:space-between;align-items:center;padding:12px 14px;background:#dfd0b6;font-weight:700}
    .close{cursor:pointer;font-size:19px;padding:0 3px}
    .premium{padding:10px 14px;border-bottom:1px solid #d1c1a7}
    .ptitle{font-weight:700;margin-bottom:7px}
    .checks{display:grid;grid-template-columns:1fr 1fr;gap:5px 10px}
    .checks label{display:flex;align-items:center;gap:6px}
    .tabs{display:flex;border-bottom:1px solid #d1c1a7}
    .tab{flex:1;text-align:center;padding:9px 5px;cursor:pointer;font-weight:700;background:#eee3cf}
    .tab.active{background:#fff8eb}
    .body,.mapbody{padding:10px 12px;max-height:52vh;overflow:auto;background:#fff8eb}
    .card{border:1px solid #d8c7aa;border-radius:9px;padding:9px 10px;margin-bottom:8px;background:#fffdf8}
    .rank{font-weight:800} .liters{float:right;font-weight:800;font-size:15px;color:#356a3c}
    .star{color:#9a6500;font-weight:700;margin-top:5px} .muted{color:#766b5e}
    .bar{height:12px;background:#ded3c0;border-radius:8px;overflow:hidden;margin:8px 0 14px}
    .bar>div{height:100%;background:#6d8c55}
    .maprow{display:grid;grid-template-columns:1fr 1fr;gap:8px;padding:8px;border-bottom:1px solid #e2d5bf}
    .district{font-weight:700} .action{text-align:right;font-weight:700} .unknown{color:#9a6500}
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
    bar.innerHTML = `<span class="title">MenelWars Tools</span><button id="map">🗺 Mapa</button><button id="opt">⚗ Optymalizator</button>`;
    root.appendChild(bar); document.documentElement.appendChild(host);
    root.getElementById("map").onclick = openMap;
    root.getElementById("opt").onclick = openOptimizer;
    return true;
  }

  function checkboxHtml(name) {
    return `<label><input type="checkbox" data-premium="${esc(name)}" ${premiumState[name]?"checked":""}>${esc(name)}</label>`;
  }

  function renderOptimizer() {
    if (!optPanel) return;
    const available = RECIPES.filter(isAvailable);
    const known = available.filter(x=>x.litry!==null).sort((a,b)=>b.litry-a.litry);
    const unknown = available.filter(x=>x.litry===null);
    const th = threshold(known);
    let body="";

    if (currentTab==="top") {
      body = known.slice(0,10).map((r,i)=>`
        <div class="card"><span class="rank">${i+1}.</span><span class="liters">${fmt(r.litry)} l</span>
        <div><b>${esc(r.baza)}</b></div><div>${esc(r.drozdze)} · ${esc(r.woda)} · P${r.program}</div></div>`
      ).join("") || `<div class="muted">Brak znanych receptur.</div>`;
    }

    if (currentTab==="unknown") {
      const ranked = unknown.map(r=>({...r,trioMax:maxForTrio(r)}))
        .sort((a,b)=>(b.trioMax??-1)-(a.trioMax??-1)||a.baza.localeCompare(b.baza)||a.program-b.program);
      body = ranked.slice(0,40).map(r=>`
        <div class="card"><div><b>${esc(r.baza)}</b></div>
        <div>${esc(r.drozdze)} · ${esc(r.woda)} · P${r.program}</div>
        ${r.trioMax!==null && r.trioMax>=th ? `<div class="star">⭐ Interesująca do zbadania</div>
        <div class="muted">Inny program tej trójki: do ${fmt(r.trioMax)} l.</div>`:""}</div>`
      ).join("") || `<div class="muted">Brak nieodkrytych receptur.</div>`;
    }

    if (currentTab==="progress") {
      const globalKnown = RECIPES.filter(x=>x.litry!==null).length;
      const gp = globalKnown/RECIPES.length*100;
      const ap = available.length ? known.length/available.length*100 : 0;
      body = `<b>Cała baza</b><br>Znane: <b>${globalKnown} / ${RECIPES.length}</b><br>
      Nieodkryte: <b>${RECIPES.length-globalKnown}</b><br>Postęp: <b>${gp.toFixed(1).replace(".",",")}%</b>
      <div class="bar"><div style="width:${gp}%"></div></div>
      <b>Dla Twoich składników</b><br>Znane: <b>${known.length} / ${available.length}</b><br>
      Nieodkryte: <b>${unknown.length}</b><br>Postęp: <b>${ap.toFixed(1).replace(".",",")}%</b>
      <div class="bar"><div style="width:${ap}%"></div></div>`;
    }

    optPanel.querySelector(".body").innerHTML = body;
    optPanel.querySelectorAll(".tab").forEach(t=>t.classList.toggle("active",t.dataset.tab===currentTab));
  }

  function openOptimizer() {
    if (optPanel) { optPanel.remove(); optPanel=null; return; }
    if (mapPanel) { mapPanel.remove(); mapPanel=null; }
    if (!root) mount();
    optPanel = document.createElement("div"); optPanel.className="panel";
    optPanel.innerHTML = `<div class="head"><span>⚗ MenelWars — Optymalizator</span><span class="close">×</span></div>
      <div class="premium"><div class="ptitle">Posiadane składniki premium</div>
      <div class="checks">${[...PREMIUM.baza,...PREMIUM.drozdze].map(checkboxHtml).join("")}</div></div>
      <div class="tabs"><div class="tab active" data-tab="top">Najlepsze</div>
      <div class="tab" data-tab="unknown">Nieodkryte</div><div class="tab" data-tab="progress">Postęp</div></div>
      <div class="body"></div>`;
    root.appendChild(optPanel);
    optPanel.querySelector(".close").onclick=()=>{optPanel.remove();optPanel=null;};
    optPanel.querySelectorAll(".tab").forEach(t=>t.onclick=()=>{currentTab=t.dataset.tab;renderOptimizer();});
    optPanel.querySelectorAll("[data-premium]").forEach(cb=>cb.onchange=()=>{
      premiumState[cb.dataset.premium]=cb.checked;
      localStorage.setItem(PREMIUM_KEY,JSON.stringify(premiumState));
      renderOptimizer();
    });
    renderOptimizer();
  }

  function openMap() {
    if (mapPanel) { mapPanel.remove(); mapPanel=null; return; }
    if (optPanel) { optPanel.remove(); optPanel=null; }
    if (!root) mount();
    mapPanel = document.createElement("div"); mapPanel.className="panel";
    mapPanel.innerHTML = `<div class="head"><span>🗺 Ściąga — Mapa</span><span class="close">×</span></div>
      <div class="mapbody">${MAPA.map(([d,a])=>`<div class="maprow"><div class="district">${d}</div>
      <div class="action ${a?"":"unknown"}">${a||"❓ Nieodkryte"}</div></div>`).join("")}</div>`;
    root.appendChild(mapPanel);
    mapPanel.querySelector(".close").onclick=()=>{mapPanel.remove();mapPanel=null;};
  }

  function fetchApproved() {
    if (!backendConfigured() || !document.head) return;
    const cb = "roqApproved_"+Date.now()+"_"+Math.floor(Math.random()*100000);
    const s = document.createElement("script");
    const cleanup=()=>{try{delete window[cb]}catch{} s.remove();};
    window[cb]=payload=>{
      try {
        if (payload && payload.ok && payload.recipes && typeof payload.recipes==="object") {
          remoteApproved=payload.recipes;
          localStorage.setItem(REMOTE_KEY,JSON.stringify(remoteApproved));
          RECIPES=buildRecipes();
          if (optPanel) renderOptimizer();
        }
      } finally { cleanup(); }
    };
    s.onerror=cleanup;
    s.src=BACKEND_URL+"?action=approved&callback="+encodeURIComponent(cb)+"&_="+Date.now();
    document.head.appendChild(s);
  }

  GM_registerMenuCommand("⚗ Otwórz Optymalizator",()=>{mount();openOptimizer();});
  GM_registerMenuCommand("🗺 Otwórz Mapę",()=>{mount();openMap();});

  function boot() {
    if (!document.documentElement) { setTimeout(boot,50); return; }
    mount(); fetchApproved();
    setInterval(fetchApproved,5*60*1000);
    setInterval(()=>{if(!host||!document.documentElement.contains(host))mount();},1000);
  }

  boot();
})();
