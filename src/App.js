// https://opendata.cwb.gov.tw/dist/opendata-swagger.html#/%E9%A0%90%E5%A0%B1/get_v1_rest_datastore_F_C0032_001
// https://github.com/pjchender/learn-react-from-hook-realtime-weather-app/blob/master/README.md

import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { ReactComponent as DayCloudyIcon } from './images/day-cloudy.svg'
import { ReactComponent as AirFlowIcon } from './images/airFlow.svg'
import { ReactComponent as RainIcon } from './images/rain.svg'
import { ReactComponent as RefreshIcon } from './images/refresh.svg'
import { ReactComponent as LoadingIcon } from './images/loading.svg'


import { ThemeProvider } from '@emotion/react'

const AUTHORIZATION_KEY= 'CWB-99C1E0AF-7562-4109-86EA-4B53B53FB279';
const LOCATION_NAME='臺北';
const LOCATION_NAME_FORECAST='臺北市';

const Container = styled.div`
  background-color: ${({ theme }) => theme.backgroundColor};
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const WeatherCard = styled.div`
  position: relative;
  min-width: 360px;
  box-shadow: ${({ theme }) => theme.boxShadow};
  background-color: ${({ theme }) => theme.foregroundColor};
  box-sizing: border-box;
  padding: 30px 15px;
`;

const Location = styled.div`
  font-size: 28px;
  color: ${({ theme }) => theme.titleColor};
  margin-bottom: 20px;
`;

const Description = styled.div`
  font-size: 16px;
  color: ${({ theme }) => theme.textColor};
  margin-bottom: 30px;
`;

const CurrentWeather = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
`;

const Temperature = styled.div`
  color: ${({ theme }) => theme.temperatureColor};
  font-size: 96px;
  font-weight: 300;
  display: flex;
`;

const Celsius = styled.div`
  font-weight: normal;
  font-size: 42px;
`;

const AirFlow = styled.div`
  display: flex;
  align-items: center;
  font-size: 16x;
  font-weight: 300;
  color: ${({ theme }) => theme.textColor};
  margin-bottom: 20px;

  svg {
    width: 25px;
    height: auto;
    margin-right: 30px;
  }
`;

const Rain = styled.div`
  display: flex;
  align-items: center;
  font-size: 16x;
  font-weight: 300;
  color: ${({ theme }) => theme.textColor};

  svg {
    width: 25px;
    height: auto;
    margin-right: 30px;
  }
`;

const DayCloudy = styled(DayCloudyIcon)`
  flex-basis: 30%;
`;

const Refresh = styled.div`
  position: absolute;
  right: 15px;
  bottom: 15px;
  font-size: 12px;
  display: inline-flex;
  align-items: flex-end;
  color: ${({ theme }) => theme.textColor};

  svg {
    margin-left: 10px;
    width: 15px;
    height: 15px;
    cursor: pointer;
    animation: rotate infinite 1.5s linear;
    animation-duration: ${ (props) => { return props.isLoading} }
  }
  @keyframes rotate {
    from {
      transform: rotate(360deg);
    }
    to {
      transform: rotate(0deg);
    }
  }
`;

const theme = {
  light: {
    backgroundColor: '#ededed',
    foregroundColor: '#f9f9f9',
    boxShadow: '0 1px 3px 0 #999999',
    titleColor: '#212121',
    temperatureColor: '#757575',
    textColor: '#828282',
  },
  dark: {
    backgroundColor: '#1F2022',
    foregroundColor: '#121416',
    boxShadow:
      '0 1px 4px 0 rgba(12, 12, 13, 0.2), 0 0 0 1px rgba(0, 0, 0, 0.15)',
    titleColor: '#f9f9fa',
    temperatureColor: '#dddddd',
    textColor: '#cccccc',
  },
};


