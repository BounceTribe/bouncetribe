import map from 'lodash/map'

export const mapNodes = (items, deepString) =>
  map(((items || {}).edges || []), 'node' + (deepString || ''))

  // export const mapNodes = (items={}, deepString='') => {
  //   let res = map((items.edges || []), 'node' + deepString)
  //   console.log({res});
  //   return Array.isArray(res) ? res : []
  // }
  
