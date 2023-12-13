'use strict';
let backgroundMusic = document.getElementById('backgroundMusic');
    backgroundMusic.volume = 0.5;
let username = localStorage.getItem('loggedInUsername');
function playSoundAndRedirect() {
    var audio = document.getElementById('buttonClickSound');
    var redirectUrl = "/"; // Replace with your desired URL
    audio.play();
    setTimeout(function () {
      window.location.href = redirectUrl;
    }, audio.duration * 500);}
function playSound() {
    var audio = document.getElementById('buttonClickSound');
    audio.play();}
function playSoundbuy() {
    var audio = document.getElementById('buy');
    audio.play();}
function playSoundbless() {
    var audio = document.getElementById('bless');
    audio.play();}
function playSoundcurse() {
    var audio = document.getElementById('curse');
    audio.play();}
function playSoundwin() {
    var audio = document.getElementById('win');
    audio.play();}
function playSoundlose() {
    var audio = document.getElementById('lose');
    audio.play();}
function playSoundfly() {
    var audio = document.getElementById('fly');
    audio.play();}
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
function openModal1() {
        var dialog = document.getElementById('dialog1');
        dialog.style.display = 'flex';
        dialog.style.flexDirection = 'column';
        var button = document.createElement('button');
        button.innerHTML = 'Play Again';
        button.style.marginTop = '20px';
        button.style.alignSelf = 'center';
        button.style.display = 'inline-block';
        button.style.backgroundColor = '#4CAF50';
        button.style.color = '#fff';
        button.style.padding = '25px 30px';
        button.style.borderRadius = '10px';
        button.style.cursor = 'pointer';
        button.style.fontSize = '25px';
        button.style.fontFamily = 'TechnoRaceItalic-font';
        button.style.textDecoration = 'none !important';
        button.onclick = function() {
            closeModal1();
            console.log("Restart game.")
            startOver();
        };
        dialog.appendChild(button);
        dialog.showModal();
    }
function openModal2() {
        var dialog = document.getElementById('dialog2');
        dialog.style.display = 'flex';
        dialog.style.flexDirection = 'column';
        var button = document.createElement('button');
        button.innerHTML = 'Play Again';
        button.style.marginTop = '20px';
        button.style.alignSelf = 'center';
        button.style.display = 'inline-block';
        button.style.backgroundColor = '#4CAF50';
        button.style.color = '#fff';
        button.style.padding = '25px 30px';
        button.style.borderRadius = '10px';
        button.style.cursor = 'pointer';
        button.style.fontSize = '25px';
        button.style.fontFamily = 'TechnoRaceItalic-font';
        button.style.textDecoration = 'none !important';
        button.onclick = function() {
            closeModal2();
            console.log("Restart game.")
            startOver();
        };
        dialog.appendChild(button);
        dialog.showModal();
    }
function closeModal1() {
        var dialog = document.getElementById('dialog1');
        dialog.style = '';
        var button = document.querySelector('#dialog1 button');
        if (button) {
            button.remove();
        }
        dialog.close();
    }
