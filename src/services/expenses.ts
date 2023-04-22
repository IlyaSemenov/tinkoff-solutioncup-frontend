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

/** все расходы */
export const all_expenses = computed(() => store.expenses)
