
const getSheetsApi = require('./setup')

/**
 * Wrapper on the sheet.spreadsheet.values function to return a promise
 * @param {{spreadsheetId: string, range: string}} options 
 */
const getSheet = (options) => getSheetsApi().then(sheets => new Promise((resolve, reject) => {
  sheets.spreadsheets.values.get(options, (error, result) => {
    if (error) {
      reject(error)
    } else {
      const rows = result.data.values
      resolve(rows)
    }
  })
}))

module.exports = getSheet