const Button = {
  /**
   * Opens a URL when button is clicked
   */
  url(text, url) {
    return { text, url };
  },

  /**
   * Sends a callback query to bot
   */
  callback(text, data) {
    return { text, callback_data: data };
  },

  /**
   * Opens inline query in any chat
   */
  switch(text, query) {
    return { text, switch_inline_query: query };
  },

  /**
   * Opens inline query in current chat
   */
  switchCurrent(text, query) {
    return { text, switch_inline_query_current_chat: query };
  },

  /**
   * Opens a payment flow (requires invoice setup)
   */
  pay(text) {
    return { text, pay: true };
  },

  /**
   * Opens a WebApp
   */
  webApp(text, url) {
    return { text, web_app: { url } };
  },
};

module.exports = { Button };