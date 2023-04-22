<script lang="ts">
import { groupBy, orderBy, sumBy } from "lodash"
import { computed, defineComponent, PropType } from "vue"
import { Bar } from "vue-chartjs"

import { category_for_id } from "@/services"
import { Expense } from "@/types"

export default defineComponent({
	components: { Bar },
	props: {
		expenses: { type: Array as PropType<Expense[]>, required: true },
	},
	setup(props) {
		const categories = computed(() => {
			return orderBy(
				Object.entries(groupBy(props.expenses, "category_id")).map(
					([category_id, expenses]) => {
						const category = category_for_id.value[category_id]
						const total_amount = sumBy(expenses, "amount")
						return { category, total_amount }
					}
				),
				"total_amount",
				"desc"
			)
		})

		const chart_data = computed(() => ({
			labels: categories.value.map((cat) =>
				cat.category ? cat.category.name : "(без категории)"
			),
			datasets: [
				{
					label: "Категория",
					data: categories.value.map((cat) => cat.total_amount),
					backgroundColor: "#f87979",
				},
			],
		}))

		return {
			categories,
			chart_data,
		}
	},
})
</script>

<template>
	<div v-if="categories.length">
		<table class="x-table">
			<thead>
				<tr>
					<th>Категория</th>
					<th>Общая сумма</th>
				</tr>
			</thead>
			<tbody>
				<tr v-for="cat in categories" :key="cat.category?.id || 'others'">
					<td :class="{ _empty: !cat.category }">
						{{ cat.category ? cat.category.name : "(без категории)" }}
					</td>
					<td class="amount">{{ cat.total_amount.toFixed(2) }}</td>
				</tr>
			</tbody>
		</table>
		<Bar :data="chart_data" />
	</div>
	<div v-else>Нет данных. Попробуйте сбросить фильтр.</div>
</template>

<style lang="scss" scoped>
td.amount {
	text-align: right;
}

td._empty {
	font-style: italic;
}
</style>
