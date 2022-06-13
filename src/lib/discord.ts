import { WebhookClient } from 'discord.js' 

const webhook = new WebhookClient({
   id: String(import.meta.env.VITE_DISCORD_WEBHOOK_ID), 
   token: String(import.meta.env.VITE_DISCORD_WEBHOOK_TOKEN)
})

export function sendhook(message: string) {
	webhook.send(message)
}