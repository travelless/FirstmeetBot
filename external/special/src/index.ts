import { Context, Schema, Service } from 'koishi'
import cron from 'koishi-plugin-cron'
import {} from '@koishijs/plugin-adapter-onebot'
import { weatherQuery } from 'koishi-plugin-weather'
export const name = 'special'

export interface Config {}

export const Config: Schema<Config> = Schema.object({})

export function apply(ctx: Context) {
  let test = '*/2 * * * * *'
  let morning = '0 30 7 * * *'
  ctx.cron(morning, async () => {
    let special_id = process.env.SPECIAL_ID
    let weather = (await weatherQuery("杭州")).forecasts[0]
    let time = getTime(weather.casts[0].week)
    let SayLove = ['早安，慧子','希望晨间的阳光能够让你的笑容更加绚丽。']
    let message = `<>   
                  <p>      亲爱的陈慧同学 早安  </p>
                  <p>时间： ${time} </p> 
                  <p>地区： ${weather.city}</p> 
                  <p>今日天气： </p>
                  <p>          白天-${weather.casts[0].dayweather}  晚上-${weather.casts[0].nightweather}</p>
                  <p>          温度 ${weather.casts[0].nighttemp}-${weather.casts[0].daytemp} ℃</p>
                  <p>          风向 ${weather.casts[0].daywind}  </p>
                  <p>          风力 ${weather.casts[0].daywind} 级</p>
                  <p>明日天气：</p>
                  <p>          白天-${weather.casts[1].dayweather}  晚上-${weather.casts[1].nightweather}</p>
                  <p>          温度 ${weather.casts[1].nighttemp}-${weather.casts[1].daytemp} ℃</p>
                  <p>          风向 ${weather.casts[1].daywind}  </p>
                  <p>          风力 ${weather.casts[1].daywind} 级</p> 
                  <p>      ${ SayLove[0] }   </p> 
                  <p>      ${ SayLove[1] }   </p> 
                  </>`
    ctx.bots[0].sendPrivateMessage(special_id, message)
  })

}


function getTime(week){
  let weekday
  switch (week) {
    case '1':
      weekday = '星期一'
      break;
    case '2':
      weekday = '星期二'
      break;
    case '3':
      weekday = '星期三'
      break;
    case '4':
      weekday = '星期四'
      break;
    case '5':
      weekday = '星期五'
      break;
    case '6':
      weekday = '星期六'
      break;
    case '7':
      weekday = '星期日'
      break;
    default:
      break;
  }
  let date = new Date()
  let year = date.getFullYear()
  let month = date.getMonth() + 1
  let day = date.getDate()

  return `${year}-${month}-${day} ${weekday} `
}
