import { Context, Schema } from 'koishi'

export const name = 'test'

export interface Config {}

export const Config: Schema<Config> = Schema.object({})


export function apply(ctx: Context) {
  // ctx.middleware(async (meta, next) => {
  //   if(meta.userId === "2022742378") {
  //     return next()
  //   }
  // })
}


