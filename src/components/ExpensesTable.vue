<script lang="ts">
import dayjs from "dayjs"
import { sumBy } from "lodash"
import { computed, defineComponent, PropType, ref } from "vue"

import ExpenseForm from "@/components/ExpenseForm.vue"
import {
	all_categories,
	all_expenses,
	category_for_id,
	delete_expense as delete_expense_impl,
} from "@/services"
import { Expense } from "@/types"

export default defineComponent({
	components: { ExpenseForm },
	props: {
		expenses: { type: Array as PropType<Expense[]>, required: true },
		has_params: Boolean,
	},
	setup(props) {
		const total_amount = computed(() => sumBy(props.expenses, "amount"))

		const editing_expense = ref<Expense>()

		function edit_expense(exp: Expense) {
			editing_expense.value = exp
		}

		function saved() {
			editing_expense.value = undefined
		}

		function canceled() {
			editing_expense.value = undefined
		}

		function delete_expense(exp: Expense) {
			if (confirm(`Удалить расход?`)) {
				delete_expense_impl(exp.id)
			}
		}

		return {
			total_amount,
			all_expenses,
			all_categories,
			category_for_id,
			dayjs,
			edit_expense,
			editing_expense,
			saved,
			canceled,
			delete_expense,
		}
	},
})
</script>

<template>
	<table v-if="expenses.length">
		<thead>
			<th>Время добавления</th>
			<th>Дата</th>
			<th>Сумма</th>
			<th>Категория</th>
			<th>Описание</th>
			<th />
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
			<td>
				<button type="button" @click="edit_expense(exp)">Изменить</button>
				<button type="button" @click="delete_expense(exp)">Удалить</button>
			</td>
		</tr>
		<tr v-if="expenses.length > 1" class="total">
			<td colspan="2" class="total-label">Итого</td>
			<td class="amount">{{ total_amount.toFixed(2) }}</td>
			<td colspan="3" />
		</tr>
	</table>
	<div v-else class="notification">
		<template v-if="has_params"
			>Ничего не найдено. Попробуйте сбросить фильтр.</template
		>
		<template v-else
			>Добро пожаловать в систему учета расходов! Добавьте ваш первый расход,
			используя форму ниже.</template
		>
	</div>
	<div class="form-wrapper">
		<expense-form :expense="editing_expense" @save="saved" @cancel="canceled" />
	</div>
</template>

<style lang="scss" scoped>
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
