export function loggerMessages(msg) {
  const { message_id, from, chat, date, text = "" } = msg;

  const name = from?.first_name || from?.username || "Unknown";
  const username = from?.username || "—";
  const userId = from?.id || "—";
  const lang = from?.language_code || "—";
  const chatType = chat?.type || "—";
  const chatId = chat?.id || "—";
  const chatName = chat?.first_name || chat?.title || "—";
  const timestamp = new Date(date * 1000).toLocaleTimeString("id-ID");
  const reset = "\x1b[0m";
  const bold = "\x1b[1m";
  const dim = "\x1b[2m";
  const italic = "\x1b[3m";
  const cyan = "\x1b[36m";
  const gray = "\x1b[90m";
  const line = `${gray}───────────────${reset}`;
  const formattedText = text
    .split("\n")
    .map((line, i) => (i === 0 ? line : `   ${line}`))
    .join("\n");

  console.log(
    `${gray}┌${line}┐${reset}
${bold}│ 📨 Message #${message_id}${reset}
│ 🧑 ${cyan}${name}${reset} ${dim}(@${username})${reset}
│ 🆔 ${userId} | ${chatType}
│ 🗓️  ${italic}${timestamp}${reset}
│ 💬 ${formattedText}
${gray}└${line}┘${reset}`,
  );
}
