var ffmpeg = require('fluent-ffmpeg');
var config = require('./config')

ffmpeg()
    .input(config.url)
    .inputOption([
        "-vsync 0",
        "-hwaccel cuvid",
        "-hwaccel_device 0",
        "-c:v h264_cuvid"
    ])
    .videoCodec("h264_nvenc")
    .videoFilter("fps=5")
    //.native()
    //.audioCodec('aac')
    //.audioBitrate(128)
    //.audioChannels(2)
    .videoBitrate(150)
    .save("./output/out.mp4")
    .on('codecData', function (data) {
        console.log('Input is ' + data.audio + ' audio ' +
            'with ' + data.video + ' video');
    })
    .on('error', (err) => {
        console.log(err)
    })
    .on('end', () => {
        console.log("done")
    });