import { Context, Schema } from 'koishi'
import * as fs from 'fs'
import axios from 'axios'
import { getWeather } from './getWeather'

export const name = 'weather'

export interface Config {}

export const Config: Schema<Config> = Schema.object({})

export function apply(ctx: Context) {
  ctx.command('weather <city>', 'Get weather information of a city')
    .action(async ({ session }, city) => {
      if(!city){
        city = '杭州'
      }
      console.log(process.env.WEATHER_QUERY_KEY);
      let weather = await getWeather(city)
      
      return `<>
      你好，同学
      今天${city}的天气是${weather.lives[0].weather}，
      温度是${weather.lives[0].temperature}摄氏度，
      风力是${weather.lives[0].windpower}级，
    </>`
    })
}
