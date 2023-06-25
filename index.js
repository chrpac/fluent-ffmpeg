var ffmpeg = require('fluent-ffmpeg');
var config = require('./config')

function videoEncode(url, stream) {
    const link = url + stream + '.m3u8'
    return new Promise((resolve, reject) => {
        let encode = ffmpeg()
            .input(link)
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
            .save(`./output/${stream}.mp4`)
            .on('start', function () {
                console.log(`Start Encoding: ${stream}`)
            })
            .on('progress', function (progress) {
                //console.log('Processing: ');
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
                resolve('killed', stream)
            });

            //stop(encode);
            encode.ffmpegProc.stdin.write('q');
        }, 60000);
    })
}


const stop = (movie) => {
    return movie.ffmpegProc.stdin.write('q');
}

// videoEncode(config.url)
//     .then(result => console.log(result))
//     .catch(error => console.log(error))

for (let i = 1; i < 20; i++) {
    const num = '000' + i;
    const sub = num.length <= 4 ? num : num.substring(num.length - 4)
    videoEncode(config.url, sub)
        .then(result => console.log(result))
        .catch(error => console.log(error))
}