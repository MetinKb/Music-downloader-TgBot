import ytdl from 'ytdl-core'
import path from 'path'
import fs from 'fs'
import search from 'yt-search'
import langs from '../langs.js'
import { bot } from '../app.js'

async function installMusic(msg) {
    const username = msg.from.first_name
    const userId = msg.from.id
    const chatId = msg.chat.id
    const logId = '@NK_logMedia'
    const musicName = msg.text.split(' ').slice(1).join(' ')

    if (musicName.length === 0) {
        bot.sendMessage(chatId, 'Boş girdi alınamaz!')
        return
    }

    try {
        const searchResults = await search(musicName)

        if (searchResults.videos.length === 0) {
            throw new Error('Aradığın şarkı bulunamadı😞.')
        }

        let downloaded = false

        for (let i = 0; i < 10; i++) {

            const videoUrl = searchResults.videos[i].url
            const videoTitle = searchResults.videos[i].title
            const songFolderPath = 'Songs'
            const videoInfo = await ytdl.getInfo(videoUrl)
            const videoDuration = parseInt(videoInfo.videoDetails.lengthSeconds)
            console.log('Video Süresi (saniye):', videoDuration)

            if (videoDuration > 460) {
                bot.sendMessage(chatId, "Üzgünüm, işlemi gerçekleştiremiyorum. İstenilen şarkı süresi çok uzun...😞")
                return
            }

            const fileName = `${videoTitle}.mp3`
            const filePath = path.join(songFolderPath, fileName)

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

                const audioMetadata = {
                    title: videoTitle
                }

                const messageText = `${langs.tr.songName} ${audioMetadata.title}\n\n${langs.tr.requestedBy} ${msg.from.first_name || msg.from.username} \n\n${langs.tr.uploadedBy} \n@NK_MediaBot`

                const logText = `${langs.tr.songName} ${audioMetadata.title}\n\n${langs.tr.requestedBy} \n[${username}](tg://user?id=${userId})`

                await bot.sendAudio(chatId, fs.createReadStream(filePath), {
                    caption: messageText
                })

                await bot.sendMessage(logId, logText, { parse_mode: "Markdown" })

                fs.unlink(filePath, (err) => {
                    if (err) {
                        console.error('Dosya silinirken hata oluştu:', err)
                    } else {
                        console.log('Dosya silindi:', filePath)
                    }
                })

                break

            } catch (error) {
                console.error('Şarkı indirilirken bir hata oluştu:', error)
            }
        }

        if (!downloaded) {
            throw new Error('Şarkı indirilemedi.')
        }
    } catch (error) {
        console.error(error)
        bot.sendMessage(chatId, 'Şarkı bulunamadı.')
    }
}

export default installMusic