import TelegramBot from "node-telegram-bot-api";
import menuInteractionProcessor from "../processor/menu.interaction.processor";
import { mainMenu } from "../menu/schema";
import tgSimpleAuthMiddleware from "../middleware/tg.simple.auth.middleware";

export default async (msg: TelegramBot.Message, bot: TelegramBot) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  if (!text && !msg.photo && !msg.document && !msg.contact){
    return bot.sendMessage(chatId, 'Make your selection from menu below', mainMenu);
  }


  if (text){
    if (await tgSimpleAuthMiddleware(msg, bot)) {
      menuInteractionProcessor(chatId, text, bot);
    }
  }


};