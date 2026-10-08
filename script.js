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

function getWeatherIcon(id) {
    if (id <= 232) return 'Thunderstorm.png'
    if (id <= 321) return 'ShowerRain.png'
    if (id == 511) return 'Snow.png'
    if (id <= 531) return 'RainSun.png'
    if (id <= 622) return 'Snow.png'
    if (id <= 781) return 'Mist.png'
    if (id <= 800) return 'Sun.png'
    if (id == 801) return 'FewCloudsSun.png'
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
        wind: {speed}
    } = weatherData

    countryTxt.textContent = country
    tempTxt.textContent = Math.round(temp) + ' °C'
    conditionTxt.textContent = main
    humidityValueTxt.textContent = humidity + '%'
    windValueTxt.textContent = speed + ' M/s'
    weatherSummaryImg.src = `assets/weather/${getWeatherIcon(id)}`


    showDisplaySection(weatherInfoSection)
}

function showDisplaySection(section) {
    [weatherInfoSection, searchCitySection, notFoundSection]
        .forEach(section => section.style.display = 'none')
    section.style.display = 'flex'
}