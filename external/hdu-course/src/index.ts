import { App, Context, Schema } from 'koishi'
import { getHDUcourse, getModule, getHDUToken } from './function'
import {} from 'koishi-plugin-pg-database'
import { createContext } from 'vm'

export const name = 'hdu-course'

export interface Config {}

export const Config: Schema<Config> = Schema.object({})

export async function apply(ctx: Context) {
  // let token = await getToken(un,pd)
  // set指令 设置学业信息
  ctx.command('set <schoolName:string> <stuNum:number> <stuPin:string> [userId]', '设置学业信息')
    .action(async ({ session }, schoolName, stuNum, stuPin, userId) => {
      let user_id
      if(userId !== undefined && session.userId === process.env.MASTER_ID ){
        user_id = userId
      } else{
        user_id = session.userId
      }
      let token = await getHDUToken(stuNum.toString(),stuPin)
      let res = await ctx.pgdb.addStu(parseInt(user_id) , schoolName, stuNum, stuPin, token)
      console.log(res);
      return '设置成功'
    })
  // course指令 获取课表信息
  ctx.command('course', '获取学业信息')
    .action(async({ session }) => {
      let user_id = parseInt(session.userId)
      let stuData = await ctx.pgdb.getStu(user_id)
      return await course(stuData,ctx)
    })
}

export async function course(stuData,ctx){
  let token
  try{
    token = await getHDUToken(stuData.stu_num.toString(),stuData.stu_pin)
    let res = await ctx.pgdb.updateStu(parseInt(stuData.user_id.toString()) ,undefined,undefined,undefined,token)
  }
  catch(e){
    console.log(e);
    token = stuData.token
  }
  console.log(13123132);
  let course = await getHDUcourse(token)
  let dater = new Date().getTime()
  let date = new Date(dater - 4 * 60 * 60 * 1000)
  let weekday = (date.getDay()).toString()
  switch(weekday) {
    case '1': weekday = '一'; break;
    case '2': weekday = '二'; break;
    case '3': weekday = '三'; break;
    case '4': weekday = '四'; break;
    case '5': weekday = '五'; break;
    case '6': weekday = '六'; break;
    case '0': weekday = '日'; break;
  }
  let message = `<>
  <p>今日课表   星期${weekday}</p>
  `
  if(course.length === 0){
    message += `<p>--- 今日无课,勾栏听曲！---</p>`
  }
  for(let i = course.length;i>0;i--) {
    message += getModule(course[i-1])
  }
  message += `</>`
  return message
}

export async function getHduToken(un,pd){
  let res = await getHDUToken(un,pd)
  return res
}