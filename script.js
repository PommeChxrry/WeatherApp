const cityInput = document.querySelector('.city-input')
const searchBtn = document.querySelector('.search-btn')

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
    const apiUrl = `https://api.openweathermap.org/data/2.5/${endPoint}?q=${city}&appid=${apiKey}`
    
    const response = await fetch(apiUrl)
    return response.json()
}

async function updateWeatherInfo(city) {
    const weatherData = await getFetchData('weather', city)
    console.log(weatherData)
}