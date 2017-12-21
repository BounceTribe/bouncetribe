import map from 'lodash/map'

export const mapNodes = (items, deepString) =>
  map(((items || {}).edges || []), 'node' + (deepString || ''))


export const mapIds = items =>
  ((items || {}).edges || []).map(edge=>edge.node.id)


  // export const mapNodes = (items, lv1, lv2) =>
  //   ((items || {}).edges || []).map(edge=>edge.node[lv1][lv2])
