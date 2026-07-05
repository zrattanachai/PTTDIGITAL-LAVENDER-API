const request = require('request');
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
process.env.NODE_TLS_ACCEPT_UNTRUSTED_CERTIFICATES_THIS_IS_INSECURE = '1'

module.exports = (account) => {
   return new Promise((resolve, reject) => {

        const opts = {
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            url: (process.env.SERVER_URL_DOCK2 || 'http://localhost:3001') + '/user',
            method: 'POST',
            json: true,
            form: {
                username: account.username,
                email: account.email
            }
        }
        
        request(opts, function(error, response, body) {
            if (error){ reject(error) }
            else if (response.statusCode == 200) resolve(body)
            else reject(body)
        })
   })
}