#!/usr/bin/env node

'use strict'

const cobbler = require('../src')

cobbler.run().catch(console.error)
