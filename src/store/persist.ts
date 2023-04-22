import { watch } from "vue"

import type { Store } from "./store"

// ключ для хранения в localStorage
// при смене формата пока что просто увеличить номер версии
const key = "tinkoff.finals.semenov.my-expenses.v1"

export function save_store(store: Store) {
	localStorage.setItem(key, JSON.stringify(store))
}

export function load_store(store: Store) {
	const data = localStorage.getItem(key)
	if (data) {
		try {
			const value = JSON.parse(data)
			// TODO: валидировать что вообще пришло, например через zod
			Object.assign(store, value)
			// по быстрому смигрировать "старые" данные
			for (const exp of store.expenses) {
				exp.amount ??= 0
			}
			// проверить целостность по ID
			const category_ids = new Set(store.categories.map((cat) => cat.id))
			for (const exp of store.expenses) {
				if (exp.category_id && !category_ids.has(exp.category_id)) {
					exp.category_id = null
				}
			}
		} catch {
			// ignore
		}
	}
}

export function watch_store_and_save(store: Store) {
	// FIXME: тут некорректно описан тип, на произвольный store срабатывать вотчер не будет, только на уже реактивный
	watch(store, (store) => {
		save_store(store)
	})
}
