const createVisualization = (file) => {
  return new Promise((resolve,reject) => {
    console.log('visualization start')
    let ctx = new OfflineAudioContext(2,44100*40,44100)

    let reader = new FileReader()

    reader.onload = (event) => {

      let buffer = reader.result

      ctx.decodeAudioData(buffer).then( (decodedData)=> {

        let channelData = decodedData.getChannelData(0)

        let visualization = []
        let interval = Math.floor(channelData.length / 500)

        for (let i = 0; visualization.length < 500; i += interval) {

          let sample = channelData.slice(i, i+interval)
          let max = Math.max(...sample)
          let min = Math.min(...sample)
          max += (min * -1)
          visualization.push(max)

        }

        console.log('visualization done')

        resolve(visualization)

      })
    }

    reader.readAsArrayBuffer(file)

  })
}

export default createVisualization
