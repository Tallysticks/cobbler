'use strict'

const debug = require('debug')('cobbler')

const secrets = require('./secrets')
const metadata = require('./metadata')

/**
 * Retrieve referenced value.
 * @param reference - Supported cobbler reference.
 * @returns {Promise<String>}
 */
module.exports.retrieve = async function retrieve(reference) {

  debug(`Resolving cobbler reference: ${reference}`)

  const parts = reference.split(':')

  if (parts[0] === 'ec2' && parts[1] === 'loopback') {
    return metadata.retrieve(parts[2])
  }

  if (parts[0] === 'arn' && parts[1] === 'aws' && parts[2] === 'secretsmanager') {
    return secrets.retrieve(reference)
  }

  throw new Error(`Invalid cobbler reference: ${reference}`)
}
