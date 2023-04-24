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
      if(city === undefined){
        city = "杭州"
      }
      let weather = await weatherQuery(city)
      if(weather == "城市名错误"){
        console.log("城市名错误!!!!");
        return "城市名错误"
      }else{
        weather = weather.forecasts[0]
      }
      // console.log(weather);
      let message = `<>   
                    <p>时间： ${weather.reporttime} </p> 
                    <p>地区： ${weather.city}</p> 
                    <p>今日天气： </p>
                    <p>          白天-${weather.casts[0].dayweather}  晚上-${weather.casts[0].nightweather}</p>
                    <p>          温度 ${weather.casts[0].nighttemp}-${weather.casts[0].daytemp} ℃</p>
                    <p>          风力 ${weather.casts[0].daywind} 级</p>
                    <p>明日天气：</p>
                    <p>          白天-${weather.casts[1].dayweather}  晚上-${weather.casts[1].nightweather}</p>
                    <p>          温度 ${weather.casts[1].nighttemp}-${weather.casts[1].daytemp} ℃</p>
                    <p>          风力 ${weather.casts[1].daywind} 级</p> 
                    </>`
      return message
    })
}

export async function weatherQuery(city:string) {
  console.log(city);
  let params = {
    key: process.env.WEATHER_QUERY_KEY,
    city: "330100",
    extensions: 'all',
    output: 'json',
  }
  let idx = 0
  let cityCodeList = JSON.parse(fs.readFileSync('./public/citycode.json', 'utf-8'))
  for(let i of cityCodeList) {
    if( i.name.search(city) != -1 ) {
      params.city = i.adcode
      idx = 1
      break;
    }
  }
  if(idx == 0) {
    return "城市名错误"
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