/* eslint-disable max-lines-per-function */
import TelegramBot from 'node-telegram-bot-api';
import startHandler from './handlers/start.handler';
import shutdownHandler from './handlers/shutdown.handler';
import chalk from 'chalk';
import documentHandler from './handlers/document.handler';
import photoHandler from './handlers/photo.handler';
import contactHandler from './handlers/contact.handler';
import messageHandler from './handlers/message.handler';
import authMiddleware from './middleware/tg.simple.auth.middleware';

// Replace with your bot token from BotFather
const BOT_TOKEN = process.env.TG_KEY;


export function init() {
  if (!BOT_TOKEN) {
    throw new Error('BOT_TOKEN is required. Please set it in the code.');
  }

  const bot = new TelegramBot(BOT_TOKEN);

  bot.onText(/\/start/, (message) => {
    if (authMiddleware(message, bot)) startHandler(message, bot);
  });

  bot.on('document', (message) => {
    if (authMiddleware(message, bot)) documentHandler(message, bot);
  });

  bot.on('photo', async (message) => {
    if (authMiddleware(message, bot)) await photoHandler(message, bot);
  });

  bot.on('contact', (message) => {
    contactHandler(message, bot);
  });

  bot.on('message', (message) => {
    messageHandler(message, bot);
  });

  // Listen for termination signals
  process.on('SIGINT', async () => await shutdownHandler(bot)); // Ctrl+C
  process.on('SIGTERM', async () => await shutdownHandler(bot));


  console.log(chalk.green('Bot is running...'));

  return bot;
}


// Listen for file uploads
// bot.on('photo', async (msg) => {
//   const chatId = msg.chat.id;

//   if (!msg.photo) {
//     throw new Error("There is no acceptable photo in your message, please try another one.");
//   }

//   if (session[chatId]?.awaitingFile) {
//     const largestPhoto = msg.photo[msg.photo.length - 1];
//     const fileId = largestPhoto.file_id;
//     const file_unique_id = largestPhoto.file_unique_id;

//     try {
//       // Get the file download URL
//       const fileLink = await bot.getFileLink(fileId);

//       // Download the file
//       const filePath = path.join('./temp/', file_unique_id);
//       const response = await axios.get(fileLink, { responseType: 'stream' });
//       const writer = fs.createWriteStream(filePath);

//       /*
//         CONTINUE HERE
//       */


//       response.data.pipe(writer);

//       writer.on('finish', async () => {
//         // Upload the file to Google Drive
//         let auth = null;
//         try {
//           auth = await authenticateGoogle();
//         } catch (err: Error) {
//           bot.sendMessage(chatId, err.message);
//         }
//         if (!auth) {
//           // DELETE FILE AND NOTIFY USER
//           return;
//         }
//         const driveFileId = await uploadToGoogleDrive(auth, filePath, file_unique_id);

//         // Notify the user
//         bot.sendMessage(chatId, `File uploaded to Google Drive successfully! File ID: ${JSON.stringify(driveFileId)}`);

//         // Clean up local file
//         fs.unlinkSync(filePath);

//         // Reset session
//         if (session[chatId]) session[chatId].awaitingFile = false;
//       });

//       writer.on('error', (error) => {
//         console.error('Error downloading file:', error.message);
//         bot.sendMessage(chatId, 'Failed to download the file. Please try again.');
//       });
//     } catch (error) {
//       console.error('Error processing file:', error.message);
//       bot.sendMessage(chatId, 'An error occurred while processing your file.');
//     }
//   } else {
//     bot.sendMessage(chatId, 'Please press the "Upload a File" button first.');
//   }
// });