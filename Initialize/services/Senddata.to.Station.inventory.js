const request = require('request');
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
process.env.NODE_TLS_ACCEPT_UNTRUSTED_CERTIFICATES_THIS_IS_INSECURE = '1'

module.exports.updateStationInventiry = (Stationdata) => {
   return new Promise((resolve, reject) => {

        const opts = {
            headers: {'Content-Type': 'application/json'},
            url: (process.env.SERVER_URL_DOCK2 || 'http://localhost:3001') + '/gaia_stations/tank_inventory',
            method: 'PATCH',
            json: Stationdata
        }
        
        request(opts, function(error, response, body) {
            if (error){ reject(error) }
            else if (response.statusCode == 200) resolve(response)
            else reject(response)
        })
   })
}