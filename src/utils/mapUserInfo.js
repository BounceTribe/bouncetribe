export const mapUserInfo = (user) => {
  let genres = ((user.genres || {}).edges || []).map(edge=>{
    let {node: genre} = edge
    return { value: genre.id, label: genre.name }
  })
  let skills = ((user.skills || {}).edges || []).map(edge=>{
    let {node: skill} = edge
    return { value: skill.id, label: skill.name }
  })
  let influences = ((user.artistInfluences || {}).edges || []).map(edge=>{
    let {node: influence} = edge
    let {imageUrl, spotifyId, id} = influence
    return {
      value: { imageUrl, spotifyId, id },
      label: influence.name
    }
  })
  let mediaLinks = ((user.mediaLinks || {}).edges || []).map(edge=>{
    let {node: mediaLink} = edge
    return { mediaLink }
  })
  return {genres, skills, influences, mediaLinks}
}
