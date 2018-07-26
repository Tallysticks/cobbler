'use strict'

const _ = require('lodash')

const retrievers = require('./retrievers')
const application = require('./application')

const COBBLER_PROTOCOL = 'cobbler'

module.exports.run = async function run(options) {

  options = _.defaults(options, { strict: true })

  const variables = _.map(process.env, (value, name) => {

    const variable = { name }

    const segments = value.split('://')

    if (segments.length === 2) {
      const protocol = segments[0]
      const reference = segments[1]
      if (protocol === COBBLER_PROTOCOL) {
        variable.reference = reference
      }
      else {
        variable.value = value
      }
    }
    else {
      variable.value = value
    }

    return variable
  })

  // Retrieve referenced values
  const errors = []
  for (const variable of variables) {
    if (variable.reference) {
      variable.value = await retrievers.retrieve(variable.reference).catch(err => {
        const error = new Error(`Cannot retrieve referenced value for variable: ${variable.name}`)
        error.causedBy = err
        errors.push(error)
      })
    }
  }

  // Do not start application if errors encountered in strict mode
  if (errors.length && options.strict) {
    throw errors
  }

  const env = _.fromPairs(_.map(variables, variable => [ variable.name, variable.value ]))

  application.start(env)

  if (errors.length) {
    return errors
  }
}
