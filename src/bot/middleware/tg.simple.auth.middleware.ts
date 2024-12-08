import TelegramBot from "node-telegram-bot-api";
import { Session } from "../session";
import configuration from "../../configuration";
import { unauthorizedMenu } from "../menu/schema";
import { authenticateGoogle } from "../../integration/google/auth";

export default (message: TelegramBot.Message, bot: TelegramBot) => {
  const chatId = message.chat.id;
  const session = Session.getInstance().getSession(chatId);
  const phoneNumber = session.getPhoneNumber();
  if (!phoneNumber || !configuration.allowedPhones.includes(phoneNumber)) {
    session.resetPhoneNumber();
    bot.sendMessage(chatId, 'Sorry, but you are not authorized to use this bot.', unauthorizedMenu);
    return false;
  }

  try {
    authenticateGoogle();
  } catch (error) {
    if (error instanceof Error) {
      bot.sendMessage(chatId, error.message, { parse_mode: "HTML" });
    } else {
      bot.sendMessage(chatId, 'An unknown error occurred.');
    }
    return false;
  }

  return true;
};