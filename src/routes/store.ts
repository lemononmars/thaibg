import { localStore } from './localStore'

export const theme = localStore('theme', 'business')
export const locale = localStore('locale', 'th')