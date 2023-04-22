<script lang="ts">
import dayjs from "dayjs"
import { defineComponent, reactive } from "vue"

import { iso_date_format } from "@/helpers/dayjs"
import { add_expense, all_categories } from "@/services"
import type { Expense } from "@/types"

export default defineComponent({
	setup() {
		const fields = reactive<
			Pick<Expense, "date" | "category_id" | "description">
		>({
			date: dayjs().format(iso_date_format),
			category_id: null,
			description: "",
		})

		function submit() {
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

			add_expense(fields)
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
			<select v-model="fields.category_id">
				<option :value="null">- Выберите категорию -</option>
				<option v-for="cat in all_categories" :key="cat.id" :value="cat.id">
					{{ cat.name }}
				</option>
			</select>
		</div>
		<div>Описание: <input v-model="fields.description" /></div>
		<button type="submit">Добавить</button>
	</form>
</template>
