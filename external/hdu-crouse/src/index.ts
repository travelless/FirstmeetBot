import { Context, Schema } from 'koishi'
import { strEnc } from './encrypt'
import { Axios } from '../../hdu-crouse/src/myaxios'

export const name = 'hdu-crouse'

export interface Config {}

export const Config: Schema<Config> = Schema.object({})

const headers = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:99.0) Gecko/20100101 Firefox/99.0',
  'Content-Type': 'application/x-www-form-urlencoded'
}
const axios = new Axios()

export async function apply(ctx: Context) {
  // let un = '21011114'
  // let pd = 'Firstmeet1037'
  // // let token = await getToken(un,pd)
  // // set指令 设置学业信息
  // ctx.command('set <schoolName:string> <stuNum:number> <stuPin:string>', '设置学业信息')
  //   .action(async ({ session }, schoolName, stuNum, stuPin) => {
  //     console.log(schoolName, stuNum, stuPin);
  //     let user_id = parseInt(session.userId)
  //     let stu_num = parseInt(stuNum)
  //     let res = await ctx.pgdb.addStu(user_id, schoolName, stu_num, stuPin)
  //     console.log(res);
  //     return '设置成功'
  //   })
  // // crouse指令 获取课表信息
  // ctx.command('crouse', '获取学业信息')
  //   .action(async({ session }) => {
  //     let user_id = parseInt(session.userId)
  //     let stuData = await ctx.pgdb.getStu(user_id)
  //     let token = await getHDUToken(stuData.stu_num.toString(), stuData.stu_pin.toString())
  //     let res = await ctx.pgdb.updateStu(user_id,undefined,undefined,undefined,token)
  //     getHDUCrouse(token)
  //     return "123"
  //   })
}




async function getHDUToken(un,pd) {
  let hduIdentity = {
      'rsa': '',
      'ul': '',
      'pl': '',
      'lt': '',
      'execution': '',
      '_eventId': 'submit'
  }
  let hduUrl = 'https://cas.hdu.edu.cn/cas/login?state=&service=https://skl.hdu.edu.cn/api/cas/login?state=&index='
  let res = await axios.get({ 
    uri: hduUrl,
    headers: headers
  })
  // 获取cookie
  let data = res.body
  let tail = data.split(/name="lt" value="/)[1]
  let exec = data.split(/name="execution" value="/)[1]
  hduIdentity.lt = tail.split('" />')[0]
  hduIdentity.ul = un.length
  hduIdentity.pl = pd.length
  hduIdentity.execution = exec.split('" />')[0]
  hduIdentity.rsa = strEnc(un + pd + hduIdentity.lt, '1', '2', '3')
  
  res = await axios.post({ uri: hduUrl, headers: headers, form: hduIdentity})
  res = await axios.get({ uri: res.headers['location'], headers: headers })
  res = await axios.get({ uri: res.headers['location'], headers: headers })
  res = await axios.get({ uri: res.headers['location'], headers: headers })
  return res.headers['x-auth-token']
}

async function getHDUCrouse(token:string) {
  let crouseApi = 'https://skl.hdu.edu.cn/api/course'
  let crouseHeaders = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:99.0) Gecko/20100101 Firefox/99.0',
    'Content-Type': 'application/x-www-form-urlencoded',
    'x-auth-token': token,
  }
  let data = {
    startTime: '2021-03-01',
  }
  let res = await axios.get({ uri: crouseApi, headers: crouseHeaders, data:data})
  crouseData = res.body
}