import {
  connectionArgs,
  connectionDefinitions,
  connectionFromArray,
  fromGlobalId,
  globalIdField,
  mutationWithClientMutationId,
  nodeDefinitions
} from 'graphql-relay'

export const {nodeInterface, nodeField} = nodeDefinitions(
  async (globalId) => {
    const { type, id } = fromGlobalId(globalId)
    if (type === 'Person') {
      const person = await Person.findById(id)
      return person
    }
    if (type === 'Viewer') {
      const viewer = await Person.findById(id)
      return viewer
    }
    return null
  },
  (obj) => {
    if (obj instanceof Person) {
      return PersonType
    } else if (obj instanceof Viewer) {
      return ViewerType
    } else {
      return null
    }
  }
)
