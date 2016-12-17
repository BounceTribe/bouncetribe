import {Person, TraitKey, TraitValue, PersonTrait} from './models'


async function sync() {
  try {
    console.log('sync starting')
    await Person.sync()
    await TraitKey.sync()
    await TraitValue.sync()
    await PersonTrait.sync()
    console.log('sync finished')
  } catch(error) {
    console.log('db sync error', error)
  }
}

export default sync
