const { Axios } = require('./myaxios.js')
const { strEnc } = require('./encrypt.js')


const headers = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:99.0) Gecko/20100101 Firefox/99.0',
  'Content-Type': 'application/x-www-form-urlencoded'
}

let axios = new Axios()

export async function getHDUcourse(token:string) {
  let courseApi = 'https://skl.hdu.edu.cn/api/course'
  let courseHeaders = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:99.0) Gecko/20100101 Firefox/99.0',
    'Content-Type': 'application/x-www-form-urlencoded',
    'x-auth-token': token,
  }
  let dater = new Date().getTime()
  let date = new Date(dater + 4 * 60 * 60 * 1000)
  let date2 = new Date(dater - 4 * 60 * 60 * 1000)
  let now = date.getTime()
  // 获得年月日
  let year = date.getFullYear()
  let month:any = date.getMonth() + 1
  if(month < 10) {
    month = '0' + month.toString()
  }
  let day:any = date.getDay() - date.getDay() + 1
  if(day < 10) {
    day = '0' + day.toString()
  }
  let params = {
    'startTime': year + '-' + month + '-' + day
  }
  // let time = year + '-' + month + '-' + day
  let res = await axios.get({ uri: courseApi, headers: courseHeaders,data: params})
  let courseData = JSON.parse(res.body)
  let week = courseData.week
  courseData = courseData.list
  let course = []
  for(let item of courseData) {
    if(item.startWeek <= week && item.endWeek >= week) {
      if(item.weekDay ===  date2.getDay()) {
        let courseItem = {
          courseName: '',
          classRoom: '',
          startSection: 0,
          endSection: 0,
          weekDay: 0,
          teacherName: '',
          mark: ''
        }
        courseItem.courseName = item.courseName
        courseItem.classRoom = item.classRoom
        courseItem.startSection = item.startSection
        courseItem.endSection = item.endSection
        courseItem.weekDay = item.weekDay
        courseItem.teacherName = item.teacherName
        courseItem.mark = item.mark 
        course.push(courseItem)
      }
    }
  }
  course.sort((a, b) => b.startSection - a.startSection);
  return course
}

export function getModule(course){
  let time
  if(course.startSection <= 5) {
    time = '上午'
  } else if(course.startSection <= 9) {
    time = '下午'
  } else {
    time = '晚上'
  }
  return `
   ---  ${time} 第${course.startSection}-${course.endSection}节 ---
  <p><face id="198"></face> ${course.courseName}</p>
  <p><face id="199"></face> ${course.classRoom}</p>
  <p><face id="63"></face> 教师 ${course.teacherName}</p>
  <p><face id="89"></face> ${course.mark} 学分</p>
  `
}

export async function getHDUToken(un,pd) {
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