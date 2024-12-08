import TelegramBot from "node-telegram-bot-api";
import configuration from "../../configuration";
import { Session } from "../session";
import { mainMenu, unauthorizedMenu } from "../menu/schema";

export default (chatId: number, phoneNumber: string, bot: TelegramBot) => {
  const session = Session.getInstance().getSession(chatId);

  if (configuration.allowedPhones.includes(phoneNumber)) {
    session.setPhoneNumber(phoneNumber);
    bot.sendMessage(chatId, `Thank you for sharing your phone number. Now you can continue the process.`, mainMenu);
  } else {
    session.resetPhoneNumber();
    bot.sendMessage(chatId, 'Sorry, but you are not authorized to use this bot.', unauthorizedMenu);
  }
};