import { Category, Operation } from "@/types"

export interface Store {
	operations: Operation[]
	categories: Category[]
}
