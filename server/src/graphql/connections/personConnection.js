import {
  connectionArgs,
  connectionDefinitions,
  connectionFromArray,
  fromGlobalId,
  globalIdField,
  mutationWithClientMutationId,
  nodeDefinitions,
  cursorForObjectInConnection,
  connectionFromPromisedArray
} from 'graphql-relay';

import PersonType from '../types/PersonType'


export const {
  connectionType: personConnection,
  edgeType: PersonEdge,
} = connectionDefinitions({name: 'Person', nodeType: PersonType})
