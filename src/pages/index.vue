<script lang="ts">
import dayjs from "dayjs"
import { isEqual } from "lodash"
import { computed, defineComponent, reactive } from "vue"

import NewExpenseForm from "@/components/NewExpenseForm.vue"
import { all_categories, all_expenses, category_for_id } from "@/services"

export default defineComponent({
	components: { NewExpenseForm },
	setup() {
		const params = reactive<{
			date_from: string
			date_to: string
			time_from: string
			time_to: string
			category_id: string | null
		}>({
			date_from: "",
			date_to: "",
			time_from: "",
			time_to: "",
			category_id: null,
		})

		const initial_params = { ...params }

		function reset_params() {
			Object.assign(params, initial_params)
		}

		const has_changed_params = computed(() => !isEqual(params, initial_params))

		const expenses = computed(() =>
			all_expenses.value.filter((exp) => {
				return !params.category_id || params.category_id === exp.category_id
			})
		)

		return {
			dayjs,
			expenses,
			all_categories,
			category_for_id,
			params,
			reset_params,
			has_changed_params,
		}
	},
})
</script>

<template>
	<h1>Мои расходы</h1>
	<div v-if="expenses.length" class="expenses-with-filter">
		<table>
			<thead>
				<th>Время добавления</th>
				<th>Дата</th>
				<th>Сумма</th>
				<th>Категория</th>
				<th>Описание</th>
			</thead>
			<tr v-for="exp in expenses" :key="exp.id">
				<td>{{ dayjs(exp.time).format("DD.MM.YYYY HH:mm") }}</td>
				<td>{{ dayjs(exp.date).format("DD.MM.YYYY") }}</td>
				<td class="amount">{{ exp.amount.toFixed(2) }}</td>
				<td :class="{ _empty: !exp.category_id }">
					{{
						exp.category_id
							? category_for_id[exp.category_id].name
							: "(без категории)"
					}}
				</td>
				<td :class="{ _empty: !exp.description }">
					{{ exp.description || "(без описания)" }}
				</td>
			</tr>
		</table>
		<form @submit.prevent>
			<h4>Фильтр</h4>
			<div>Дата: с <input type="date" /> по <input type="date" /></div>
			<div>
				Время добавления: с <input type="datetime-local" /> по
				<input type="datetime-local" />
			</div>
			<div>
				Категория:
				<select v-model="params.category_id">
					<option :value="null">- Выберите категорию -</option>
					<option v-for="cat in all_categories" :key="cat.id" :value="cat.id">
						{{ cat.name }}
					</option>
				</select>
			</div>
			<div>
				<button
					type="button"
					:disabled="!has_changed_params"
					@click="reset_params"
				>
					Сбросить фильтр
				</button>
			</div>
		</form>
	</div>
	<div v-else class="notification">Вы пока не добавили ни один расход.</div>
	<new-expense-form />
</template>

<style lang="scss" scoped>
.expenses-with-filter {
	display: flex;
}

td.amount {
	text-align: right;
}

td._empty {
	font-style: italic;
}
</style>
