/**
 * Function to check if date is not less than 5 minutes ago
 */
function checkDate(ctx, next) {
  let message =
    ctx.update.message || ctx.update.channel_post || ctx.update.callback_query
  if (ctx.update.callback_query) {
    message = message.message
  }
  if (!message) {
    console.info(
      'Not processing because no message found',
      JSON.stringify(ctx.update, undefined, 2)
    )
    return
  }
  const isMsgNew = Date.now() / 1000 - message.date < 5 * 60
  if (!isMsgNew) {
    console.info(
      'Not processing message',
      message.date,
      JSON.stringify(message, undefined, 2)
    )
  }
  return isMsgNew ? next() : undefined
}

// Exports
module.exports = {
  checkDate,
}
