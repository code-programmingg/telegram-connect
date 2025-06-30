const { createHandler } = require("./handler.cjs");
const { startPolling } = require("./poller.cjs");

async function connect({ token, verify, prefix = "/" }) {
  if (!token) throw new Error("[telegram-connect] Bot token is required");

  if (typeof verify !== "boolean") {
    throw new TypeError(
      "verify must be true/false" +
        "\n- Verify verify your token bot is valid or not",
    );
  }

  if (verify) {
    const ress = await fetch(`https://api.telegram.org/bot${token}`);
    const json = await ress.json();
    if (ress.status !== 404) {
      throw new Error("Token is not valid token for your bot!");
    }
    if (json.ok) throw "Token valid continue.";
  }

  const handler = createHandler({ prefix: prefix });
  const api = `https://api.telegram.org/bot${token}`;
  let started = false;

  const assertStarted = () => {
    if (!started) throw new Error("Call bot.start() before using this");
  };

  return {
    on: (...args) => {
      assertStarted();
      return handler.on(...args);
    },

    commands: new Proxy(
      {},
      {
        get(_, cmdName) {
          assertStarted();
          return (callback) => handler.commands(cmdName, callback);
        },
      },
    ),

    sendMessage: async (chatId, options) => {
      assertStarted();
      const res = await fetch(`${api}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          ...options,
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Failed to send message (${res.status}): ${text}`);
      }

      return res.json();
    },

    start: (options = { loggerMessage: false }) => {
      if (started) throw new Error("[telegram-connect] Bot already started");
      started = true;
      startPolling({ token, handler, loggerMessage: options.loggerMessage });
    },
  };
}

module.exports = { connect };
