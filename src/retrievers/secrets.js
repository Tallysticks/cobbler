'use strict'

const _ = require('lodash')
const AWS = require('aws-sdk')
const debug = require('debug')('cobbler')

const cache = {}

const client = new AWS.SecretsManager({
  endpoint: 'https://secretsmanager.eu-west-1.amazonaws.com',
  region: 'eu-west-1',
})

async function fetch(path) {

  if (cache[path]) {
    debug(`Retrieving secret from cache: ${path}`)
    return cache[path]
  }

  debug(`Fetching secret: ${path}`)
  return client.getSecretValue({ SecretId: path }).promise().then(data => {
    cache[path] = data
    return data
  })
}

module.exports.retrieve = async function retrieve(reference) {

  debug(`Retrieving secret at: ${reference}`)

  const parts = reference.split('|')

  const variable = {
    path: parts[0],
  }

  if (parts.length === 2) {
    variable.name = parts[1]
  }

  return fetch(variable.path).then(data => {

    const str = data.SecretString

    if (variable.name) {
      debug(`Extracting JSON property: ${variable.name}`)
      const json = JSON.parse(str)
      if (_.has(json, variable.name)) {
        return json[variable.name]
      }
      throw new Error(`Secret JSON does not have property: ${variable.name}`)
    }

    return str

  }).catch(err => {
    if (err.code === 'ResourceNotFoundException') {
      throw new Error(`The requested secret was not found: ${variable.path}`)
    }
    else {
      throw err
    }
  })
}
