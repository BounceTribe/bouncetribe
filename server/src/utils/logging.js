import chalk from 'chalk'

export const b = (label, source, args, context) => {
  console.log('\n',
    chalk.bgWhite.blue.bold('          ',label, '          '),
    '\n',
    chalk.green('  source '),
    '\n',
    source,
    '\n',
    chalk.cyan('   args'),
    '\n',
    args,
    '\n',
    chalk.magenta('   context '),
    '\n',
    context,
    '\n',
  )
}
