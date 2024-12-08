import TelegramBot from "node-telegram-bot-api";
import tgSimplePhoneAuthProcessor from "../processor/tg.simple.phone.auth.processor";

export default (msg: TelegramBot.Message, bot: TelegramBot) => {
  const chatId = msg.chat.id;
  const contact = msg.contact;

  if (contact) {
    const phoneNumber = contact.phone_number;
    tgSimplePhoneAuthProcessor(chatId, phoneNumber, bot);
  } else {
    bot.sendMessage(chatId, "Failed to retrieve contact information.");
  }
};