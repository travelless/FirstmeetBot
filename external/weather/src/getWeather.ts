import axios from 'axios'
import * as fs from 'fs'


export async function getWeather(city) {
  let params = {
    key: process.env.WEATHER_QUERY_KEY,
    city: "330100",
    extensions: 'base',
    output: 'json',
  }
  let cityCodeList = JSON.parse(fs.readFileSync('./public/citycode.json', 'utf-8'))
  for(let i of cityCodeList) {
    if(i.name == city) {
      params.city = i.adcode
    }
  }
  try {
    let response: any = await axios({
      url: 'https://restapi.amap.com/v3/weather/weatherInfo',
      method: "GET",
      params: params,
    })
    response = await response.data
    return response
  } catch (e) {
    console.log('error', e)
    return e
  }
}