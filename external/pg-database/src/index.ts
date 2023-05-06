import { App, Context, Schema, Service, User } from 'koishi'
import { PrismaClient } from '@prisma/client';
import {} from '@koishijs/plugin-adapter-onebot'

export const name = 'pg-database'
// let prisma = new PrismaClient()
declare module 'koishi' {
  interface Context {
    pgdb: PostgresDatabase
  }
}


export interface Config {}

export const Config: Schema<Config> = Schema.object({})

export function apply(ctx: Context) {
  ctx.pgdb = new PostgresDatabase(new PrismaClient(), ctx);
  // console.log(ctx.pgdata);
}


export class PostgresDatabase extends Service {
  postgres:PrismaClient
  constructor(private client: PrismaClient, ctx: Context) {
      super(ctx, 'pgdb', true)
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
    let result;
    try{
      result = await this.postgres.user_info.createMany({ data: userList,skipDuplicates:true, })
    }
    catch(e) {
      console.log(e);
      return e;
    }
    
    console.log("success!");
    return result
  }

  // user_info表操作
  // 向user_info表中新增一条数据
  async addUser(user_id: number, user_name: string) {
    let befriend_time = new Date()
    let result = await this.postgres.user_info.create({
      data: {
        user_id: user_id,
        user_name: user_name,
        befriend_time: befriend_time,
      }
    })
    return result
  }
  // 向user_school_info表中新增一条数据 user_id: QQ号  school:学校代号 stu_num:学号  stu_pin:密码
  async addStu(user_id: number, school: string, stu_num: number, stu_pin: string){
    let result = await this.postgres.user_school_info.create({
      data: {
        user_id: user_id,
        school: school,
        stu_num: stu_num,
        stu_pin: stu_pin,
      }
    })
    return result
  }
  // 更新user_school_info表中数据
  async updateStu(user_id: number, school?: string, stu_num?: number, stu_pin?: string,token?:string){
    let result = await this.postgres.user_school_info.update({
      where: {
        user_id: user_id
      },
      data: {
        school: school,
        stu_num: stu_num,
        stu_pin: stu_pin,
        token: token,
      },
    })
    return result
  }

  // 查询user_school_info表中数据
  async getStu(user_id: number){
    let result = await this.postgres.user_school_info.findUnique({
      where: {
        user_id: user_id
      }
    })
    return result
  }
}
