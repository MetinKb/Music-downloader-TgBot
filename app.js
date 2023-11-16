import { Telegraf } from "telegraf"
import langs from "./langs.js"
import dotenv from 'dotenv'
import installMusic from './Commands/music.js'
import pin from './Commands/pin.js'
import unpin from './Commands/unpin.js'
dotenv.config()

export const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN, { polling: true })
const myAccount = "@MetinK04"

bot.start((ctx) => {
    ctx.reply(`Merhaba ${ctx.from.first_name || ctx.from.username}!\n${langs.tr.welcome}`)
})

bot.help((ctx) => {
    ctx.reply(`Merhaba ${ctx.from.first_name || ctx.from.username}!\n${langs.tr.help} ${myAccount}`)
})

bot.command('info', (ctx) => {
    ctx.reply(`Merhaba ${ctx.from.first_name || ctx.from.username}!\n${langs.tr.info}`)
})

bot.command('install', installMusic)
bot.command('pin', pin)
bot.command('unpin', unpin)

console.log('Bot başlatıldı.')
bot.launch()