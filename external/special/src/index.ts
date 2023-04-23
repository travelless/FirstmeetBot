import { Context, Schema } from 'koishi'
import cron from 'koishi-plugin-cron'
import { } from '@koishijs/plugin-adapter-onebot'

export const name = 'special'

export interface Config {}

export const Config: Schema<Config> = Schema.object({})

export function apply(ctx: Context) {
  // let groupList = await database.getGroupList()
  
  
  ctx.cron('0 1 1 * * *', async () => {
    console.log(ctx.bots[0]);
    // console.log(await ctx.bots[0].getFriendList());
  })

}
