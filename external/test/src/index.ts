import { Context, Schema } from 'koishi'
import {} from 'koishi-plugin-pg-database'
import { weatherQuery } from 'koishi-plugin-weather'
import { course ,getHduToken } from 'koishi-plugin-hdu-course'

export const name = 'test'

export interface Config {}

export const Config: Schema<Config> = Schema.object({})


export function apply(ctx: Context) {
  // ctx.middleware(async (meta, next) => {
  //   if(meta.userId === "2022742378") {
  //     let special_id = parseInt(process.env.SPECIAL_ID)
  //     let specialData = await ctx.pgdb.getStu(special_id)
  //     // let token = await getHduToken(specialData.stu_num.toString(),specialData.stu_pin)
  //     // let res = await ctx.pgdb.updateStu(parseInt(specialData.user_id.toString()) ,undefined,undefined,undefined,token)
  //     let courseMessage = await course(specialData)
  //     await ctx.bots[0].sendPrivateMessage('2022742378', courseMessage)
  //     return next()
  //   }
  // })
}


