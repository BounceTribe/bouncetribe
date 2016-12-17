import chalk from 'chalk'

export const b = (label, data) => {
  return console.log(
    chalk.bgWhite.blue.bold('\n       ',label),
    chalk.bgWhite.dim.black('\n', data)
  )
}
