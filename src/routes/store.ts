import { localStore } from './localStore'

export const theme = localStore('theme', 'dark')
export const locale = localStore('locale', 'th')