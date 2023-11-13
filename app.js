import TelegramBot from "node-telegram-bot-api"
import langs from "./langs.js"
import dotenv from 'dotenv'
import installMusic from './Commands/music.js'
dotenv.config()

export const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN)
const myAccount = "@MetinK04"

bot.onText(/\/start/, (msg) => {
    bot.sendMessage(msg.chat.id, `Merhaba ${msg.from.first_name || msg.from.username}!\n${langs.tr.welcome}`)
})

bot.onText(/\/help/, (msg) => {
    bot.sendMessage(msg.chat.id, `Merhaba ${msg.from.first_name || msg.from.username}!\n${langs.tr.help} ${myAccount}`)
})

bot.onText(/\/info/, (msg) => {
    bot.sendMessage(msg.chat.id, `Merhaba ${msg.from.first_name || msg.from.username}!\n${langs.tr.info}`)
})

bot.onText(/\/install/, installMusic)

console.log('Bot başlatıldı.')

bot.startPolling()

// bot.onText(/\/info/, async (msg) => {
//     const languageData = await langControl(msg)
//     bot.sendMessage(msg.chat.id, languages[languageData].info)
// })