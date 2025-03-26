document.addEventListener("DOMContentLoaded", () => {
    fetchPlanets();
    fetchDwarfPlanets();
    
    document.getElementById("filter").addEventListener("change", filterPlanets);
});

let celestialBodies = [];

function fetchPlanets() {
    fetch("http://localhost:3000/planets")
        .then(response => response.json())
        .then(data => {
            celestialBodies = [...celestialBodies, ...data];
            displayCelestialBodies(celestialBodies);
        })
        .catch(error => console.error("Error fetching planets:", error));
}

function fetchDwarfPlanets() {
    fetch("http://localhost:3000/dwarfPlanets")
        .then(response => response.json())
        .then(data => {
            celestialBodies = [...celestialBodies, ...data];
            displayCelestialBodies(celestialBodies);
        })
        .catch(error => console.error("Error fetching dwarf planets:", error));
}

function displayCelestialBodies(data) {
    const planetList = document.getElementById("planet-list");
    planetList.innerHTML = "";

    data.forEach(body => {
        const div = document.createElement("div");
        div.className = "planet-card";
        div.innerHTML = `
            <h3>${body.name}</h3>
            <img src="${body.image}" alt="${body.name}">
        `;

        
        div.addEventListener("click", () => displayPlanetDetails(body));

        planetList.appendChild(div);
    });
}


function displayPlanetDetails(body) {
    const detailsSection = document.getElementById("planet-details");
    detailsSection.innerHTML = `
         <button class="close-button" onclick="hideDetails()">❌</button>
        <h2>${body.name}</h2>
        <img src="${body.image}" alt="${body.name}">
        <p>${body.description}</p>
        <p><strong>Type:</strong> ${body.type}</p>
        <p><strong>Distance from Sun:</strong> ${body.distanceFromSun} km</p>
        <p><strong>Number of Moons:</strong> ${body.moons}</p>
        <button class="favorite-btn" data-name="${body.name}" data-image="${body.image}">⭐ Add to Favorites</button>
    `;

    
    document.querySelector(".favorite-btn").addEventListener("click", function () {
        addToFavorites(body.name, body.image);
    });
}

function hideDetails() {
    document.getElementById("planet-details").innerHTML = "";
}


function filterPlanets() {
    const selectedType = document.getElementById("filter").value;
    if (selectedType === "all") {
        displayCelestialBodies(celestialBodies);
    } else {
        const filtered = celestialBodies.filter(body => body.type.toLowerCase() === selectedType);
        displayCelestialBodies(filtered);
    }
}


let favorites = JSON.parse(localStorage.getItem("favorites")) || [];


function addToFavorites(name, image) {
  if (!favorites.some(fav => fav.name === name)) {
    favorites.push({ name, image });
    localStorage.setItem("favorites", JSON.stringify(favorites));
    displayFavorites();
  }
}


function displayFavorites() {
  const favoritesList = document.getElementById("favorites-list");
  if (!favoritesList) return; 

  favoritesList.innerHTML = "";
  favorites.forEach(fav => {
    const favCard = document.createElement("div");
    favCard.classList.add("planet-card");
    favCard.innerHTML = `
      <h3>${fav.name}</h3>
      <img src="${fav.image}" alt="${fav.name}">
      <button onclick="removeFromFavorites('${fav.name}')">❌ Remove</button>
    `;
    favoritesList.appendChild(favCard);
  });
}


function removeFromFavorites(name) {
  favorites = favorites.filter(fav => fav.name !== name);
  localStorage.setItem("favorites", JSON.stringify(favorites));
  displayFavorites();
}


document.addEventListener("DOMContentLoaded", displayFavorites);


const darkModeToggle = document.getElementById("dark-mode-toggle");


if (localStorage.getItem("darkMode") === "light") {
    document.body.classList.add("light-mode");
}


darkModeToggle.addEventListener("click", () => {
    document.body.classList.toggle("light-mode");

    
    if (document.body.classList.contains("light-mode")) {
        localStorage.setItem("darkMode", "light");
    } else {
        localStorage.setItem("darkMode", "dark");
    }
});
