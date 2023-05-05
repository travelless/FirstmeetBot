import request from 'request'

const requests = request.defaults({ jar: true })

export class Axios {
    constructor() {
        this.request = requests
        this.cookieJar = requests.jar()
    }
    async get(params) {
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
