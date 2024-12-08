import { BUTTONS } from '../bot/menu/schema';
export function getLocaleButton(button: string | undefined): string {
  if (!button) {
    return 'Невідома';
  }
  switch (button) {
    case BUTTONS.HOT_WATER:
      return 'Гаряча вода';
    case BUTTONS.COLD_WATER:
      return 'Холодна вода';
    case BUTTONS.COLD_AND_HOT_WATER:
      return 'Гаряча та холодна вода';
    case BUTTONS.ELECTRICITY:
      return 'Електрика';
    case BUTTONS.HEAT_GJ:
      return 'Опалення (ГДж)';
    case BUTTONS.HEAT_M3:
      return 'Опалення (м3)';
    case BUTTONS.HEAT_SD:
      return 'Опалення (СД)';
    default:
      return 'Невідома';
  }
}

export function formatDate(date: Date): string {
  const year = date.getFullYear().toString().slice(-2);
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}.${month}.${day}`;
}