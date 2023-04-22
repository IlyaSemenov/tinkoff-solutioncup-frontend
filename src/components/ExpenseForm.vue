<script lang="ts">
import dayjs from "dayjs"
import { pick } from "lodash"
import { defineComponent, PropType, reactive, watch } from "vue"

import { iso_date_format } from "@/helpers/dayjs"
import { add_expense, all_categories, patch_expense } from "@/services"
import type { Expense } from "@/types"

function get_empty_fields() {
	return {
		date: dayjs().format(iso_date_format),
		category_id: null,
		description: "",
		amount: null,
	}
}

export default defineComponent({
	props: {
		expense: Object as PropType<Expense>,
	},
	emits: ["save", "cancel"],
	setup(props, { emit }) {
		type Fields = Pick<Expense, "date" | "category_id" | "description"> & {
			amount: number | null
		}
		type ValidFields = Fields & {
			amount: number
		}

		/** редактируемые поля */
		const fields = reactive<Fields>(get_empty_fields())

		// при изменении параметров компонента сбросить поля
		watch(
			() => props.expense,
			(expense) => {
				if (expense) {
					Object.assign(
						fields,
						pick(expense, "date", "category_id", "description", "amount")
					)
				} else {
					Object.assign(fields, get_empty_fields())
				}
			}
		)

		function submit() {
			const { amount } = fields
			if (!(amount !== null && amount >= 0)) {
				return
			}

			const problems = []
			if (!fields.category_id) {
				problems.push("без указания категории")
			}
			if (!fields.description) {
				problems.push("без описания")
			}
			if (
				problems.length &&
				!confirm(`Добавить расход ${problems.join(", ")}?`)
			) {
				return
			}

			const valid_fields = fields as ValidFields

			if (props.expense) {
				patch_expense(props.expense.id, valid_fields)
			} else {
				add_expense(valid_fields)
				// сбросить описание, чтобы приготовиться к вводу следующего расхода
				fields.description = ""
			}
			emit("save")
		}

		function cancel() {
			emit("cancel")
		}

		return { fields, all_categories, submit, cancel }
	},
})
</script>

<template>
	<form @submit.prevent="submit">
		<h3>
			<template v-if="!expense">Добавить расход</template>
			<template v-else>Изменить расход</template>
		</h3>
		<div>
			<input v-model="fields.date" type="date" placeholder="Дата" required />
		</div>
		<div>
			<input
				v-model.number="fields.amount"
				type="number"
				step="0.01"
				min="0"
				placeholder="Сумма"
			/>
		</div>
		<div>
			<input v-model="fields.description" placeholder="Описание" />
		</div>
		<div>
			<select v-model="fields.category_id">
				<option :value="null">- Выберите категорию -</option>
				<option v-for="cat in all_categories" :key="cat.id" :value="cat.id">
					{{ cat.name }}
				</option>
			</select>
		</div>
		<div>
			<template v-if="!expense">
				<button type="submit">Добавить</button>
			</template>
			<template v-else>
				<button type="submit">Сохранить</button>
				<button type="button" @click="cancel">Отмена</button>
			</template>
		</div>
	</form>
</template>
