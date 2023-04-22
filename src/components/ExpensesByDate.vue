<script lang="ts">
import dayjs from "dayjs"
import { groupBy, orderBy, sumBy } from "lodash"
import { computed, defineComponent, PropType } from "vue"
import { Bar } from "vue-chartjs"

import { Expense } from "@/types"

function get_grouper(expense: Expense) {
	return dayjs(expense.date).day(1).format("YYYY-MM")
}

export default defineComponent({
	components: { Bar },
	props: {
		expenses: { type: Array as PropType<Expense[]>, required: true },
	},
	setup(props) {
		const groups = computed(() => {
			return orderBy(
				Object.entries(groupBy(props.expenses, get_grouper)).map(
					([grouper, expenses]) => {
						const total_amount = sumBy(expenses, "amount")
						return { grouper, total_amount }
					}
				),
				"grouper"
			)
		})

		const chart_data = computed(() => ({
			labels: groups.value.map((g) => g.grouper),
			datasets: [
				{
					label: "Категория",
					data: groups.value.map((g) => g.total_amount),
					backgroundColor: "#f87979",
				},
			],
		}))

		return {
			groups,
			chart_data,
		}
	},
})
</script>

<template>
	<div v-if="groups.length">
		<Bar :data="chart_data" />
	</div>
	<div v-else>Нет данных. Попробуйте сбросить фильтр.</div>
</template>
