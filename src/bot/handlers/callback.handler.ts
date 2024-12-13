import TelegramBot from "node-telegram-bot-api";
import { Session } from "../session";
import { ACTIONS, CB_ACTION, CB_CATEGORY } from "../menu/menu.type";
import { confirmMeasurementDeletionMenu } from "../menu/keyboard.schema";

type CallbackData = {
  category: CB_CATEGORY;
  action: CB_ACTION;
  type: ACTIONS;
};

export default (query: TelegramBot.CallbackQuery, bot: TelegramBot) => {
  const chatId = query.message?.chat.id;
  if (!chatId) {
    throw new Error("Cannot determine chat ID.");
  }

  const data: CallbackData = JSON.parse(query?.data || '{}') as CallbackData;

  if (!data.category) {
    throw new Error("There is no category in the callback data.");
  }
  if (!data.action) {
    throw new Error("There is no action in the callback data.");
  }
  if (!data.type) {
    throw new Error("There is no type in the callback data.");
  }

  const session = Session.getInstance().getSession(chatId);
  const measurementElement = session.getMeasurementSessionElement(data.type);
  if (!measurementElement) {
    throw new Error("There is no measurement element in the session.");
  }

  switch (data.category) {
    case CB_CATEGORY.OVERVIEW:
      switch (data.action) {
        case CB_ACTION.EDIT_VALUE:
          session.resetAllWaitings();
          measurementElement.waitForValueEdit = true;
          return bot.sendMessage(chatId, `Send new value for ${measurementElement.type}`);
        case CB_ACTION.EDIT_PHOTO:
          session.resetAllWaitings();
          measurementElement.waitForPhotoEdit = true;
          return bot.sendMessage(chatId, `Send new photo for ${measurementElement.type}`);
        case CB_ACTION.REMOVE_MEASURMENT:
          session.resetAllWaitings();
          measurementElement.waitForDelete = true;
          return bot.sendMessage(chatId, `Are you sure you want to remove ${measurementElement.type}?`, confirmMeasurementDeletionMenu);
      }
      break;
  }

  console.log(measurementElement);
  bot.sendMessage(chatId, 'This is a callback handler.');
};