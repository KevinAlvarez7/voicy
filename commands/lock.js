// Dependencies
const { findChat } = require('../helpers/db')
const { checkAdminLock } = require('../helpers/admins')
const { checkDate } = require('../helpers/filter')

/**
 * Setting up lock command
 * @param {Telegraf:Bot} bot Bot that should get lock setup
 */
function setupLock(bot) {
  bot.command('lock', checkDate, async ctx => {
    // Get chat
    let chat = await findChat(ctx.chat.id)
    // Check if admin locked
    const adminLockCheck = await checkAdminLock(chat, ctx)
    if (!adminLockCheck) return
    // Setup localizations
    const strings = require('../helpers/strings')()
    strings.setChat(chat)
    // Check if private or channel
    if (ctx.chat.type === 'private') {
      const text = '😅 Sorry, but this command only works in group chats.'
      ctx.replyWithMarkdown(strings.translate(text))
      return
    }
    // Reverse admin lock
    chat.adminLocked = !chat.adminLocked
    // Save chat
    chat = await chat.save()
    // Reply with the new setting
    const text = chat.adminLocked
      ? '🔑 Great! *Voicy* will now respond only to command calls sent by *admins* in this chat.'
      : '🔑 Great! *Voicy* will now respond only to command calls from *anyone* in this chat.'
    await ctx.replyWithMarkdown(strings.translate(text))
    // Log time
    console.info(
      `/lock answered in ${(new Date().getTime() - ctx.timeReceived.getTime()) /
        1000}s`
    )
  })
}

// Exports
module.exports = {
  setupLock,
}
