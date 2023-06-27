var Ffmpeg = require('fluent-ffmpeg');
var config = require('./config')

function videoEncode(url, stream) {
    const link = url + stream + '.m3u8'
    let crash = false;
    return new Promise((resolve, reject) => {
        let encode = new Ffmpeg()
            .input(link)
            .inputOption([
                "-vsync 0",
                "-hwaccel cuvid",
                "-hwaccel_device 0",
                "-c:v h264_cuvid"
            ])
            .videoCodec("h264_nvenc")
            .videoFilter("fps=5")
            .noAudio()
            //.native()
            //.audioCodec('aac')
            //.audioBitrate(128)
            //.audioChannels(2)
            .videoBitrate(100)
            .save(`./output/${stream}.mp4`)
            .on('start', function () {
                console.log(`Start Encoding: ${stream}`)
                setTimeout(function () {
                    encode.on('error', function () {
                        //console.log('Ffmpeg has been killed');
                        resolve('killed', stream)
                    });

                    //stop(encode);
                    if (!crash) encode.ffmpegProc.stdin.write('q');
                }, 30000);
            })
            .on('progress', function (progress) {
                //console.log('Processing: ' + stream);
            })
            .on('codecData', function (data) {
                console.log('Stream ' + stream + ' Input is ' + data.audio + ' audio ' +
                    'with ' + data.video + ' video');
            })
            .on('error', (err) => {
                //console.log(err)
                crash = true;
                reject(`stream: ${stream} error: ${err}`)
            })
            .on('end', () => {
                //console.log("done")
                crash = true;
                resolve('done');
            });

        const stop = (movie) => {
            return movie.ffmpegProc.stdin.write('q');
        }


    })
}




// videoEncode(config.url)
//     .then(result => console.log(result))
//     .catch(error => console.log(error))

for (let i = 1; i < 6; i++) {
    const num = '000' + i;
    const sub = num.length <= 4 ? num : num.substring(num.length - 4)
    // fetch(config.url + sub + '.m3u8')
    //     .then((response) => {
    //         console.log(`Sub ${sub} can reach. Status ${response.status}`)

    //     })
    //     .catch(function (err) {
    //         console.log("Unable to fetch -", err);
    //     });
    videoEncode(config.url, sub)
        .then(result => console.log(result))
        .catch(error => console.log(`stream: ${sub} error: ${error}`))
}