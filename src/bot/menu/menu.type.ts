/* eslint-disable no-unused-vars */
export enum ACTIONS {
  SHARE_CONTACTS = '📞 Share Contacts',

  START_MEASUREMENT_SESSION = '📏 Open Measurement Session',

  LOGOUT="🚪 Logout",
  BACK_TO_MAIN_MENU = '🏠 Back to main menu',
  CLOSE_MEASUREMENT_SESSION = '✅ Close Measurement session',
  FAST_MEASUREMENT_SESSION_CLOSE = '✅ End current Measurement session',
  CONFIRM_CLOSE_MEASUREMENT_SESSION = '👍 I\'m sure I want to close Measurement session',
  SESSION_OVERVIEW = '📊 Session overview',
  CANCEL_MEASUREMENT_ELEMENT_EDIT="🚫 Cancel editing",
  CANCEL_MEASUREMENT_ELEMENT_ADD="🚫 Cancel adding",
  CONFIRM_DELETE_MEASUREMENT="👍 I'm sure I want to delete measurement",

  HOT_WATER = '🔥 Hot Water',
  COLD_WATER = '❄️ Cold Water',
  ELECTRICITY = '⚡ Electricity',
  HEAT_GJ = '🌡️ Heat (GJ)',
  HEAT_M3 = '🌡️ Heat (m3)',
  HEAT_SD = '🌡️Heat (Sd)',
}

export enum INLINE_ACTIONS {
  EDIT_VALUE = '✏️ Edit Value',
  EDIT_PHOTO = '🖼️ Edit Photo',
  REMOVE_MEASURMENT = "🗑️ Remove",
}

/**
 * Callback categories
 * OVW - Overview
 *
 * @export
 * @enum {number}
 */
export enum CB_CATEGORY {
  OVERVIEW = 'OVW',
}

/**
 * Callback actions
 * EV - Edit Value
 * EP - Edit Photo
 * RM - Remove Measurement
 *
 * @export
 * @enum {number}
 */
export enum CB_ACTION {
  EDIT_VALUE = 'EV',
  EDIT_PHOTO = 'EP',
  REMOVE_MEASURMENT = "RM",
}