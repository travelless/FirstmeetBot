import { Context, Schema, Service } from 'koishi'
import * as fs from 'fs'
import axios from 'axios'

export const name = 'weather'

export interface Config {}

export const Config: Schema<Config> = Schema.object({})

export function apply(ctx: Context) {
  ctx.command('weather <city>', 'Get weather information of a city')
    .action(async ({ session }, city) => {
      // console.log(session.);
      if(!city){
        city = '杭州'
      }
      let weather = await weatherQuery(city)
      return `<>
      今天${city}的天气是${weather.lives[0].weather}，
      温度是${weather.lives[0].temperature}摄氏度，
      风力${weather.lives[0].windpower}级，
    </>`
    })
}

export async function weatherQuery(city:string) {
  let params = {
    key: process.env.WEATHER_QUERY_KEY,
    city: "330100",
    extensions: 'all',
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