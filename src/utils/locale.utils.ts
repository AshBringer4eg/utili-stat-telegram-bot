import moment from 'moment';
import { ACTIONS } from '../bot/menu/schema';
export function getLocaleButton(button: string | undefined): string {
  if (!button) {
    return 'Невідома';
  }
  switch (button) {
    case ACTIONS.HOT_WATER:
      return 'Гаряча вода';
    case ACTIONS.COLD_WATER:
      return 'Холодна вода';
    case ACTIONS.ELECTRICITY:
      return 'Електроенергія';
    case ACTIONS.HEAT_GJ:
      return 'Опалення (GJ)';
    case ACTIONS.HEAT_M3:
      return 'Опалення (m3)';
    case ACTIONS.HEAT_SD:
      return 'Опалення (Sd)';
    default:
      return 'Невідома';
  }
}

export function formatDate(date: Date): string {
  return moment(date).format("YY.MM.DD");
}