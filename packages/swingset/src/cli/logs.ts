const redTxt = '\x1b[31m'
const endTxt = '\x1b[0m'
const greenTxt = '\x1b[32m'
const grayBg = '\x1b[100m'
const yellowTxt = '\x1b[33m'

/* 
Helpers to semantically color console outout, 
if the cli grows for some reason we can look into a https://github.com/chalk/chalk#readme or a similar pkg
*/
const error = (txt: string) => `${redTxt}ERROR:${endTxt} ${txt}`
const success = (txt: string) => `${greenTxt}SUCCESS:${endTxt} ${txt}`
const codeText = (txt: string) => `${grayBg}${yellowTxt}${txt}${endTxt}`

export const LOGS = {
  bootstrap: {
    hasSwingset: () => {
      console.log(
        `${error(
          'Unable to generate Swingset template.'
        )} Route group ${codeText('app/(swingset)')} already exists.`
      )
    },
    complete: () => {
      console.log(
        `${success('Checkout')} ${codeText('app/(swingset)')} to get started.`
      )
    },
    completeNoConfig: () => {
      console.log(
        `${success('Add the swingset plug-in to your')} ${codeText(
          'next.config'
        )} to get started. Open README for example.`
      )
    },
  },
  default: () => {
    console.log(`Try running ${codeText('swingset bootstrap')} to get started.`)
  },
}
