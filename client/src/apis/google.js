export const key = 'AIzaSyDO5PtdIHlhx5NMp4MONzj2E8BE_SlaQc8'

export const placenameOptions = (latitude, longitude) =>{
  return [
    `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&result_type=neighborhood&key=${key}`,
    {
      method: 'GET',
      headers: {
        Accept: 'application/json'
      }
    }
  ]
}
