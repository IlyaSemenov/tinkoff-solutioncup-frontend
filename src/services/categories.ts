import { fromPairs, orderBy } from "lodash"
import { computed } from "vue"

import { generate_id, store } from "@/store"
import { Category } from "@/types"

export function add_category(data: Omit<Category, "id">) {
	const id = generate_id()
	store.categories.push({ id, ...data })
}

export function delete_category(id: string) {
	store.categories = store.categories.filter((cat) => cat.id !== id)
	for (const exp of store.expenses) {
		if (exp.category_id === id) {
			exp.category_id = null
		}
	}
}

/** все категории, отсортированные  */
export const all_categories = computed(() => orderBy(store.categories, "name"))

/** id категории => категория */
export const category_for_id = computed(() =>
	fromPairs(store.categories.map((cat) => [cat.id, cat]))
)
