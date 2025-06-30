function createHandler({ prefix }) {
  const handlers = {};
  const commandHandlers = {};

  function on(event, callback) {
    handlers[event] = callback;
  }

  function commands(cmd, callback) {
    commandHandlers[cmd] = callback;
  }

  function handle(event, msg) {
    if (event === "message") {
      const text = msg.text?.trim();

      if (text && text?.startsWith(prefix)) {
        const command = text.split(" ")[0].substring(prefix.length);
        const cmdHandler = commandHandlers[command];
        if (cmdHandler) return cmdHandler(msg);
      }

      handlers.message?.(msg);
    }

    if (event === "error") {
      handlers.error?.(msg);
    }

    if (event === "join") {
      handlers.join?.(msg);
    }
  }

  return { on, commands, handle };
}

module.exports = { createHandler };
