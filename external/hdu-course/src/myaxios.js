const request = require('request')
const requests = request.defaults({ jar: true })

class Axios {
    constructor() {
        this.request = requests
        this.cookieJar = requests.jar()
    }
    async get(params) {
        let paramsArray = []
        if(params.data != undefined) {
            Object.keys(params.data).forEach(key => paramsArray.push(key +'='+ params.data[key]))
            params.uri += '?' + paramsArray.join('&')
        }
        return new Promise((resolve, reject) => {
            this.request.get({ ...params, jar: this.cookieJar, followRedirect: false }, (err, res, body) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(res)
                }
            })
        })
    }
    async post(params) {
        return new Promise((resolve, reject) => {
            this.request.post({ ...params, jar: this.cookieJar, followRedirect: false }, (err, res, body) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(res)
                }
            })
        })
    }
}

exports.Axios = Axios