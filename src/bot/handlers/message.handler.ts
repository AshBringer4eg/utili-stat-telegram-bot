import TelegramBot from "node-telegram-bot-api";
import menuInteractionProcessor from "../processor/menu.interaction.processor";
import { closeMeasurementSessionMenu, getSelectMeasurementMenu, mainMenu } from "../menu/keyboard.schema";
import tgSimpleAuthMiddleware from "../middleware/tg.simple.auth.middleware";
import { Session } from "../session";
import { addMeasurementRow, deleteMeasurementRow } from "../../integration/google/sheets";
import { valueToReadableString } from "../../utils/measurements.values.convertor";

export default async (msg: TelegramBot.Message, bot: TelegramBot) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  if (!text && !msg.photo && !msg.document && !msg.contact){
    return bot.sendMessage(chatId, 'Make your selection from menu below', mainMenu);
  }

  if (text){
    if (await tgSimpleAuthMiddleware(msg, bot)) {
      const menuHandled = await menuInteractionProcessor(chatId, text, bot);
      if (menuHandled) return;
    }

    const session = Session.getInstance().getSession(chatId);
    const activeMeasurement = session.getActiveMesurement();
    const awaitingMeasurement = session.getAwaitingMesurement();

    if (activeMeasurement){
      if (activeMeasurement && activeMeasurement.fileGdId) {
        const number = Number(text);
        if (isNaN(number)){
          bot.sendMessage(chatId, '✏️ Please enter a valid number for your measurement', closeMeasurementSessionMenu);
        } else {
          activeMeasurement.value = number;
          try {
            await addMeasurementRow(activeMeasurement);
            session.finalizeActiveMeasurment();
          } catch (error) {
            if (error instanceof Error) {
              bot.sendMessage(chatId, `❌ ${error.message}`, closeMeasurementSessionMenu);
            } else {
              bot.sendMessage(chatId, '❌ An unknown error occurred.', closeMeasurementSessionMenu);
            }
          }
          bot.sendMessage(
            chatId,
            `✅ Your data stored successfully. ${session.hasNonFinalizedMeasurements() ? 'You have to make another measurement' : ''}`, getSelectMeasurementMenu(session));
        }
      }
    }
    if (awaitingMeasurement){
      if (awaitingMeasurement.waitForValueEdit){
        const number = Number(text);
        if (isNaN(number)){
          bot.sendMessage(chatId, '✏️ Please enter a valid number for your measurement'); // TODO Add menu to cancel edit
        } else {
          const oldValue = awaitingMeasurement.value;
          try {
            await deleteMeasurementRow(awaitingMeasurement);
            awaitingMeasurement.value = number;
            await addMeasurementRow(awaitingMeasurement);
          } catch (error) {
            if (error instanceof Error) {
              bot.sendMessage(chatId, `❌ ${error.message}`);
            } else {
              bot.sendMessage(chatId, '❌ An unknown error occurred.');
            }
          }

          awaitingMeasurement.waitForValueEdit = false;

          if (oldValue && awaitingMeasurement.value) {
            bot.sendMessage(chatId, `✅ Value for ${awaitingMeasurement.type} successfully updated from ${valueToReadableString(oldValue, awaitingMeasurement.type)} to ${valueToReadableString(awaitingMeasurement.value, awaitingMeasurement.type)}`, getSelectMeasurementMenu(session));
          } else if (awaitingMeasurement.value){
            bot.sendMessage(chatId, `✅ Value for ${awaitingMeasurement.type} successfully updated to ${valueToReadableString(awaitingMeasurement.value, awaitingMeasurement.type)}`, getSelectMeasurementMenu(session));
          } else {
            // I don't think this can happen
          }
        }
      }
    }
  }
};