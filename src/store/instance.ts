import { reactive } from "vue"

import type { Store } from "./store"

export const store = reactive<Store>({
	categories: [],
	expenses: [],
})
