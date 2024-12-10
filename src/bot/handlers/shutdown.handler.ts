import TelegramBot from "node-telegram-bot-api";
import { Session } from "../session";

export default async (bot: TelegramBot) => {
  console.log('Shutting down gracefully...');

  try {
    await Session.saveSessionToFile();

    await bot.stopPolling();
    console.log('Bot stopped polling.');
    process.exit(0); // Exit the process
  } catch (error) {
    console.error('Error stopping bot:', error);
    process.exit(1); // Exit with error
  }
};