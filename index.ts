import { TelegramClient } from "telegram";
import { StringSession } from "telegram/sessions";
import input from "input";
import { NewMessage, NewMessageEvent } from "telegram/events";

// from https://my.telegram.org/apps
const apiId = Number(process.env.API_ID)
const apiHash = process.env.API_HASH || ""

// fill this later with the value from session.save()
const stringSession = new StringSession(process.env.STRING_SESSION || "");

// ids(strings) of the user who is spamming ["83856998"]
const SPAMER_ID: string[] = [];

const messageToReply = "Клиент этого пользователя не поддерживает видео и аудио сообщения";

(async () => {
    console.log("Loading interactive example...");
    const client = new TelegramClient(stringSession, apiId, apiHash, {
        connectionRetries: 5,
    });
    await client.start({
        phoneNumber: async () => await input.text("Please enter your number: "),
        password: async () => await input.text("Please enter your password: "),
        phoneCode: async () =>
            await input.text("Please enter the code you received: "),
        onError: (err) => console.log(err),
    });
    console.log("You should now be connected.");
    console.log(client.session.save()); // Save this string to avoid logging in again

    async function eventPrint(event: NewMessageEvent) {
        const message = event.message;

        // Checks if it's a private message (from user or bot)
        if (event.isPrivate) {
            const sender = message.senderId?.toString();
            if(message.media && SPAMER_ID.includes(sender || "")){
                const isVideoAudioMessage = (message.media.toJSON() as any)?.className === "MessageMediaDocument"
                if(isVideoAudioMessage){
                    if(message.text === messageToReply){
                        message.reply({ message: messageToReply });
                    }
                    message.delete({ revoke: true });
                }
            }
        }
    }
    client.addEventHandler(eventPrint, new NewMessage({}));
})();
