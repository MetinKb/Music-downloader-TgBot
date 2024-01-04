import ytdl from 'ytdl-core'
import path from 'path'
import fs from 'fs'
import search from 'yt-search'
import { bot } from '../app.js'

async function installMusic(ctx) {
    const firstname = ctx.from.first_name
    const userId = ctx.from.id
    const chatId = ctx.chat.id
    const messageId = ctx.message_id
    const musicName = ctx.message.text.split(' ').slice(1).join(' ')

    if (musicName.length === 0) {
        ctx.reply('Boş girdi alınamaz!', { reply_to_message_id: messageId })
        return
    }

    try {
        const searchResults = await search(musicName)

        if (searchResults.videos.length === 0) ctx.reply('Aradığın şarkı bulunamadı😞.', { reply_to_message_id: messageId })

        let downloaded = false

        for (let i = 0; i < 10; i++) {
            const video = searchResults.videos[i]
            const videoUrl = video.url
            const videoTitle = video.title
            const songFolderPath = 'Songs'
            const videoInfo = await ytdl.getInfo(videoUrl)
            const videoDuration = parseInt(videoInfo.videoDetails.lengthSeconds)
            console.log('Video Süresi (saniye):', videoDuration)

            if (videoDuration > 460) {
                ctx.reply("Üzgünüm, işlemi gerçekleştiremiyorum. İstenilen şarkı süresi çok uzun...😞", { reply_to_message_id: messageId })
                return
            }

            const fileName = `${videoTitle}.mp3`
            const filePath = path.join(songFolderPath, fileName)
            console.log(fileName)
            try {
                await new Promise((resolve, reject) => {
                    ytdl(videoUrl, { filter: 'audioonly' })
                        .pipe(fs.createWriteStream(filePath))
                        .on('finish', () => {
                            downloaded = true
                            resolve()
                        })
                        .on('error', (err) => {
                            console.error('Hata oluştu:', err)
                            reject(err)
                        })
                })

                const audioMetadata = { title: videoTitle }
                const messageText =  `Music Name: \n ${audioMetadata.title} \n Requested By: ${firstname || ctx.from.username}`

                await ctx.replyWithAudio({
                    source: fs.createReadStream(filePath),
                    filename: fileName,
                }, {
                    caption: messageText
                })

                fs.unlink(filePath, (err) => {
                    if (err) console.error('Dosya silinirken hata oluştu:', err)
                })

                break

            } catch (error) {
                console.error('Şarkı indirilirken bir hata oluştu:', error)
            }
        }

        if (!downloaded) ctx.reply('Şarkı indirilemedi.', { reply_to_message_id: messageId })
    } catch (error) {
        console.error(error)
        ctx.reply('Şarkı bulunamadı.', { reply_to_message_id: messageId })
    }
}

export default installMusic