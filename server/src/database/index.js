import chalk from 'chalk'
import sync from './sync'
import db from './db'
import populate from './populate'

async function initializeDB() {
  try {
    await sync()

    await db.authenticate()

    console.log(chalk.magenta('Database connection established.'))

    await populate()

    console.log(chalk.magenta('Population Complete.'))

  } catch (error) {
    console.log('db initialize error', error)
  }
}



export default initializeDB
