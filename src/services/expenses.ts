import dayjs from "dayjs"
import { computed } from "vue"

import { generate_id, store } from "@/store"
import { Expense } from "@/types"

export function add_expense(data: Omit<Expense, "id" | "time">) {
	const id = generate_id()
	const time = dayjs().toISOString()
	store.expenses.push({ id, time, ...data })
}

export function delete_expense(id: string) {
	store.expenses = store.expenses.filter((exp) => exp.id !== id)
}

export function patch_expense(
	id: string,
	data: Partial<Omit<Expense, "id" | "time">>
) {
	const expense = store.expenses.find((exp) => exp.id === id)
	if (expense) {
		Object.assign(expense, data)
	}
}

/** все расходы */
export const all_expenses = computed(() => store.expenses)
