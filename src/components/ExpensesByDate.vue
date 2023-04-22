<script lang="ts">
import dayjs from "dayjs"
import { groupBy, max, min, sumBy } from "lodash"
import { computed, defineComponent, PropType } from "vue"
import { Bar } from "vue-chartjs"

import { Expense } from "@/types"

function get_grouper(expense: Expense) {
	return dayjs(expense.date).day(1).format("YYYY-MM")
}

function get_next_grouper(grouper: string) {
	const d = dayjs(`${grouper}-01`)
	const next = d.add(1, "M")
	return next.format("YYYY-MM")
}

export default defineComponent({
	components: { Bar },
	props: {
		expenses: { type: Array as PropType<Expense[]>, required: true },
	},
	setup(props) {
		interface Group {
			grouper: string
			total_amount: number
		}

		const chart_data = computed(() => {
			if (!props.expenses.length) {
				return undefined
			}
			const grouped_expenses = groupBy(props.expenses, get_grouper)
			const groupers = Object.keys(grouped_expenses)
			const min_grouper = min(groupers)!
			const max_grouper = max(groupers)!
			const groups1: Group[] = []
			for (
				let grouper = min_grouper;
				grouper <= max_grouper;
				grouper = get_next_grouper(grouper)
			) {
				const expenses = grouped_expenses[grouper]
				const total_amount = expenses ? sumBy(expenses, "amount") : 0
				groups1.push({ grouper, total_amount })
			}
			return {
				labels: groups1.map((g) => g.grouper),
				datasets: [
					{
						label: "Месяц",
						data: groups1.map((g) => g.total_amount),
						backgroundColor: "#f87979",
					},
				],
			}
		})

		return {
			chart_data,
		}
	},
})
</script>

<template>
	<div v-if="chart_data">
		<Bar :data="chart_data" />
	</div>
	<div v-else>Нет данных. Попробуйте сбросить фильтр.</div>
</template>
