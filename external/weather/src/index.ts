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
      let weatherForecast = await weatherQuery(city,'all')
      let weatherNow = await weatherQuery(city,'base')
      if(weatherForecast == "城市名错误"){
        console.log("城市名错误!!!!");
        return "城市名错误"
      }else{
        weatherForecast = weatherForecast.forecasts[0]
        weatherNow = weatherNow.lives[0]
      }
      let message = `<>   
                    <p>时间： ${weatherForecast.reporttime} </p> 
                    <p>地区： ${weatherForecast.city}</p> 
                    <p>今日天气： </p>
                    <p>          白天-${weatherForecast.casts[0].dayweather}  晚上-${weatherForecast.casts[0].nightweather}</p>
                    <p>          温度 ${weatherForecast.casts[0].nighttemp}-${weatherForecast.casts[0].daytemp} ℃</p>
                    <p>          风向 ${weatherForecast.casts[0].daywind}  </p>
                    <p>          风力 ${weatherForecast.casts[0].daypower} 级</p>
                    <p>明日天气：</p>
                    <p>          白天-${weatherForecast.casts[1].dayweather}  晚上-${weatherForecast.casts[1].nightweather}</p>
                    <p>          温度 ${weatherForecast.casts[1].nighttemp}-${weatherForecast.casts[1].daytemp} ℃</p>
                    <p>          风向 ${weatherForecast.casts[1].daywind}  </p>
                    <p>          风力 ${weatherForecast.casts[1].daypower} 级</p> 
                    </>`
      return message
    })
}

export async function weatherQuery(city:string, extensions?: string) {
  console.log(city);
  let params = {
    key: process.env.WEATHER_QUERY_KEY,
    city: "330100",
    extensions: extensions,
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