const fetch = require("node-fetch");
const { loggerMessages } = require("./logger.cjs");
// import { sendMedia } from "./sendMedias.js";c
const FormDatas = require("form-data");

async function startPolling(ctx) {
  let offset = 0;
  const { token, handler, loggerMessage } = ctx;
  const api = `https://api.telegram.org/bot${token}`;

  async function loop() {
    const url = `${api}/getUpdates?timeout=15&offset=${offset}`;

    try {
      const response = await fetch(url);

      if (response.status === 409) {
        throw new Error(
          "[telegram-connect] ❌ Bot is already running somewhere else (409 Conflict)",
        );
      }

      const data = await response.json();

      if (data.result) {
        for (const update of data.result) {
          offset = update.update_id + 1;

          if (update.message) {
            const msg = update.message;

            if (loggerMessage) {
              loggerMessages(msg);
            }

            if (msg.new_chat_members && Array.isArray(msg.new_chat_members)) {
              for (const members of msg.new_chat_members) {
                handler.handle("join", {
                  ...msg,
                  newMember: members,
                  sendMessage: (text, options = {}) => {
                    const payload = {
                      chat_id: msg.chat.id,
                      text,
                    };

                    const mode =
                      options.markdown_version === "2" &&
                      options.parse_mode === "markdown"
                        ? "MarkdownV2"
                        : options.parse_mode === "markdown"
                          ? "Markdown"
                          : options.parse_mode === "html"
                            ? "HTML"
                            : undefined;

                    if (mode) {
                      payload.parse_mode = mode;

                      if (mode === "MarkdownV2" && options.replace) {
                        payload.text = text.replace(
                          /[_*[\]()~`>#+\-=|{}.!]/g,
                          (char) => "\\" + char,
                        );
                      }
                    }

                    if (options.buttons) {
                      payload.reply_markup = {
                        inline_keyboard: [options.buttons],
                      };
                    }

                    return fetch(`${api}/sendMessage`, {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify(payload),
                    }).then(async (res) => {
                      const json = await res.json();
                      if (!json.ok && payload.parse_mode === "HTML") {
                        throw new TypeError(
                          "Invalid HTML message: " + json.description,
                        );
                      }
                      return json;
                    });
                  },
                  replyWithButtons: (text, buttons) => {
                    return fetch(`${api}/sendMessage`, {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        chat_id: msg.chat.id,
                        text,
                        reply_markup: buttons
                          ? { inline_keyboard: [buttons] }
                          : undefined,
                      }),
                    }).then((s) => s.json());
                  },
                  replyMarkdown: (text, options = {}) => {
                    let mdText = text;
                    const version =
                      options.markdown_version === "2"
                        ? "MarkdownV2"
                        : "Markdown";

                    if (options.replace && version === "MarkdownV2") {
                      const isPreCodeBlock =
                        text.trim().startsWith("```") &&
                        text.trim().endsWith("```");

                      if (!isPreCodeBlock) {
                        mdText = text.replace(
                          /[_*[\]()~`>#+\-=|{}.!]/g,
                          (char) => "\\" + char,
                        );
                      }
                    }

                    const payload = {
                      chat_id: msg.chat.id,
                      text: mdText,
                      parse_mode: version,
                    };

                    if (options.buttons) {
                      payload.reply_markup = {
                        inline_keyboard: [options.buttons],
                      };
                    }

                    return fetch(`${api}/sendMessage`, {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify(payload),
                    }).then((res) => res.json());
                  },
                  replyHTML: async (text, options = {}) => {
                    const payload = {
                      chat_id: msg.chat.id,
                      text,
                      parse_mode: "HTML",
                    };

                    if (options.buttons) {
                      payload.reply_markup = {
                        inline_keyboard: [options.buttons],
                      };
                    }

                    return fetch(`${api}/sendMessage`, {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify(payload),
                    }).then(async (res) => {
                      const json = await res.json();
                      if (!json.ok) {
                        throw new TypeError(
                          "Invalid HTML message: " + json.description,
                        );
                      }
                      return json;
                    });
                  },
                });
              }
            }

            handler.handle("message", {
              ...msg,
              sendMessage: (text, options = {}) => {
                const payload = {
                  chat_id: msg.chat.id,
                  text,
                };

                const mode =
                  options.markdown_version === "2" &&
                  options.parse_mode === "markdown"
                    ? "MarkdownV2"
                    : options.parse_mode === "markdown"
                      ? "Markdown"
                      : options.parse_mode === "html"
                        ? "HTML"
                        : undefined;

                if (mode) {
                  payload.parse_mode = mode;

                  if (mode === "MarkdownV2" && options.replace) {
                    payload.text = text.replace(
                      /[_*[\]()~`>#+\-=|{}.!]/g,
                      (char) => "\\" + char,
                    );
                  }
                }

                if (options.buttons) {
                  payload.reply_markup = {
                    inline_keyboard: [options.buttons],
                  };
                }

                return fetch(`${api}/sendMessage`, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(payload),
                }).then(async (res) => {
                  const json = await res.json();
                  if (!json.ok && payload.parse_mode === "HTML") {
                    throw new TypeError(
                      "Invalid HTML message: " + json.description,
                    );
                  }
                  return json;
                });
              },
              replyWithButtons: (text, buttons) => {
                return fetch(`${api}/sendMessage`, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    chat_id: msg.chat.id,
                    text,
                    reply_markup: buttons
                      ? { inline_keyboard: [buttons] }
                      : undefined,
                  }),
                }).then((s) => s.json());
              },
              replyMarkdown: (text, options = {}) => {
                let mdText = text;
                const version =
                  options.markdown_version === "2" ? "MarkdownV2" : "Markdown";

                if (options.replace && version === "MarkdownV2") {
                  const isPreCodeBlock =
                    text.trim().startsWith("```") &&
                    text.trim().endsWith("```");

                  if (!isPreCodeBlock) {
                    mdText = text.replace(
                      /[_*[\]()~`>#+\-=|{}.!]/g,
                      (char) => "\\" + char,
                    );
                  }
                }

                const payload = {
                  chat_id: msg.chat.id,
                  text: mdText,
                  parse_mode: version,
                };

                if (options.buttons) {
                  payload.reply_markup = {
                    inline_keyboard: [options.buttons],
                  };
                }

                return fetch(`${api}/sendMessage`, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(payload),
                }).then((res) => res.json());
              },
              replyHTML: async (text, options = {}) => {
                const payload = {
                  chat_id: msg.chat.id,
                  text,
                  parse_mode: "HTML",
                };

                if (options.buttons) {
                  payload.reply_markup = {
                    inline_keyboard: [options.buttons],
                  };
                }

                return fetch(`${api}/sendMessage`, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(payload),
                }).then(async (res) => {
                  const json = await res.json();
                  if (!json.ok) {
                    throw new TypeError(
                      "Invalid HTML message: " + json.description,
                    );
                  }
                  return json;
                });
              },
              sendPhoto: async (photo, options = {}) => {
                try {
                  if (!options.mimetype)
                    throw new TypeError("Missing mimetype for photo");

                  const form = new FormDatas();
                  const chatId = msg.from?.id || msg.chat?.id;
                  if (!chatId) throw new TypeError("Missing chat_id");

                  form.append("chat_id", chatId);
                  if (options.caption) form.append("caption", options.caption);
                  if (options.parse_mode)
                    form.append("parse_mode", options.parse_mode);
                  if (options.reply_markup) {
                    form.append(
                      "reply_markup",
                      JSON.stringify(options.reply_markup),
                    );
                  }

                  const filename =
                    options.filename ||
                    `file.${options.mimetype.split("/")[1] || "dat"}`;
                  let fileData;

                  if (photo.url) {
                    const res = await fetch(photo.url);
                    if (!res.ok)
                      throw new Error(
                        `Failed to fetch photo: ${res.statusText}`,
                      );
                    const buffer = await res.arrayBuffer();
                    fileData = Buffer.from(buffer);
                  } else if (photo.buffer) {
                    fileData = photo.buffer;
                  } else {
                    throw new TypeError("photo must be { url } or { buffer }");
                  }

                  form.append("photo", fileData, {
                    filename,
                    contentType: options.mimetype,
                  });

                  const response = await fetch(`${api}/sendPhoto`, {
                    method: "POST",
                    headers: form.getHeaders(),
                    body: form,
                  });

                  const json = await response.json();

                  console.log("[sendPhoto response]", json); // <-- Debug Log

                  if (!json.ok) {
                    throw new Error(`Telegram API Error: ${json.description}`);
                  }

                  return json;
                } catch (err) {
                  console.error("[sendPhoto error]", err); // <-- Catch Error
                  throw err;
                }
              },
              inlineKeyboard: (button = []) => {
                return button;
              },
            });
          }
        }
      }
    } catch (err) {
      handler.handle("error", err.message || String(err));
    } finally {
      setTimeout(loop, 1000);
    }
  }

  loop();
}

module.exports = { startPolling };