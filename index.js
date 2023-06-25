var ffmpeg = require('fluent-ffmpeg');
var config = require('./config')

function videoEncode(url) {
    return new Promise((resolve, reject) => {
        let encode = ffmpeg()
            .input(url)
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
                //console.log(err)
                reject(err)
            })
            .on('end', () => {
                //console.log("done")
                resolve('done');
            });

        setTimeout(function () {
            encode.on('error', function () {
                //console.log('Ffmpeg has been killed');
                resolve('killed')
            });

            stop(encode);
        }, 60000);
    })
}


const stop = (movie) => {
    return movie.ffmpegProc.stdin.write('q');
}

videoEncode(config.url)
    .then(result => console.log(result))
    .catch(error => console.log(error))
