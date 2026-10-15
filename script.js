const cityInput = document.querySelector('.city-input')
const searchBtn = document.querySelector('.search-btn')

const weatherInfoSection = document.querySelector('.weather-info')
const searchCitySection = document.querySelector('.search-city')
const notFoundSection = document.querySelector('.not-found')

const countryTxt = document.querySelector('.country-txt')
const tempTxt = document.querySelector('.temp-txt')
const conditionTxt = document.querySelector('.condition-txt')
const humidityValueTxt = document.querySelector('.humidity-value-txt')
const windValueTxt = document.querySelector('.wind-value-txt')
const weatherSummaryImg = document.querySelector('.weather-summary-img')
const currentDateTxt = document.querySelector('.current-date-txt')

const forecastItemsContainer = document.querySelector('.forecast-items-container')

searchBtn.addEventListener('click', () => {
    if (cityInput.value.trim() != '') {
        updateWeatherInfo(cityInput.value)
        cityInput.value = ''
        cityInput.blur()
    }
})

cityInput.addEventListener('keydown', (event) => {
    if (event.key =='Enter' && 
        cityInput.value.trim() != '')
        {
            updateWeatherInfo(cityInput.value)
            cityInput.value = ''
            cityInput.blur()
        }
})

async function getFetchData(endPoint, city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/${endPoint}?q=${city}&appid=${apiKey}&units=metric`
    
    const response = await fetch(apiUrl)
    return response.json()
}

function getCurrentDate(timezoneOffset) {
    const utcTime = new Date().getTime() + (new Date().getTimezoneOffset() * 60000)
    const cityTime = new Date(utcTime + (timezoneOffset * 1000))

    const options = {
        weekday: 'short',
        day: '2-digit',
        month: 'short'
    }
    
    return cityTime.toLocaleDateString('en-GB', options)
}

function getWeatherIcon(id, isDay = true) {
    if (id <= 232) return 'Thunderstorm.png'
    if (id <= 321) return 'ShowerRain.png'
    if (id == 511) return 'Snow.png'
    if (id <= 531) return isDay ? 'RainSun.png' :'RainMoon.png'
    if (id <= 622) return 'Snow.png'
    if (id <= 781) return 'Mist.png'
    if (id <= 800) return isDay ? 'Sun.png' : 'Moon.png'
    if (id == 801) return isDay ? 'FewCloudsSun.png' : 'FewCloudsMoon.png'
    if (id == 802) return 'Clouds.png'
    else return 'BrokenClouds.png'
}

async function updateWeatherInfo(city) {
    const weatherData = await getFetchData('weather', city)
    if (weatherData.cod != 200) {
        showDisplaySection(notFoundSection)
        return 
    }
    console.log(weatherData)
    const {
        name: country,
        main: {
            temp, humidity
        },
        weather: [{id, main}],
        wind: {speed},
        sys: {sunrise, sunset},
        dt
    } = weatherData

    countryTxt.textContent = country
    tempTxt.textContent = Math.round(temp) + ' °C'
    conditionTxt.textContent = main
    humidityValueTxt.textContent = humidity + '%'
    windValueTxt.textContent = speed + ' M/s'

    currentDateTxt.textContent = getCurrentDate(weatherData.timezone)

    const isDay = dt >= sunrise && dt < sunset
    weatherSummaryImg.src = `assets/weather/${getWeatherIcon(id, isDay)}`

    await updateForecastInfo(city)
    showDisplaySection(weatherInfoSection)
}

async function updateForecastInfo(city) {
    const forecastsData = await getFetchData('forecast', city)
    const timeTaken = '12:00:00'

    const timezoneOffset = forecastsData.city.timezone

    const utcTime = new Date().getTime() + (new Date().getTimezoneOffset() * 60000)
    const cityTime = new Date(utcTime + (timezoneOffset * 1000))
    const todayDate = cityTime.toISOString().split('T')[0]

    forecastItemsContainer.innerHTML = ''
    forecastsData.list.forEach(forecastWeather => {
        if (forecastWeather.dt_txt.includes(timeTaken) && !forecastWeather.dt_txt.includes(todayDate)) {
            updateForecastItems(forecastWeather)
        }
    })
}

function updateForecastItems(weatherData) {
    const {
        dt_txt: date,
        weather: [{id}],
        main: {temp}
    } = weatherData

    const dateTaken = new Date(date)
    const dateOption = {
        day: '2-digit',
        month: 'short'
    }

    const dateResult = dateTaken.toLocaleDateString('en-US', dateOption)

    const forecastItem = `
        <div class="forecast-item">
            <h5 class="forecast-item-date regular-txt">${dateResult}</h5>
            <img src="assets/weather/${getWeatherIcon(id)}" alt="" class="forecast-item-img">
            <h5 class="forecast-item-temp">${Math.round(temp)} °C</h5>
        </div>
    `

    forecastItemsContainer.insertAdjacentHTML('beforeend', forecastItem)
}

function showDisplaySection(section) {
    [weatherInfoSection, searchCitySection, notFoundSection]
        .forEach(section => section.style.display = 'none')
    section.style.display = 'flex'
}