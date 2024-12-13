import { SessionElement } from "../session";
import { ACTIONS } from "./menu.type";

export const unauthorizedMenu = {
  reply_markup: {
    keyboard: [
      [{
        text: ACTIONS.SHARE_CONTACTS,
        request_contact: true,
      }],
    ],
    resize_keyboard: true,
  },
};

export const mainMenu = {
  reply_markup: {
    keyboard: [
      [{ text: ACTIONS.START_MEASUREMENT_SESSION }, { text: ACTIONS.LOGOUT }],
    ],
    resize_keyboard: true,
  },
};

export const closeMeasurementSessionMenu = {
  reply_markup: {
    keyboard: [
      [{ text: ACTIONS.CLOSE_MEASUREMENT_SESSION }],
    ],
    resize_keyboard: true,
  },
};

export const cancelMeasurementElementEditMenu = {
  reply_markup: {
    keyboard: [
      [{ text: ACTIONS.CANCEL_MEASUREMENT_ELEMENT_EDIT }],
    ],
    resize_keyboard: true,
  },
};

export const cancelMeasurementElementAddMenu = {
  reply_markup: {
    keyboard: [
      [{ text: ACTIONS.CANCEL_MEASUREMENT_ELEMENT_ADD }],
    ],
    resize_keyboard: true,
  },
};

export const fastCloseSessionMenu = {
  reply_markup: {
    keyboard: [
      [{ text: ACTIONS.FAST_MEASUREMENT_SESSION_CLOSE }, { text: ACTIONS.BACK_TO_MAIN_MENU }],
    ],
    resize_keyboard: true,
  },
};

export const confirmMeasurementDeletionMenu = {
  reply_markup: {
    keyboard: [
      [{ text: ACTIONS.CONFIRM_DELETE_MEASUREMENT }, { text: ACTIONS.CANCEL_MEASUREMENT_ELEMENT_EDIT }],
    ],
    resize_keyboard: true,
  },
};


export const confirmCancelMenu = {
  reply_markup: {
    keyboard: [
      [{ text: ACTIONS.CONFIRM_CLOSE_MEASUREMENT_SESSION }, { text: ACTIONS.BACK_TO_MAIN_MENU }],
    ],
    resize_keyboard: true,
  },
};

export const getSelectMeasurementMenu = (session: SessionElement) => {
  const measurementSession = session.getMeasurementSession();
  const statSelectionMenu = {
    reply_markup: {
      keyboard: [
        [{ text: ACTIONS.CLOSE_MEASUREMENT_SESSION }],
      ],
      resize_keyboard: true,
    },
  };

  const keyboard = statSelectionMenu.reply_markup.keyboard;

  if (session.hasNonFinalizedMeasurements()) {
    keyboard[0].push({ text: ACTIONS.BACK_TO_MAIN_MENU });
  }

  if (session.hasFinalizedMeasurements()) {
    keyboard[0].push({ text: ACTIONS.SESSION_OVERVIEW });
  }

  let buttonsAdded = 0;
  for (const key in measurementSession) {
    const measurement = measurementSession[key];

    if (buttonsAdded % 3 === 0) {
      keyboard.unshift([]);
    }

    if (!measurement.finalized) {
      keyboard[0].push({ text: measurement.type });
      buttonsAdded++;
    }
  }

  return statSelectionMenu;
};