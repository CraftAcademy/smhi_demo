import React, { useState, useEffect } from 'react'
import { Container, Header } from 'semantic-ui-react'
import axios from 'axios'

const App = () => {
  const [weatherData, setWeatherData] = useState({})

  useEffect(async () => {
    const response = await axios.get(
      'https://opendata-download-metfcst.smhi.se/api/category/pmp3g/version/2/geotype/point/lon/18.063240/lat/59.334591/data.json'
    )
  }, [])

  return (
    <Container>
      <Header as="h2">SMHI Prognos för Stockholm</Header>
    </Container>
  )
}

export default App

