#!/usr/bin/env node
import yargs from 'yargs'
import fs from 'fs'

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
      const fileContents = fs.readFileSync('./.gitignore', 'utf-8')
      console.log(fileContents)
    }
  )
