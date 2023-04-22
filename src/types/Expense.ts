/**
 * Расход
 */
export interface Expense {
	/** ID (UUID) */
	id: string
	/** время создания (ISO) */
	time: string
	/** дата, когда случился расход (ISO) */
	date: string
	/** сумма расхода */
	amount: number
	/** ID категории расходов */
	category_id: string | null
	/** описание */
	description: string
}
