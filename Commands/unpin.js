async function unpin(ctx) {
    const messageId = ctx.message.message_id
    const firstname = ctx.from.first_name
    const userId = ctx.from.id
    const member = await ctx.getChatMember(userId)
    const canUnpinMessage = await member.can_pin_messages

    if (canUnpinMessage == false) {
        ctx.reply(`[${firstname}](tg://user?id=${userId}), sabitlenen mesajı kaldırma yetkin bulunmamakta.`, { reply_to_message_id: messageId }, { parse_mode: 'Markdown' })
        return
    }

    if (!ctx.message.reply_to_message) {
        ctx.reply(`${firstname}, lütfen sabitlemesini kaldırmak istediğin mesajı yanıtlayarak yeniden dene.`,
            { reply_to_message_id: messageId })
    } else {
        const chat = ctx.chat.username
        const repliedMessage = ctx.message.reply_to_message.message_id
        console.log(repliedMessage)
        ctx.reply(`[Bu](t.me/${chat}/${messageId}) mesaj [${firstname}](tg://user?id=${userId}) tarafından sabitlenenlerden kaldırıldı.`, { parse_mode: 'Markdown' })
        ctx.unpinChatMessage(repliedMessage)
    }
}

export default unpin