import db from '../index'

import Person from './Person'
import DemoKey from './DemoKey'
import DemoValue from './DemoValue'
import PersonDemo from './PersonDemo'


function sync(...args) {
  return db.sync(...args)
}

export default { sync }

export {Person, DemoKey, DemoValue, PersonDemo}
