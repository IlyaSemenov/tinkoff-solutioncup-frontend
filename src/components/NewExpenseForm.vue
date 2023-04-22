<script lang="ts">
import dayjs from "dayjs"
import { defineComponent, reactive } from "vue"

import { iso_date_format } from "@/helpers/dayjs"
import { add_expense, all_categories } from "@/services"
import type { Expense } from "@/types"

export default defineComponent({
	setup() {
		const fields = reactive<
			Pick<Expense, "date" | "category_id" | "description"> & {
				amount: number | null
			}
		>({
			date: dayjs().format(iso_date_format),
			category_id: null,
			description: "",
			amount: null,
		})

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

			add_expense({ ...fields, amount })
			fields.description = ""
		}
		return { fields, all_categories, submit }
	},
})
</script>

<template>
	<form @submit.prevent="submit">
		<div>
			<input v-model="fields.date" type="date" placeholder="Дата" required />
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
			<select v-model="fields.category_id">
				<option :value="null">- Выберите категорию -</option>
				<option v-for="cat in all_categories" :key="cat.id" :value="cat.id">
					{{ cat.name }}
				</option>
			</select>
		</div>
		<button type="submit">Добавить</button>
	</form>
</template>
