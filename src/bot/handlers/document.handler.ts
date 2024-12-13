import TelegramBot from "node-telegram-bot-api";
import { getSelectMeasurementMenu } from "../menu/keyboard.schema";
import { Session } from "../session";

export default (msg: TelegramBot.Message, bot: TelegramBot) => {
  const chatId = msg.chat.id;
  const session = Session.getInstance().getSession(chatId);
  bot.sendMessage(chatId, 'Raw photo or documents are not allowed, please send a photo with compression.', getSelectMeasurementMenu(session));
};