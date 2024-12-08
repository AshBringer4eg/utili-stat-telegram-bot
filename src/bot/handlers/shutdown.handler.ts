import TelegramBot from "node-telegram-bot-api";

export default async (bot: TelegramBot) => {
  console.log('Shutting down gracefully...');

  try {
    await bot.stopPolling();
    console.log('Bot stopped polling.');
    process.exit(0); // Exit the process
  } catch (error) {
    console.error('Error stopping bot:', error);
    process.exit(1); // Exit with error
  }
};