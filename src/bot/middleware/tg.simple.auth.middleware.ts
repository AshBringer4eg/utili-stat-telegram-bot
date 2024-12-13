import TelegramBot from "node-telegram-bot-api";
import { Session } from "../session";
import configuration from "../../configuration";
import { unauthorizedMenu } from "../menu/keyboard.schema";
import { authenticateGoogle } from "../../integration/google/auth";

export default async (query: TelegramBot.Message | TelegramBot.CallbackQuery, bot: TelegramBot) => {
  let chatId: number;

  if ('chat' in query) {
    // If it's a Message, get chatId directly
    chatId = query.chat.id;
  } else if ('message' in query && query.message?.chat) {
    // If it's a CallbackQuery, get chatId from the nested message
    chatId = query.message.chat.id;
  } else {
    throw new Error("Cannot determine chat ID.");
  }

  const session = Session.getInstance().getSession(chatId);
  const phoneNumber = session.getPhoneNumber();
  if (!phoneNumber || !configuration.allowedPhones.includes(phoneNumber)) {
    session.resetPhoneNumber();
    bot.sendMessage(chatId, 'Sorry, but you are not authorized to use this bot.', unauthorizedMenu);
    return false;
  }

  try {
    await authenticateGoogle();
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