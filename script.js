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

function getFetchData() {
    
}

function updateWeatherInfo(city) {
    const weatherData = getFetchData()
}