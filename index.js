var ffmpeg = require('fluent-ffmpeg');
var config = require('./config')

let encode = ffmpeg()
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
    .on('progress', function (progress) {
        console.log('Processing: ');
    })
    .on('error', (err) => {
        console.log(err)
    })
    .on('end', () => {
        console.log("done")
    });

const stop = (movie) => {
    return movie.ffmpegProc.stdin.write('q');
}

setTimeout(function () {
    encode.on('error', function () {
        console.log('Ffmpeg has been killed');
    });

    stop(encode);
}, 60000);