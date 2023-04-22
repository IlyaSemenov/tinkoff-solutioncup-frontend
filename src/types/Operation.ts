/**
 * Операция (расход)
 */
export interface Operation {
	/** ID (UUID) */
	id: string
	/** время создания (ISO) */
	time: string
	/** дата, когда случился расход (ISO) */
	date: string
	/** ID категории расходов */
	category_id: string | null
}