const App = () => {

  console.log('invoke function component')
  
  const [currentTheme, setCurrentTheme] = useState('light');

  const [weatherElement, setWeatherElement] = useState({
    locationName: '台北市',
    description: '多雲時晴',
    windSpeed: 1.1,
    temperature: 22.7,
    rainPossibility: 48.3,
    observationTime: '2020-12-12 22:20:00',
    comfortability: '舒適至悶熱',
    weatherCode: 0,
    isLoading: true
  })

  useEffect(() => {
    console.clear();
    console.log('execute function in useEffect')
    fetchCurrentWeather();
    fetchWeatherForecast();
  }, [])

  // 局屬觀測站-天氣觀測: 帶「觀測站名稱」：臺北(fetchCurrentWeather)
  // 天氣預報：帶「縣市」：臺北市(fetchWeatherForecast)
  const fetchCurrentWeather = () => {
    
    setWeatherElement((prevState) => ({
      ...prevState, 
      isLoading: true
    }))

    fetch(
      `https://opendata.cwb.gov.tw/api/v1/rest/datastore/O-A0003-001?Authorization=${AUTHORIZATION_KEY}&locationName=${LOCATION_NAME}`
    )
      .then((response) => response.json())
      .then(data => {
        // console.log('data', data);
        const locationData = data.records.location[0];
        const weatherElements = locationData.weatherElement.reduce(
          (needElements, item) => {
            if(['WDSD', 'TEMP'].includes(item.elementName)) {
              needElements[item.elementName] = item.elementValue;
            }
            return needElements
          }, {}
        )
        console.log('weatherElements', weatherElements);
        setWeatherElement((prev) => ({
          ...prev,
          observationTime: locationData.time.obsTime,
          locationName: locationData.locationName,
          temperature: weatherElements.TEMP,
          windSpeed: weatherElements.WDSD,
          description: '多雲時晴',
          rainPossibility: 60,
          isLoading: false
        }))
      })
  }

  const fetchWeatherForecast = () => {
    fetch(
      `https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=${AUTHORIZATION_KEY}&locationName=${LOCATION_NAME_FORECAST}`
    )
    .then((res) => res.json())
    .then(data => {
      console.log(data);
      const locationData = data.records.location[0];

      const weatherElements = locationData.weatherElement.reduce(
        (needElements, item) => {
          if(['Wx','PoP','CI'].includes(item.elementName)) {
            needElements[item.elementName] = item.time[0].parameter;
          }
          return needElements
        },
        {}
      )
      console.log(weatherElements);
      setWeatherElement((prev) => ({
        ...prev, 
        description: weatherElements.Wx.parameterName, 
        weatherCode: weatherElements.Wx.parameterValue,
        rainPossibility: weatherElements.PoP.parameterName,
        comfortability: weatherElements.CI.parameterName
      }))
    })

  }

  const {
    observationTime,
    locationName,
    description,
    windSpeed,
    temperature,
    rainPossibility,
    isLoading
  } = weatherElement;
  
  return (
    <ThemeProvider theme={theme[currentTheme]}>
      <Container>
        {console.log('render, isLoading: ', isLoading)}
        <WeatherCard>
          <Location>{locationName}</Location>
          <Description>{description}</Description>
          <CurrentWeather>
            <Temperature>
              {Math.round(temperature)} <Celsius>C</Celsius>
            </Temperature>
            <DayCloudy />
          </CurrentWeather>
          <AirFlow>
            <AirFlowIcon /> {windSpeed} m/h
          </AirFlow>
          <Rain> <RainIcon />{rainPossibility}% </Rain>
          <Refresh 
            onClick={fetchCurrentWeather}
            isLoading={isLoading}
          > 最後觀測時間：
            {new Intl.DateTimeFormat('zh-TW', {
              hour: 'numeric',
              minute: 'numeric',
            }).format(new Date(observationTime))} {' '}
            {isLoading ? <LoadingIcon/> : <RefreshIcon />}
          </Refresh>
        </WeatherCard>
      </Container>
    </ThemeProvider>
  )
};


export default App;
