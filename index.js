// Getting all necessary elements from DOM

const app = document.querySelector('.weather-app');
const temp = document.querySelector('.temp');
const dateOutput = document.querySelector('.date')
const timeOutput = document.querySelector('.time')
const conditionOutput = document.querySelector('.condition')
const nameOutput = document.querySelector('.name')
const icon = document.querySelector('.icon')
const cloudOutput = document.querySelector('.cloud')
const humidityOutput = document.querySelector('.humidity')
const windOutput = document.querySelector('.wind')
const form = document.getElementById('locationInput');
const search = document.querySelector('.search')
const btn = document.querySelector('.submit-button')
const cities = document.querySelectorAll('.city')

// Default city when the page lands
let cityInput = "London"

// Add click event to each city in each panel
cities.forEach((city) => {
    city.addEventListener('click', (e) => {
        cityInput = e.target.innerHTML;
        fetchWeatherData();
        app.getElementsByClassName.opacity = "0";
    });
})

// Add submit event to the form
form.addEventListener('submit', (e) => {
    if(search.value.length == 0) {
        alert('Please type in a city name')
    }
    else {
        cityInput = search.value
        
        // Function to fetch and display data from weather api
        fetchWeatherData();

        // Removing all text from search box
        search.value = "";

        // Fading out the app (animation)
        app.style.opacity = "0";
    }
    //  Prevents default behaviour of the form
        e.preventDefault();
});

// To return day from date 
function dayOfTheWeek(day, month, year) {
    const weekday = [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday'
    ];
    return weekday[new Date(`${year}-${month}-${day}`).getDay()]
}

// Function that fetches and displays weather data from the WeatherAPI
function fetchWeatherData() {
    fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${cityInput}?unitGroup=metric&key=VBV8J4HDTT2XXK5WQ8BC77E3S`)
    // Taking data (response) and converting it into json format
    .then(response => response.json())
    .then(data => {
        
        // Adding temp and weather conditions to the page
        temp.innerHTML = data.currentConditions.temp + "&#176"
        conditionOutput.innerHTML = data.days[0].conditions;

        // Converting date and time from the city and extracing them into day, month, year and time (individual variables)
        const date = data.days[0].datetime;
        const y = parseInt(date.substr(0,4));
        const m = parseInt(date.substr(5,2));
        const d = parseInt(date.substr(8,2));
        const time = data.currentConditions.datetime;
        const hour = parseInt(time.substr(0,2))

        // Reformatting the date into a more readable format
        dateOutput.innerHTML = `${dayOfTheWeek(d, m, y)} ${d}, ${m}, ${y}`
        timeOutput.innerHTML = time;

        // Adding Name of the city to the page
        nameOutput.innerHTML = data.address[0].toUpperCase() + data.address.slice(1);

        // Getting corresponding icon uri for the weather and extract a part of it
        const iconName = data.days[0].icon;

        // Set default time of day
        let timeOfDay = "day";
        let imageName = "cloudy"

        if (iconName.includes("sun") && iconName.includes("cloud")) {
            icon.src = "./icons/" + "sunny-cloud.png"
            imageName = "cloudy"

        } else if (iconName.includes("sunny")) {
            icon.src = "./icons/" + "sun.png"
            imageName = "clear"
        } else if (iconName.includes("clear")) {
            icon.src = "./icons/" + "sun.png"
            imageName = "clear"
        } 
        else if (iconName.includes("snow")) {
            icon.src = "./icons/" + "snow.png"
            imageName = "snowy"
        } 
        else if (iconName.includes("rain")) {
            icon.src = "./icons/" + "rain.png"
            imageName = "rainy"
        } else if (iconName.includes("cloud")) {
            icon.src = "./icons/" + "cloud.png"
            imageName = "cloudy"
        } else {
            icon.src = "./icons/" + "sun.png"
        }

        if (hour > 18 || hour < 6) {
                timeOfDay = "night"
                if (iconName.includes("clear")) {
                    icon.src = "./icons/" + "moon.png"
                }
        }

        // Adding the weather details to the page
        cloudOutput.innerHTML = data.currentConditions.cloudcover + '%';
        humidityOutput.innerHTML = data.currentConditions.humidity + '%'
        windOutput.innerHTML = data.currentConditions.windspeed + ' km/h';

        // Setting background image 
        app.style.backgroundImage = `url(./images/${timeOfDay}/${imageName}.jpg)`;
        if(timeOfDay == "night") {
            btn.style.background = "#181e27"
        }
            // Fade in the page once all is done
            app.style.opacity = "1"
        })
        // If the suer enters a city that doesn't exist
        .catch(() => {
            alert("City not found, please enter a different city");
            app.style.opacity = "1";
        })
}

// Calling the function on page load
fetchWeatherData();

// Fade in the page
app.style.opacity = "1";
