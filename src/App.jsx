import React, { useState, useEffect } from 'react'
import { Container, Header, Form, Button } from 'semantic-ui-react'
import { PRECIP_TYPE, WEATHER_VALUES, degToCompass } from './weatherConstants'
import axios from 'axios'

const App = () => {
  const [weatherData, setWeatherData] = useState({})
  const [locationData, setLocationData] = useState('Stockholm')

  useEffect(async () => {
    await getWeatherFromSMHI()
  }, [])

  const getWeatherFromSMHI = async (lat, long) => {
    let latitude = lat || 59.334591
    let longitude = long || 18.063240
    const response = await axios.get(
      `https://opendata-download-metfcst.smhi.se/api/category/pmp3g/version/2/geotype/point/lon/${longitude}/lat/${latitude}/data.json`
    )
    setWeatherData(response.data)
  }

  const getLocationFromZipCode = async (zipcode) => {
    let locationData = await axios.get(`http://api.zippopotam.us/se/${zipcode.replace(/\s/g, '')}`)
    return locationData.data.places[0]
  }

  const getParamValue = (paramName) => {
    if (Object.entries(weatherData).length > 0) {
      const paramData = weatherData.timeSeries[0].parameters.filter(param => param.name === paramName)
      const value = paramData[0].values[0]
      return value
    }
  }

  const getParamValueFromList = (paramName, list) => {
    if (Object.entries(weatherData).length > 0) {
      const paramData = weatherData.timeSeries[0].parameters.filter(param => param.name === paramName)
      const index = paramData[0].values[0]
      return list[index]
    }
  }

  const handleFormSubmit = async (event) => {
    event.preventDefault()
    let data = await getLocationFromZipCode(event.target.zipcode.value)
    getWeatherFromSMHI(data.latitude, data.longitude)
    setLocationData(data["place name"])
  }

  return (
    <Container>
      <Header as="h2">Search by Swedish Zip code</Header>
      <Form onSubmit={(e) => handleFormSubmit(e)}>
        <Form.Input
          label="Swedish zipcode"
          action="Submit"
          name="zipcode"
          width={4} />
      </Form>
      <Header as="h2">SMHI Prognos for {locationData}</Header>
      <Header as="p">Current temperature is {getParamValue("t")} &#8304;</Header>
      <Header as="p">Condition: {getParamValueFromList("Wsymb2", WEATHER_VALUES)}</Header>
      <Header as="p">Precipitation type is: {getParamValueFromList("pcat", PRECIP_TYPE)}</Header>
      <Header as="p">Wind speed is {getParamValue("ws")} m/s</Header>
      <Header as="p">Wind direction is {`${getParamValue("wd")} degrees (${degToCompass(getParamValue("wd"))})`} </Header>
      <Header as="p">Wind gust is {getParamValue("gust")} m/s</Header>
      <Header as="p">Air pressure is {getParamValue("msl")} hPa</Header>
      <Header as="p">Precipition intensity is between {getParamValue("pmin")} and {getParamValue("pmax")} mm/h</Header>
      <Header as="p">Thunder probability is {getParamValue("tstm")} %</Header>
    </Container>
  )
}

export default App

