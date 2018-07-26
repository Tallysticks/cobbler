'use strict'

const _ = require('lodash')
const AWS = require('aws-sdk')
const debug = require('debug')('cobbler')

const cache = {}

const client = new AWS.MetadataService({
  httpOptions: {
    timeout: 5000,
  },
})

async function fetch(path) {

  if (cache[path]) {
    debug(`Retrieving metadata from cache: ${path}`)
    return cache[path]
  }

  debug(`Fetching metadata: ${path}`)
  return new Promise((resolve, reject) => {
    return client.request(path, (err, data) => {
      if (err) {
        return reject(err)
      }
      else {
        return resolve(data)
      }
    })
  })
}

module.exports.retrieve = async function retrieve(reference) {

  debug(`Retrieving metadata at: ${reference}`)

  const parts = reference.split('|')

  const variable = {
    path: parts[0],
  }

  if (parts.length === 2) {
    variable.name = parts[1]
  }

  return fetch(variable.path).then(data => {

    if (variable.name) {
      debug(`Extracting JSON property: ${variable.name}`)
      const json = JSON.parse(data)
      if (_.has(json, variable.name)) {
        return json[variable.name]
      }
      throw new Error(`Metadata JSON does not have property: ${variable.name}`)
    }

    return data

  }).catch(err => {
    if (err.code === 'ResourceNotFoundException') {
      throw new Error(`The requested secret was not found: ${variable.path}`)
    }
    else {
      throw err
    }
  })
}
