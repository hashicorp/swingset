#!/usr/bin/env node
import yargs from 'yargs'

const { argv } = yargs(process.argv.slice(2))
  .command(
    '$0',
    'the default command',
    () => {},
    (argv) => {
      console.log('this command will be run by default')
    }
  )
  .command(
    'bootstrap',
    'lorem ipsum',
    () => {},
    (argv) => {
      console.log('heyo')
    }
  )

console.log(argv)
