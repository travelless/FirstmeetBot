import { Context, Schema } from 'koishi'
export const name = 'test'

export interface Config {}

export const Config: Schema<Config> = Schema.object({})

export function apply(ctx: Context) {
  // ctx.middleware(async (meta, next) => {
  //   // console.log(meta);
  //   if(meta.userId === "2022742378") {
  //     // let result = await ctx.pgdata.addUser(meta.author.userId, meta.author.username)
  //     // let friendList = await ctx.bots[0].getFriendList()
  //     // console.log(friendList);
  //     let result = await ctx.pgdata.updateDataBase()
  //     console.log(result);
  //     return next()
  //   }
  // })
}
