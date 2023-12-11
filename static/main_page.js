'use strict';
let username = localStorage.getItem('loggedInUsername');
function initializeMap() {
  var map = L.map('map').setView([60, 24], 3);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 20
  }).addTo(map);
  return map;
}
let map = initializeMap();
let markerGroup = L.layerGroup().addTo(map);
function removeAllMarkers() {
    markerGroup.clearLayers();
}
function createRedMarker(latitude, longitude) {
    let redIcon = L.icon({
        iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34]
    });
    let marker = L.marker([latitude, longitude], { icon: redIcon });
    marker.bindPopup("You are here");
    marker.addTo(markerGroup);
}
function openModal(largeImagePath) {
            modalImage.src = largeImagePath;
            dialog.showModal();
        }
function closeModal() {
            dialog.close();
        }
const dialog = document.querySelector('dialog');
const modalImage = document.getElementById('modal-image');
function clearData() {
  let fuelinfo = document.getElementById("fuelinfo");
  fuelinfo.innerHTML = '';
}
function clearData2() {
  let question = document.getElementById("question");
  question.innerHTML = '';
}

function updateStatus(data) {
  let player = document.getElementById("player");
  player.textContent = data.player;
  let currentcountry = document.getElementById("currentlocation");
  currentcountry.textContent = data.currentlocation;
  let money = document.getElementById("money");
  money.textContent = data.money;
  let peopleSaved = document.getElementById("peopleSaved");
  peopleSaved.textContent = data.people_saved;
  let fuelEfficiency = document.getElementById("fuelEfficiency");
  fuelEfficiency.textContent = data.fuel_efficiency;
  let placesVisited = document.getElementById("placesVisited");
  placesVisited.textContent = data.municipality_visited;
  let fuel = document.getElementById("fuel");
  fuel.textContent = data.fuel;
  let currentprice = document.getElementById("currentprice");
  currentprice.textContent = data.fuel_price;
  createRedMarker(data.lat,data.long);
}
async function fetchStatus() {
  const response = await fetch('/status', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({username}),
    });

    const data = await response.json();
    if (data) {
        console.log(data);
        updateStatus(data);
    } else {
        alert("Status update failed.");
    }
}
async function submitUserInput() {
    let amount = document.getElementById("userInput").value;
    const response = await fetch('/buyfuel', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({username, amount}),
    });
    const data = await response.json();
    if (data) {
        let fuelinfo = document.getElementById("fuelinfo");
        let questionParagraph = document.createElement("p");
        questionParagraph.textContent = "After buying, you have: ";
        fuelinfo.appendChild(questionParagraph);
        let updatedList = document.createElement("ul");
        let updatedfuel = document.createElement("li");
        updatedfuel.textContent = "Fuel total " + data.fuel;
        let updatedmoney = document.createElement("li");
        updatedmoney.textContent = "Money left " + data.money;
        updatedList.appendChild(updatedfuel);
        updatedList.appendChild(updatedmoney);
        fuelinfo.appendChild(updatedList);
        updateStatus(data);
        setTimeout(() => {
            clearData();
            }, "4000");
}
     else {
        alert("Purchase failed");
    }
}
async function fetchCountries() {
  const headers = new Headers();
  headers.append('Content-Type', 'application/json');
  headers.append('Access-Control-Allow-Origin', '*');
  headers.append('username', username);
  const options = {
    method: 'GET',
    headers: headers
  };
  const response = await fetch('/fetchcountries', options); // starts the download.
  const data = await response.json();
  console.log(data["countries"]);
  clearData2()
  let question = document.getElementById("question");
  let questionParagraph = document.createElement("p");
  questionParagraph.textContent = "Location of countries are not displayed on the map ";
  let questionParagraph2 = document.createElement("p");
  questionParagraph2.textContent = "You have to guess the closest country to save fuel ";
  let questionParagraph3 = document.createElement("p");
  questionParagraph3.textContent = "Choose one of the following countries: ";
  question.appendChild(questionParagraph);
  question.appendChild(questionParagraph2);
  question.appendChild(questionParagraph3);
  let questionList = document.createElement("ul");
  data["countries"].forEach((country) => {
    let questionOption = document.createElement("li");
    questionOption.textContent = country;
    questionOption.addEventListener("click", function (evt) {
      fetchAirports(questionOption.textContent);
    });
    questionList.appendChild(questionOption);
  });
  question.appendChild(questionList);
}
async function fetchAirports(country) {
  const headers = new Headers();
  headers.append('Content-Type', 'application/json');
  headers.append('Access-Control-Allow-Origin', '*');

  headers.append('country', country);
  const options = {
    method: 'GET',
    headers: headers
  };
  const response = await fetch('/country-airports', options);
  const data = await response.json();
  console.log(data["airports"]);
  clearData2();
  let airportChoices = document.getElementById("question");
  let airportParagraph = document.createElement("p");
  airportParagraph.textContent = "Choose one of the following airports";
  let airportParagraph2 = document.createElement("p");
  airportParagraph2.textContent = "(Check the map for info about people and fuel price) ";
  airportChoices.appendChild(airportParagraph);
  airportChoices.appendChild(airportParagraph2);
  let airportList = document.createElement("ul");
  removeAllMarkers();
  data["airports"].forEach((a) => {
    L.marker([a.latitude, a.longitude]).addTo(markerGroup)
    .bindPopup(`${a.airport} has ${a.people} people and fuel price of ${a.fuel_price}`);

    let airportOption = document.createElement("li");
    airportOption.textContent = decodeURI(a.airport);
    airportList.appendChild(airportOption);

    airportOption.addEventListener("click", function (evt) {
      travel(airportOption.textContent);
    });
  });
  airportChoices.appendChild(airportList);
}
async function travel(airportName) {
    let airport_name = airportName;
    const response = await fetch('/travel', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({username,airport_name}),
    });
    const data = await response.json();
    if (data) {
        console.log(data);
        updateStatus(data);
        fetchAirportStatus(airport_name);
    } else {
        alert("Travel failed.");
    }
}
async function fetchAirportStatus(airportname) {
    let airport = airportname;
  const headers = new Headers();
  headers.append('Content-Type', 'application/json');
  headers.append('Access-Control-Allow-Origin', '*');
  headers.append('airport', airport);
  const options = {
    method: 'GET',
    headers: headers
  };

  const response = await fetch('/airportStatus', options);
  const data = await response.json();
  clearData2();

  let airportStatus = document.getElementById("question");
  let statusParagraph = document.createElement("p");
  statusParagraph.textContent = "Congratulations, you have flown to: ";
  airportStatus.appendChild(statusParagraph);
  let statusList = document.createElement("ul");
  let name = document.createElement("li");
  name.textContent = "Airport:" + data.name;
  let people = document.createElement("li");
  people.textContent = "And you have saved:" + data.people;
  let fuel_price = document.createElement("li");
  fuel_price.textContent = "Fuel price here is:" + data.fuel_price;
  let probability = document.createElement("li");
  probability.textContent = "Probability: "  + data.probability;
  statusList.appendChild(name);
  statusList.appendChild(people);
  statusList.appendChild(fuel_price);
  statusList.appendChild(probability);
  airportStatus.appendChild(statusList);

  setTimeout(() => {
    if (parseInt(fuel.textContent) < 0 || parseInt(peopleSaved.textContent) > 150) {
      console.log("GAME OVER");
      alert("GAME OVER!");
    } else if (parseInt(peopleSaved.textContent) >= 100 && parseInt(placesVisited.textContent) >= 5) {
      console.log("Congratulations! You've won the game.");
      alert("YOU WON!");
    } else {
      fetchCountries();
    }
  }, 6000);
}

fetchStatus();
fetchCountries();
