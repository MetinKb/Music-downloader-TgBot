async function pin(ctx) {
    const messageId = ctx.message.message_id
    const firstname = ctx.from.first_name
    const userId = ctx.from.id
    const member = await ctx.getChatMember(userId)
    const canPinMessage = await member.can_pin_messages

    if (canPinMessage == false) {
        ctx.reply(`[${firstname}](tg://user?id=${userId}), mesaj sabitleme yetkin bulunmamakta.`, { parse_mode: 'Markdown' }, { reply_to_message_id: messageId })
        return
    }

    if (!ctx.message.reply_to_message) {
        ctx.reply(`${firstname}, lütfen sabitlemek istediğin mesajı yanıtlayarak yeniden dene.`,
            { reply_to_message_id: messageId })
    } else {
        const chatId = ctx.chat.username
        const repliedMessage = ctx.message.reply_to_message.message_id
        ctx.pinChatMessage(repliedMessage)
        ctx.reply(`[Bu](t.me/${chatId}/${messageId}) mesaj [${firstname}](tg://user?id=${userId}) tarafından sabitlendi.`, { parse_mode: 'Markdown' })
    }
}

export default pin