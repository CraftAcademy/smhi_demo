import React, { useState, useEffect } from 'react'
import { Container, Header } from 'semantic-ui-react'
import axios from 'axios'

const App = () => {
  const [weatherData, setWeatherData] = useState({})
  const [locationData, setLocationData] = useState({})

  useEffect(async () => {
    const response = await axios.get(
      'https://opendata-download-metfcst.smhi.se/api/category/pmp3g/version/2/geotype/point/lon/18.063240/lat/59.334591/data.json'
    )
    setWeatherData(response.data)

  }, [])

  const getLocationFromZipCode =  async (zipcode) => {
    let locationData = await axios.get(`http://api.zippopotam.us/se/${zipcode.replace(/\s/g,'')}`)

  }

  const getTemperature = () => {
    if (Object.entries(weatherData).length > 0) {
      let temperatureParam = weatherData.timeSeries[0].parameters.filter(param => param.name == 't')
      let temperature = temperatureParam[0].values[0]
      return temperature
    }
  }

  const getCurrentConditions = () => {
    if (Object.entries(weatherData).length > 0) {
      let currentConditionsParam = weatherData.timeSeries[0].parameters.filter(param => param.name == 'Wsymb2')
      // debugger
      let currentConditions = currentConditionsParam[0].values[0]
      const weatherValues = [
        'Clear sky',
        'Nearly clear sky',
        'Variable cloudiness',
        'Halfclear sky',
        'Cloudy sky',
        'Overcast',
        'Fog',
        'Light rain showers',
        'Moderate rain showers',
        'Heavy rain showers',
        'Thunderstorm',
        'Light sleet showers',
        'Moderate sleet showers',
        'Heavy sleet showers',
        'Light snow showers',
        'Moderate snow showers',
        'Heavy snow showers',
        'Light rain',
        'Moderate rain',
        'Heavy rain',
        'Thunder',
        'Light sleet',
        'Moderate sleet',
        'Heavy sleet',
        'Light snowfall',
        'Moderate snowfall',
        'Heavy snowfall'
      ]
      return weatherValues[currentConditions - 1]
    }
  }
  return (
    <Container>
      <Header as="h2">SMHI Prognos för Stockholm</Header>
      <p>Current temperature is {getTemperature()} &#8304;</p>
      <p> {getCurrentConditions()}</p>
    </Container>
  )
}

export default App

