import TelegramBot from "node-telegram-bot-api";
import { Session } from "../session";
import tgSimplePhoneAuthProcessor from "../processor/tg.simple.phone.auth.processor";
import { unauthorizedMenu } from "../menu/keyboard.schema";

export default (msg: TelegramBot.Message, bot: TelegramBot) => {
  const chatId = msg.chat.id;
  const session = Session.getInstance().getSession(chatId);

  const phoneNumber = session.getPhoneNumber();
  if (phoneNumber) {
    tgSimplePhoneAuthProcessor(chatId, phoneNumber, bot);
  } else {
    bot.sendMessage(chatId, 'Welcome! Please authorize your phone number:', unauthorizedMenu);
  }
};