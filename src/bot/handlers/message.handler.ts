import TelegramBot from "node-telegram-bot-api";
import menuInteractionProcessor from "../processor/menu.interaction.processor";
import { cancelMenu, getSelectMeasurementMenu, mainMenu } from "../menu/schema";
import tgSimpleAuthMiddleware from "../middleware/tg.simple.auth.middleware";
import { Session } from "../session";
import { addMeasurementRow } from "../../integration/google/sheets";

export default async (msg: TelegramBot.Message, bot: TelegramBot) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  if (!text && !msg.photo && !msg.document && !msg.contact){
    return bot.sendMessage(chatId, 'Make your selection from menu below', mainMenu);
  }
  const session = Session.getInstance().getSession(chatId);
  const activeMeasurement = session.getActiveMesurement();
  if (text){
    if (await tgSimpleAuthMiddleware(msg, bot)) {
      menuInteractionProcessor(chatId, text, bot);
    }
    if (activeMeasurement && activeMeasurement.fileGdId) {
      const number = Number(text);
      if (isNaN(number)){
        bot.sendMessage(chatId, '✏️ Please enter a valid number for your measurement', cancelMenu);
      } else {
        activeMeasurement.value = number;
        try {
          await addMeasurementRow(activeMeasurement);
          session.finalizeActiveMeasurment();
        } catch (error) {
          if (error instanceof Error) {
            bot.sendMessage(chatId, `❌ ${error.message}`, cancelMenu);
          } else {
            bot.sendMessage(chatId, '❌ An unknown error occurred.', cancelMenu);
          }
        }
        bot.sendMessage(
          chatId,
          `✅ Your data stored successfully. ${session.hasEmptyMeasurements() ? 'You have to make another measurement' : ''}`,
          session.hasEmptyMeasurements() ? getSelectMeasurementMenu(session) : mainMenu
        );
      }
    }
  }
};