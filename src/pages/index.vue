<script lang="ts">
import dayjs from "dayjs"
import { isEqual, sumBy } from "lodash"
import { computed, defineComponent, reactive, ref } from "vue"

import ExpenseForm from "@/components/ExpenseForm.vue"
import { all_categories, all_expenses, category_for_id } from "@/services"
import { Expense } from "@/types"

export default defineComponent({
	components: { ExpenseForm },
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

		const expenses = computed(() => {
			const expenses = all_expenses.value.filter((exp) => {
				return !params.category_id || params.category_id === exp.category_id
			})
			const total_amount = sumBy(expenses, "amount")
			return { expenses, total_amount }
		})

		const editing_expense = ref<Expense>()

		function saved() {
			editing_expense.value = undefined
		}

		function canceled() {
			editing_expense.value = undefined
		}

		return {
			dayjs,
			all_expenses,
			expenses,
			all_categories,
			category_for_id,
			params,
			reset_params,
			has_changed_params,
			editing_expense,
			saved,
			canceled,
		}
	},
})
</script>

<template>
	<h1>Мои расходы</h1>
	<div v-if="all_expenses.length" class="expenses-with-filter">
		<div>
			<table v-if="expenses.expenses.length">
				<thead>
					<th>Время добавления</th>
					<th>Дата</th>
					<th>Сумма</th>
					<th>Категория</th>
					<th>Описание</th>
					<th />
				</thead>
				<tr v-for="exp in expenses.expenses" :key="exp.id">
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
					<td>
						<button type="button" @click="editing_expense = exp">
							Изменить
						</button>
						<button type="button">Удалить</button>
					</td>
				</tr>
				<tr v-if="expenses.expenses.length > 1" class="total">
					<td colspan="2" class="total-label">Итого</td>
					<td class="amount">{{ expenses.total_amount.toFixed(2) }}</td>
					<td colspan="3" />
				</tr>
			</table>
			<div v-else>Ничего не найдено. Попробуйте сбросить фильтр.</div>
		</div>
		<form @submit.prevent>
			<h4>Фильтр</h4>
			<div>
				<div>Дата:</div>
				<div>с <input type="date" /></div>
				<div>по <input type="date" /></div>
			</div>
			<div>
				<div>Время добавления:</div>
				<div>- с <input type="datetime-local" /></div>
				<div>- по <input type="datetime-local" /></div>
			</div>
			<div>
				<div>Категория:</div>
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
	<div class="form-wrapper">
		<expense-form :expense="editing_expense" @save="saved" @cancel="canceled" />
	</div>
</template>

<style lang="scss" scoped>
.expenses-with-filter {
	display: flex;
	gap: 1rem;
}

td.amount {
	text-align: right;
}

td._empty {
	font-style: italic;
}

tr.total {
	font-weight: bold;
}

td.total-label {
	text-align: right;
}

.form-wrapper {
	margin-top: 1rem;
}
</style>
