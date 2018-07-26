'use strict'

const { spawn } = require('child_process')

/**
 * Spawn application as a child process supplying the retrieved environment variables.
 * @param env - Environment variables.
 */
module.exports.start = function start(env) {

  const child = spawn('npm', [ 'start' ], { cwd: process.env.PWD, env })

  child.stdout.pipe(process.stdout)
  child.stderr.pipe(process.stderr)

  child.on('close', () => {})
  child.on('disconnect', () => {})
  child.on('error', () => {})
  child.on('exit', () => {})
}
