import { Category, Expense } from "@/types"

export interface Store {
	categories: Category[]
	expenses: Expense[]
}
