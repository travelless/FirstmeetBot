import { Context, Schema, Service, User } from 'koishi'
import { PrismaClient } from '@prisma/client';
import {} from '@koishijs/plugin-adapter-onebot'

export const name = 'pg-database'
// let prisma = new PrismaClient()
declare module 'koishi' {
  interface Context {
    pgdata: PostgresDatabase
  }
}

export interface Config {}

export const Config: Schema<Config> = Schema.object({})

export function apply(ctx: Context) {
  // write your plugin here
  ctx.pgdata = new PostgresDatabase(new PrismaClient(), ctx);
  // console.log(ctx.pgdata);
}


export class PostgresDatabase extends Service {
  postgres:PrismaClient
  constructor(private client: PrismaClient, ctx: Context) {
      super(ctx, 'pgdata')
      this.postgres = client
  }
  // 更新整体数据库数据
  async updateDataBase() {
    // console.log(await this.ctx.bots[0].getFriendList());
    let friendList = await this.ctx.bots[0].getFriendList()
    let befriend_time = new Date()
    let userList = []
    // console.log(friendList);
    for(let i = 0;i<friendList.length;i++) {
      userList.push({
        user_id: parseInt(friendList[i].userId),
        user_name: friendList[i].username.toString(),
        befriend_time: befriend_time,
      })
    }
    console.log(userList);
    try{
      let result = await this.postgres.user_info.createMany({ data: userList } , skipDuplicates: true)
    }
    catch(e) {
      console.log(e);
      return e;
    }
    
    console.log("success!");
    return result
  }
  // 向user_info表中新增一条数据
  async addUser(user_id: number, user_name: string) {
    let befriend_time = new Date()
    try{
      user_id = parseInt(user_id)
      user_name = user_name.toString()
    }
    catch(e) {
      console.log(e);
      return e;
    }
    let result = await this.postgres.user_info.create({
      data: {
        user_id: user_id,
        user_name: user_name,
        befriend_time: befriend_time,
      }
    })
    return result
  }


}