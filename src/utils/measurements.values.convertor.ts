import { ACTIONS } from "../bot/menu/menu.type";

export const valueToReadableUnit = (measurement: ACTIONS) => {
  switch (measurement) {
    case ACTIONS.HOT_WATER:
    case ACTIONS.COLD_WATER:
    case ACTIONS.HEAT_M3:
      return 'm3';
    case ACTIONS.ELECTRICITY:
      return "кВт";
    case ACTIONS.HEAT_GJ:
      return "Gj";
    case ACTIONS.HEAT_SD:
      return 'Sd';
    default:
      return '###';
  }
};

export const valueToReadableString = (value: number | string, type: ACTIONS) => {
  return `${value} ${valueToReadableUnit(type)}`;
};