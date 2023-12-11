'use strict';
let username = localStorage.getItem('loggedInUsername');

// Global variables
let map = initializeMap();

function clearData() {
  let question = document.getElementById("question");
  question.innerHTML = '';
}

async function fetchAirports(country) {
  const headers = new Headers();
  headers.append('Content-Type', 'application/json');
  headers.append('Access-Control-Allow-Origin', '*');

  headers.append('username', username);
  const options = {
    method: 'GET',
    headers: headers
  };
  const response = await fetch('http://127.0.0.1:5000/country-airports/' + country, options);
  const data = await response.json();
  console.log(data["airports"]);
  clearData();
  let airportChoices = document.getElementById("question");
  let airportParagraph = document.createElement("p");
  airportParagraph.textContent = "Choose one of the following airports";
  airportChoices.appendChild(airportParagraph);
  let airportList = document.createElement("ul");

  data["airports"].forEach((a) => {
    L.marker([a.latitude, a.longitude]).addTo(map)
      .bindPopup(a.airport);
    let airportOption = document.createElement("li");
    airportOption.textContent = decodeURI(a.airport);
    airportList.appendChild(airportOption);
    airportOption.addEventListener("click", function (evt) {
      travel(airportOption.textContent);
      fetchAirportStatus(airportOption.textContent);
    });
  });
  airportChoices.appendChild(airportList);
}

async function submitUserInput() {
  const headers = new Headers();
  headers.append('Content-Type', 'application/json');
  headers.append('Access-Control-Allow-Origin', '*');

  headers.append('username', username);
  const options = {
    method: 'GET',
    headers: headers
  };
  let amount = document.getElementById("userInput").value;
  const response = await fetch('http://127.0.0.1:5000/buyfuel/' + amount, options);
  const data = await response.json();
  clearData();
  let question = document.getElementById("question");
  let questionParagraph = document.createElement("p");
  questionParagraph.textContent = "Your updated game status is: ";
  question.appendChild(questionParagraph);
  let updatedList = document.createElement("ul");
  let updatedfuel = document.createElement("li");
  updatedfuel.textContent = "Updated fuel value" + data.fuel;
  let updatedmoney = document.createElement("li");
  updatedmoney.textContent = "Money left" + data.money;
  updatedList.appendChild(updatedfuel);
  updatedList.appendChild(updatedmoney);
  question.appendChild(updatedList);
  updateStatus(data);
  setTimeout(() => {
    clearData();
    fetchCountries(map);
  }, "10000");
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
  const response = await fetch('http://127.0.0.1:5000/countries', options); // starts the download.
  const data = await response.json();
  console.log(data["countries"]);
  let question = document.getElementById("question");
  let questionParagraph = document.createElement("p");
  questionParagraph.textContent = "Choose one of the following countries: ";
  question.appendChild(questionParagraph);
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

async function travel(airportName) {
  const headers = new Headers();
  headers.append('Content-Type', 'application/json');
  headers.append('Access-Control-Allow-Origin', '*');
  headers.append('username', username);
  const options = {
    method: 'GET',
    headers: headers
  };
  const response = await fetch('http://127.0.0.1:5000/travel/' + airportName, options);
  const data = await response.json();
  console.log(data);
  updateStatus(data);
}

function updateStatus(data) {
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
}

async function fetchStatus() {
  const headers = new Headers();
  headers.append('Content-Type', 'application/json');
  headers.append('Access-Control-Allow-Origin', '*');
  headers.append('username', username);
  const options = {
    method: 'GET',
    headers: headers
  };
  const response = await fetch('http://127.0.0.1:5000/status', options);
  const data = await response.json();
  console.log(data);
  updateStatus(data);
}

async function fetchAirportStatus(airport) {
  const headers = new Headers();
  headers.append('Content-Type', 'application/json');
  headers.append('Access-Control-Allow-Origin', '*');
  headers.append('username', username);
  const options = {
    method: 'GET',
    headers: headers
  };

  const response = await fetch('http://127.0.0.1:5000/airportStatus/'+airport, options);
  const data = await response.json();
  clearData();

  let airportStatus = document.getElementById("question");
  let statusParagraph = document.createElement("p");
  statusParagraph.textContent = "The Airport you have chosen have following characteristics: ";
  airportStatus.appendChild(statusParagraph);
  let statusList = document.createElement("ul");
  let name = document.createElement("li");
  name.textContent = "Airport name:" + data.name;
  let people = document.createElement("li");
  people.textContent = "People Saved:" + data.people;
  let fuel_price = document.createElement("li");
  fuel_price.textContent = "Fuel Price:" + data.fuel_price;
  let probability = document.createElement("li");
  probability.textContent = "Probability:"  + data.probability;
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
      clearData();
      fetchCountries(map);
    }
  }, 10000);
}

function initializeMap() {
  var map = L.map('map').setView([60, 24], 3);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 20
  }).addTo(map);
  L.marker([60, 24]).addTo(map);
  return map;
}

async function startOver() {
  const headers = new Headers();
  headers.append('Content-Type', 'application/json');
  headers.append('Access-Control-Allow-Origin', '*');
  headers.append('username', username);
  const options = {
    method: 'GET',
    headers: headers
  };
  const response = await fetch('http://127.0.0.1:5000/start-over', options);
  const data = await response.json();
  updateStatus(data);
}

async function main(){
  await fetchStatus();
  if (parseInt(fuel.textContent) < 0 || parseInt(peopleSaved.textContent) > 150) {
    let userResponse = confirm("\"Play again!\nEither OK or Cancel." );
    if (userResponse) {
      startOver();
      clearData();
      fetchCountries(map);
    }
  } else if (parseInt(peopleSaved.textContent) >= 100 && parseInt(placesVisited.textContent) >= 5) {
    console.log("Congratulations! You've won the game.");
    alert("YOU WON!");
  } else {
    clearData();
    fetchCountries(map);
  }
}

main();


