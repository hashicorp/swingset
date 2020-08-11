const withTM = require('next-transpile-modules')
const withOctavo = require('octavo')

module.exports = withTM(['octavo'])(withOctavo()())
