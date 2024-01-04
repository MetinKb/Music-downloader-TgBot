import { Telegraf } from "telegraf"
import dotenv from 'dotenv'
import installMusic from './Commands/music.js'
dotenv.config()

export const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN, { polling: true })
const myAccount = "@MetinK04"

bot.start((ctx) => {
    ctx.reply(`Merhaba ${ctx.from.first_name || ctx.from.username}!`)
})

bot.help((ctx) => {
    ctx.reply(`Merhaba ${ctx.from.first_name || ctx.from.username}!`)
})

bot.command('info', (ctx) => {
    ctx.reply(`Merhaba ${ctx.from.first_name || ctx.from.username}!`)
})

bot.command('install', installMusic)

console.log('Bot başlatıldı.')
bot.launch()