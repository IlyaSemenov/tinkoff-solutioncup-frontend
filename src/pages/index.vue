<script lang="ts">
import dayjs from "dayjs"
import { defineComponent } from "vue"

import NewExpenseForm from "@/components/NewExpenseForm.vue"
import { all_expenses, category_for_id } from "@/services"

export default defineComponent({
	components: { NewExpenseForm },
	setup() {
		return { dayjs, expenses: all_expenses, category_for_id }
	},
})
</script>

<template>
	<h1>Мои расходы</h1>
	<table v-if="expenses.length">
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
	<div v-else class="notification">Вы пока не добавили ни один расход.</div>
	<new-expense-form />
</template>

<style lang="scss" scoped>
td.amount {
	text-align: right;
}

td._empty {
	font-style: italic;
}
</style>
