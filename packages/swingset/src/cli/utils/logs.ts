import { FILES } from './constants'
const redTxt = '\x1b[31m'
const endTxt = '\x1b[0m'
const greenTxt = '\x1b[32m'
const grayBg = '\x1b[100m'
const yellowTxt = '\x1b[33m'
const blueTxt = '\x1b[34m'

/* 
Helpers to semantically color console outout, 
if the cli grows for some reason we can look into a https://github.com/chalk/chalk#readme or a similar pkg
*/
export const error = (txt: string) => `${redTxt}ERROR:${endTxt} ${txt}`
export const success = (txt: string) => `${greenTxt}SUCCESS:${endTxt} ${txt}`
export const codeText = (txt: string) => `${grayBg}${yellowTxt}${txt}${endTxt}`
export const linkText = (txt: string) => `${blueTxt}${txt}${endTxt}`

export const Logs = {
  bootstrap: {
    start: () => {
      console.log('Getting you started with swingset...')
    },
    hasSwingset: () => {
      console.error(
        `${error(
          'Unable to generate swingset template.'
        )} Route group ${codeText(FILES.routeGroupDir)} already exists.`
      )
    },
    unableToInstall: () => {
      console.error(
        error('Unable to install swingset package, received following error:')
      )
    },
    complete: () => {
      console.log(
        `${success('Checkout')} ${codeText(
          FILES.routeGroupDir
        )} to get started.`
      )
    },
    completeNoConfig: () => {
      console.log(
        `${success('Add the swingset plug-in to your')} ${codeText(
          'next.config.js'
        )} to get started. 
Checkout ${linkText(
          'https://github.com/hashicorp/swingset#installation'
        )} for examples,`
      )
    },
  },
  default: () => {
    console.log(`Try running ${codeText('swingset bootstrap')} to get started.`)
  },
}
