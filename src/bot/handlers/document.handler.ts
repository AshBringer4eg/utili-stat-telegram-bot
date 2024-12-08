import TelegramBot from "node-telegram-bot-api";
import { mainMenu } from "../menu/schema";

export default (msg: TelegramBot.Message, bot: TelegramBot) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, 'Raw photo or documents are not allowed, please send a photo with compression.', mainMenu);
};