function closeModal2() {
        var dialog = document.getElementById('dialog2');
        dialog.style = '';
        var button = document.querySelector('#dialog1 button');
        if (button) {
            button.remove();
        }
        dialog.close();
    }
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
  let peopleSaved = document.getElementById("peoplered");
  peopleSaved.textContent = data.people_saved;
  let fuelEfficiency = document.getElementById("fuelEfficiency");
  fuelEfficiency.textContent = data.fuel_efficiency;
  let placesVisited = document.getElementById("placesVisited");
  placesVisited.textContent = `${data.municipality_visited} / 5`;
  let fuel = document.getElementById("fuel");
  fuel.textContent = data.fuel;
  let currentprice = document.getElementById("currentprice");
  currentprice.textContent = data.fuel_price;
  createRedMarker(data.lat,data.long);
  if (parseInt(data.people_saved) > 100){
      peopleSaved.style.color = 'darkred';
  }
  if (parseInt(data.people_saved) < 100){
      peopleSaved.style.color = 'black';
  }
  if (parseInt(data.fuel) < 10000){
      fuel.style.color = 'darkred';
  }
  if (parseInt(data.fuel) >= 10000){
      fuel.style.color = 'black';
  }
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
    if (data.player) {
        console.log(data);
        updateStatus(data);
    } else {
        alert("Status update failed.");
    }
}
async function refreshCountry(){
    const response = await fetch('/refresh', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({username}),
    });
    const data = await response.json();
    if (data.player) {
        playSound();
        updateStatus(data);
        fetchCountries();}
    else if (data.false) {
        playSoundcurse();
        let norefresh = document.getElementById("norefresh");
        norefresh.textContent = "You don't have enough money";
        norefresh.style.alignSelf = 'center';
        norefresh.style.marginRight = '110px';
        norefresh.style.display = 'inline-block';
        norefresh.style.backgroundColor = 'darkred';
        norefresh.style.color = '#fff';
        norefresh.style.padding = '20px 25px';
        norefresh.style.borderRadius = '10px';
        norefresh.style.cursor = 'pointer';
        norefresh.style.fontSize = '20px';
        norefresh.style.fontFamily = 'TechnoRaceItalic-font';
        norefresh.style.textDecoration = 'none !important';
        setTimeout(() => {
            norefresh.style =''
            norefresh.innerHTML = '';
            }, "4000");
    }
     else {
        alert("Refresh failed");}
}
async function submitUserInput() {
    let amount1 = document.getElementById("userInput").value;
    let amount = parseInt(amount1);
    if (!isNaN(amount) && Number.isInteger(amount) && amount > 0){
        const response = await fetch('/buyfuel', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({username, amount}),
    });
    const data = await response.json();
    if (data.player) {
        playSoundbuy();
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
    } else if (!data.result) {
        playSoundcurse();
        let fuelinfo = document.getElementById("fuelinfo");
        let questionParagraph = document.createElement("p");
        questionParagraph.textContent = "Purchase failed, you dont have enough money :(";
        fuelinfo.appendChild(questionParagraph);
        setTimeout(() => {
            clearData();
            }, "4000");
    }
     else {
        alert("Purchase failed");
    }
    } else {
        playSoundcurse();
        let fuelinfo = document.getElementById("fuelinfo");
        let questionParagraph = document.createElement("p");
        questionParagraph.textContent = "Please enter a valid number >0 :(";
        fuelinfo.appendChild(questionParagraph);
        setTimeout(() => {
            clearData();
            }, "4000");

    }

}
async function fetchCountries() {
  clearData2();
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
  let list = data["countries"];
  list.forEach((country) => {
    let questionOption = document.createElement("button");
    questionOption.textContent = country;
    questionOption.addEventListener("click", function (evt) {
      playSound();
      fetchAirports(questionOption.textContent);
    });
    question.appendChild(questionOption);
  });
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
  removeAllMarkers();
  data["airports"].forEach((a) => {
    L.marker([a.latitude, a.longitude]).addTo(markerGroup)
    .bindPopup(`${a.airport} has ${a.people} people and fuel price of ${a.fuel_price}.${a.probability}`);

    let airportOption = document.createElement("button");
    airportOption.textContent = decodeURI(a.airport);
    airportChoices.appendChild(airportOption);

    airportOption.addEventListener("click", function (evt) {
      playSoundfly();
      travel(airportOption.textContent);
    });
  });
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
    if (data.player) {
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
  probability.textContent = "You have earned "  + data.people*100 + " money";
  statusList.appendChild(name);
  statusList.appendChild(people);
  statusList.appendChild(fuel_price);
  statusList.appendChild(probability);
  airportStatus.appendChild(statusList);

  setTimeout(() => {
    if (parseInt(fuel.textContent) < 0 || parseInt(peopleSaved.textContent) > 150) {
      console.log("GAME OVER");
      playSoundlose();
      openModal1();
    } else if (parseInt(peopleSaved.textContent) >= 100 && parseInt(placesVisited.textContent) >= 5) {
      console.log("Congratulations! You've won the game.");
      playSoundwin();
      openModal2();
    } else {
      let probability = parseInt(data.probability);
      console.log(probability);
      if (probability < 6) {
        createRobAirportElements();
      } else if (probability > 15 ) {
        createBlessAirportElements();
      } else {
        fetchCountries();}
    }
  }, 5000);
}
function createBlessAirportElements() {
    playSoundbless();
    clearData2();
  let airportStatus = document.getElementById("question");
  let statusParagraph = document.createElement("p");
  statusParagraph.textContent = "You have found a reward chest. Choose 1 option ";
  airportStatus.appendChild(statusParagraph);
  const button1 = document.createElement('button');
  button1.innerHTML = 'Gain 2000 money';
  button1.addEventListener("click", function (evt) {
    handleOption1();
  })

  const button2 = document.createElement('button');
  button2.innerHTML = 'Increase fuel efficiency by 0.2';
  button2.addEventListener("click", function (evt) {
    handleOption2();
  })

  airportStatus.appendChild(button1);
  airportStatus.appendChild(button2);
 }
 function createRobAirportElements() {
    playSoundcurse();
    clearData2();
  let airportStatus = document.getElementById("question");
  let statusParagraph = document.createElement("p");
  statusParagraph.textContent = "You have received a curse. Choose 1 option ";
  airportStatus.appendChild(statusParagraph);
  const button1 = document.createElement('button');
  button1.innerHTML = 'Your money will be half less';
  button1.addEventListener("click", function (evt) {
    handleOption3();
  })

  const button2 = document.createElement('button');
  button2.innerHTML = 'Decrease fuel efficiency by 0.2';
  button2.addEventListener("click", function (evt) {
    handleOption4();
  })

  airportStatus.appendChild(button1);
  airportStatus.appendChild(button2);
 }
async function handleOption1() {
    const response = await fetch('/handlefunction1', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({username}),
    });
    const data = await response.json();
    if (data.player){
        updateStatus(data);
        fetchCountries();
    } else {
        console.log("Choice 1 failed.");
    }
}
async function handleOption2() {
    const response = await fetch('/handlefunction2', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({username}),
    });
    const data = await response.json();
    if (data.player){
        updateStatus(data);
        fetchCountries();
    } else {
        console.log("Choice 2 failed.");
    }
}
async function handleOption3() {
    const response = await fetch('/handlefunction3', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({username}),
    });
    const data = await response.json();
    if (data.player){
        updateStatus(data);
        fetchCountries();
    } else {
        console.log("Choice 3 failed.");
    }
}
async function handleOption4() {
    const response = await fetch('/handlefunction4', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({username}),
    });
    const data = await response.json();
    if (data.player){
        updateStatus(data);
        fetchCountries();
    } else {
        console.log("Choice 4 failed.");
    }
}
async function startOver() {
    const response = await fetch('/startover', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({username}),
    });
    const data = await response.json();
    if (data.player) {
        console.log(data);
        updateStatus(data);
        fetchCountries();
    } else {
        alert("Status update failed.");
    }
}
async function main(){
  await fetchStatus();
  if (parseInt(fuel.textContent) < 0 || parseInt(peopleSaved.textContent) > 150 || parseInt(peopleSaved.textContent) >= 100 && parseInt(placesVisited.textContent) >= 5) {
    let userResponse = confirm("\"Do you want to play again?\nOK to play again or Cancel to not." );
    if (userResponse) {
      clearData();
      startOver();
    } else if (!userResponse) {
        window.location.href = '/'
    }
  } else {
    fetchCountries();
  }
}
main();
