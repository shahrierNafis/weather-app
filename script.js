/**
 * Fetches weather Info for a given location.
 *
 * @param {string} location - The location to fetch weather Info for.
 * @returns {Promise<object>} - A promise that resolves to the weather Info.
 */
async function fetchWeatherInfo(location) {
    // Define the API key for accessing the weather API
    const apiKey = '719f8b7dffb745269d524123233108';
    console.log('apiKey:', apiKey);

    // Create the API URL with the location and API key
    const apiUrl = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${location}`;
    console.log('apiUrl:', apiUrl);

    // Fetch the weather Info from the API
    const response = await fetch(apiUrl);
    console.log('response:', response);

    // Parse the response Info as JSON
    const Info = await response.json();
    console.log('Info:', Info);

    // Check if there is an error in the response Info
    if (Info.error) {
        throw Info.error;
    }

    // Return the weather Info
    return Info;
}
/**
 * Retrieves weather information from the provided Info object.
 *
 * @param {Object} Info - The Info object containing weather data.
 * @returns {Object} - The extracted weather information.
 */
function getWeatherInfo(Info) {
    // Destructure the 'current' and 'location' properties from the Info object
    const { temp_c, temp_f, precip_mm, humidity, wind_kph, condition, last_updated_epoch } = Info.current;
    const { name: city } = Info.location;

    // Return the extracted weather information
    return { temp_c, temp_f, precip_mm, humidity, wind_kph, city, condition, last_updated_epoch };
}
/**
 * Sets the weather information on the webpage.
 * 
 * @param {Object} info - The weather information object.
 * @param {number} info.temp_c - The temperature in Celsius.
 * @param {number} info.temp_f - The temperature in Fahrenheit.
 * @param {number} info.precip_mm - The precipitation in millimeters.
 * @param {number} info.humidity - The humidity percentage.
 * @param {number} info.wind_kph - The wind speed in kilometers per hour.
 * @param {string} info.city - The city name.
 * @param {Object} info.condition - The weather condition object.
 * @param {string} info.condition.text - The weather condition text.
 * @param {string} info.condition.icon - The URL of the weather condition icon.
 * @param {number} info.last_updated_epoch - The epoch timestamp of the last update.
 */
function setWeatherInfo(info) {
    const { temp_c, temp_f, precip_mm, humidity, wind_kph, city, condition, last_updated_epoch } = info;
    console.log(temp_c, temp_f, precip_mm, humidity, wind_kph, city, condition, last_updated_epoch);

    // Set temperature
    const temperatureDiv = document.querySelector('#temperature');
    temperatureDiv.innerText = `${temp_c}°C`

    //Temperature switcher
    temperatureDiv.onclick = (() => {
        if (temperatureDiv.innerText === `${temp_c}°C`) {
            temperatureDiv.innerText = `${temp_f}°F`
        } else {
            temperatureDiv.innerText = `${temp_c}°C`
        }
    })

    // Set Precipitation
    const precipitationDiv = document.querySelector('#precipitation');
    precipitationDiv.innerText = `Precipitation: ${precip_mm} mm`;

    // Set Humidity
    const humidityDiv = document.querySelector('#humidity');
    humidityDiv.innerText = `Humidity: ${humidity}%`;

    // Set Wind
    const windDiv = document.querySelector('#wind');
    windDiv.innerText = `Wind: ${wind_kph} km/h`;

    // Set location
    const locationDiv = document.querySelector('#location');
    locationDiv.innerText = city;

    // Set Condition
    const conditionDiv = document.querySelector('#condition');
    conditionDiv.innerText = condition.text;

    // Set Condition Icon
    const conditionIcon = document.querySelector('#condition-icon');
    conditionIcon.src = `https:${condition.icon}`;
    conditionIcon.alt = condition.text;
    conditionIcon.title = condition.text;

    // Set time
    const timeDiv = document.querySelector('#last-updated');
    lastUpdated = new Date(last_updated_epoch * 1000)
    const weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    time = new Intl.DateTimeFormat('default',
        {
            hour12: true,
            hour: 'numeric',
            minute: 'numeric'
        }).format(lastUpdated);
    timeDiv.innerText = `${weekday[lastUpdated.getDay()]}, ${time}`;

    // Store variables in the global scope
    window.temperatureDiv = temperatureDiv
    window.temp_c = temp_c
    window.temp_f = temp_f
}

/**
 * Fetches weather information for a given location and updates the UI with the weather data.
 * @param {string} location - The location for which weather information is to be fetched.
 */
function showWeatherInfo(location) {
    fetchWeatherInfo(location)
        .then(getWeatherInfo)
        .then(setWeatherInfo)
        .catch((err) => {
            // Display error message and remove it after 500 milliseconds
            document.querySelector('#location-quarry').classList.add('error');
            setTimeout(() => {
                document.querySelector('#location-quarry').classList.remove('error');
            }, 500);
        });
}

// Get current location and set weather
navigator.geolocation.getCurrentPosition((position) => {
    let lat = position.coords.latitude;
    let long = position.coords.longitude;
    showWeatherInfo(`${lat},${long}`);
})


// Event listener for keyup on locationQuarryInput
const locationQuarryInput = document.querySelector('#location-quarry');
locationQuarryInput.addEventListener('keyup', function (event) {
    // Check if the Enter key is pressed
    if (event.key === "Enter") {
        const locationQuarry = event.target.value;
        showWeatherInfo(locationQuarry);
    }
})

// Event listener for click on searchBtn
const searchBtn = document.querySelector('#search-btn');
searchBtn.addEventListener('click', () => {
    const locationQuarry = document.querySelector('#location-quarry').value;
    showWeatherInfo(locationQuarry);
})

