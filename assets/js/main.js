// __________OVERLAY__________
const overlay = document.querySelector('#overlay');
const overlayToggle = document.querySelector('.overlay-toggle');
const overlayContent = document.querySelector('.overlay-content');

let angle = 0;

overlayToggle.addEventListener('click', function () {
  if (overlay.className == 'overlay-display') {
    overlay.className = 'overlay-hide';
    overlayContent.style.display = 'none';
    document.body.classList.remove('body-overflow');
  } else {
    overlay.className = 'overlay-display';
    overlayContent.style.display = 'block';
    document.body.classList.add('body-overflow');
  }

  angle += 45;
  document.querySelector('.fa-close').style.transform = 'rotate(' + angle + 'deg)';
});

// __________WEATHER APP__________
const apiKey = 'APPID=0d9bf5644d445d0b5eff3e004d45e2aa';
const notificationElement = document.querySelector('.notification');
const iconElement = document.querySelector('.weather-icon');
const tempElement = document.querySelector('.temperature p');
const locationElement = document.querySelector('.location p');
const unitsButton = document.querySelector('.weather-app button');

const weather = {};

// Local storage
let units = localStorage.getItem('units');
localStorage.setItem('units', 'metric');

// Cookies
let unitsCookie = getCookie('units');

function setCookie(name, value, days) {
  var expires = '';
  if (days) {
    var date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = '; expires=' + date.toUTCString();
  }
  document.cookie = name + '=' + (value || '') + expires + '; path=/';
}

function getCookie(name) {
	var nameEQ = name + '=';
	var ca = document.cookie.split(';');
	for (var i = 0; i < ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0) == ' ') c = c.substring(1, c.length);
		if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
	}
	return null;
}

function eraseCookie(name) {
	document.cookie = name + '=; Max-Age=-99999999;';
}

// Geolocation
navigator.geolocation.getCurrentPosition(getWeather, getError);

function getError(error) {
  notificationElement.getElementsByClassName.display = 'block';
  notificationElement.innerHTML = `<p>${error.message}</p>`;
}

function getWeather(position) {
  const lat = position.coords.latitude;
  const long = position.coords.longitude;
  let weatherAPI = '';
  // console.log(lat, long);
  const celsius = 'units=metric';
  const fahrenheit = 'units=imperial';
  // console.log(units);

  if (unitsCookie !== 'imperial') {
    weatherAPI = `http://api.openweathermap.org/data/2.5/weather?&lat=${lat}&lon=${long}&${celsius}&${apiKey}`;
  } else {
    weatherAPI = `http://api.openweathermap.org/data/2.5/weather?&lat=${lat}&lon=${long}&${fahrenheit}&${apiKey}`;
  }
  // console.log(weatherAPI);

  fetch(weatherAPI)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      // console.log(data);
      weather.temperature = data.main.temp.toFixed(1);
      weather.location = data.name;
      weather.iconId = data.weather[0].icon;
    })
    .then(function () {
      displayWeather();
    });
}

function displayWeather() {
  iconElement.innerHTML = `<img src="/assets/img/weather/${weather.iconId}.png">`;
  if (unitsCookie === 'metric') {
    tempElement.innerHTML = `${weather.temperature}°<span>C</span>`;
  } else {
    tempElement.innerHTML = `${weather.temperature}°<span>F</span>`;
  }
  locationElement.innerHTML = `${weather.location}`;
}

unitsButton.addEventListener('click', function () {
  units = localStorage.getItem('units');
  unitsCookie = getCookie('units');
  console.log(unitsCookie);

  if (unitsCookie === 'metric') {
    localStorage.setItem('units', 'imperial');
    units = localStorage.getItem('units');

    setCookie('units', 'imperial', 99999);
    unitsCookie = getCookie('units');
    console.log(unitsCookie);

    navigator.geolocation.getCurrentPosition(getWeather, getError);
  } else {
    localStorage.setItem('units', 'metric');
    units = localStorage.getItem('units');

    setCookie('units', 'metric', 99999);
    unitsCookie = getCookie('units');
    console.log(unitsCookie);

    navigator.geolocation.getCurrentPosition(getWeather, getError);
  }
});


// __________CLOCK & GREETING__________
const time = document.getElementById('time');
const greeting = document.getElementById('greeting');

// Show Time
function showTime() {
  let today = new Date();
  let hour = today.getHours();
  let min = today.getMinutes();
  let sec = today.getSeconds();

  // Set AM PM
  const amPm = hour >= 12 ? 'PM' : 'AM';

  // 12hr Format
  hour = hour % 12 || 12;

  // Output time
  time.innerHTML = `${hour}<span>:</span>${addZero(min)}<span>:</span>${addZero(sec)} ${amPm}`;

  setTimeout(showTime, 1000);
}

// Add Zeros to time format
function addZero(number) {
  return (parseInt(number, 10) < 10 ? '0' : '') + number;
}

// Set Background and Greeting for time of day
function setBackgroundGreet() {
  let today = new Date();
  let hour = today.getHours();

  if (hour < 12) {
    // Morning
    overlay.style.backgroundImage = "url('https://source.unsplash.com/1920x1080/?nature,morning')";
    greeting.textContent = 'Good Morning!';
  } else if (hour < 18) {
    //Afternoon
    overlay.style.backgroundImage = "url('https://source.unsplash.com/1920x1080/?nature,afternoon')";
    greeting.textContent = 'Good Afternoon!';
  } else {
    // Evening
    overlay.style.backgroundImage = "url('https://source.unsplash.com/1920x1080/?nature,night')";
    greeting.textContent = 'Good Evening!';
  }
}

// Run clock
showTime();
setBackgroundGreet();

// Buttons ripple effect
const allButtons = document.querySelectorAll('button');
allButtons.forEach(btn => {
  btn.addEventListener('click', function(e) {
    let x = e.clientX - e.target.offsetLeft;
    let y = e.clientY - e.target.offsetTop;

    let ripples = document.createElement('span');
    ripples.style.left = x + 'px';
    ripples.style.top = y + 'px';
    this.appendChild(ripples);

    setTimeout(() => {
      ripples.remove();
    }, 1000);
  })
})


// __________BAFFLE TITLE__________
const text = baffle('.baffle-title');
text.set({
  characters : '░▒/ ░>/▓▓ █▓▓>▓ █▓█ ▒█▒// ░█▒▒ ▓>/ ▒▒░▒ <░▓█',
  speed: 120
});

setInterval(function() {
  text.start();
  text.reveal(4000);
}, 10000);


// __________NAV__________

function navSlide() {
  const hamburger = document.querySelector('.hamburger');
  const nav = document.querySelector('.nav-links');
  const navLinks = document.querySelectorAll('.nav-links li');

  hamburger.addEventListener('click', function() {
    // Toggle Nav
    nav.classList.toggle('nav-active');


    // Animate Links
    navLinks.forEach((link, index) => {
      if (link.style.animation) {
        link.style.animation = '';
      } else {
        link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
      }
    });

    // Hamburger animation
    hamburger.classList.toggle('toggle-burger');
  });

  
}

navSlide();


