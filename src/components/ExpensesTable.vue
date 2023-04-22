<script lang="ts">
import dayjs from "dayjs"
import { orderBy, sumBy } from "lodash"
import { ElementOf } from "ts-essentials"
import { computed, defineComponent, PropType, ref } from "vue"

import ExpenseForm from "@/components/ExpenseForm.vue"
import {
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

		const sort_columns = ["time", "date"] as const
		type SortColumn = ElementOf<typeof sort_columns>
		/** сортировка по колонке */
		const sort_column = ref<SortColumn>("time")

		const sorted_expenses = computed(() =>
			orderBy(props.expenses, sort_column.value)
		)

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
			sort_column,
			sorted_expenses,
			category_for_id,
			dayjs,
			total_amount,
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
	<table v-if="sorted_expenses.length">
		<thead>
			<th
				class="sort"
				:class="{ _active: sort_column === 'time' }"
				@click="sort_column = 'time'"
			>
				Время добавления
			</th>
			<th
				class="sort"
				:class="{ _active: sort_column === 'date' }"
				@click="sort_column = 'date'"
			>
				Дата
			</th>
			<th>Сумма</th>
			<th>Категория</th>
			<th>Описание</th>
			<th />
		</thead>
		<tr v-for="exp in sorted_expenses" :key="exp.id">
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
th.sort {
	text-decoration: underline;
	text-decoration-style: dotted;
	cursor: pointer;
	&._active:after {
		content: "▾";
	}
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
