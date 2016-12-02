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

import PersonTraitType from '../types/PersonTraitType'


export const {
  connectionType: personTraitConnection,
  edgeType: PersonTraitEdge,
} = connectionDefinitions({name: 'PersonTrait', nodeType: PersonTraitType})
