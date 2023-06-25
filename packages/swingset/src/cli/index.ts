#!/usr/bin/env node
import yargs from 'yargs'
import { bootstrap } from './bootstrap'
import { LOGS } from './logs'

const { argv } = yargs(process.argv.slice(2))
  .command(
    '$0',
    'the default command',
    () => {},
    (_) => {
      LOGS.default()
    }
  )
  .command(
    bootstrap.name,
    bootstrap.description,
    bootstrap.builder,
    bootstrap.handler
  )
