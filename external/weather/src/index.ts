import { Context, Schema } from 'koishi'

export const name = 'weather'

export interface Config {}

export const Config: Schema<Config> = Schema.object({})

export function apply(ctx: Context) {
  ctx.$commander.register('weather', '天气查询', {
    authority: 1,
    options: {
      '-c, --city': '城市',
    },
  })
    .action(async ({ options }, message) => {
      const city = options.city || '北京'
      const weather = await getWeather(city)
      return weather
    }
    )


}
