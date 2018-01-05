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
  return {genres, skills, influences}
}

export const mapMentorInfo = (mentor) => {
  let specialties = ((mentor.specialties || {}).edges || []).map(edge=>{
    let {node: specialty} = edge
    return { value: specialty.id, label: specialty.name }
  })
  return {specialties}
}
