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

export enum CB_CATEGORY {
  OVERVIEW = 'OVW',
}

export enum CB_ACTION {
  EDIT_VALUE = 'EV',
  EDIT_PHOTO = 'EP',
  REMOVE_MEASURMENT = "RM",
}