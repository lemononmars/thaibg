import { WebhookClient } from 'discord.js' 

const webhook = new WebhookClient({
   id: import.meta.env.VITE_DISCORD_WEBHOOK_ID, 
   token: import.meta.env.VITE_DISCORD_WEBHOOK_TOKEN
})

export function sendhook(message: string) {
	webhook.send(message)
}