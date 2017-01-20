const createVisualization = (file) => {
  return new Promise((resolve,reject) => {
    let ctx = new OfflineAudioContext(2,44100*40,44100)

    let reader = new FileReader()

    reader.onload = (event) => {

      let buffer = reader.result

      ctx.decodeAudioData(buffer).then( (decodedData)=> {

        let channelData = decodedData.getChannelData(0)

        let visualization = []
        let interval = Math.floor(channelData.length / 500)
        for (let i = 0; visualization.length < 500; i += interval) {
          visualization.push(channelData[i])
        }

        resolve(visualization)

      })
    }

    reader.readAsArrayBuffer(file)

  })
}

export default createVisualization
