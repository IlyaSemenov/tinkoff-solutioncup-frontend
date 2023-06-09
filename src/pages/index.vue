<script lang="ts">
import dayjs from "dayjs"
import { isEqual } from "lodash"
import { ElementOf } from "ts-essentials"
import { computed, defineComponent, reactive, ref } from "vue"

import ExpensesByCategory from "@/components/ExpensesByCategory.vue"
import ExpensesByDate from "@/components/ExpensesByDate.vue"
import ExpensesTable from "@/components/ExpensesTable.vue"
import { all_categories, all_expenses, category_for_id } from "@/services"

export default defineComponent({
	components: { ExpensesTable, ExpensesByCategory, ExpensesByDate },
	setup() {
		const view_types = ["table", "by_category", "by_date"] as const
		type ViewType = ElementOf<typeof view_types>
		/** текущее отображение */
		const view_type = ref<ViewType>("table")

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

		const has_params = computed(() => !isEqual(params, initial_params))

		const expenses = computed(() =>
			all_expenses.value.filter((exp) => {
				return (
					(!params.date_from || exp.date >= params.date_from) &&
					(!params.date_to || exp.date <= params.date_to) &&
					(!params.category_id || params.category_id === exp.category_id)
				)
			})
		)

		return {
			view_type,
			view_types,
			// расходы
			all_expenses,
			expenses,
			all_categories,
			category_for_id,
			dayjs,
			// фильтр
			params,
			reset_params,
			has_params,
		}
	},
})
</script>

<template>
	<h1>Мои расходы</h1>
	<div class="content-with-filter">
		<div class="content">
			<div class="tabs">
				<label
					><input v-model="view_type" type="radio" value="table" />
					Список</label
				>
				<label
					><input v-model="view_type" type="radio" value="by_category" /> По
					категориям</label
				>
				<label
					><input v-model="view_type" type="radio" value="by_date" /> По
					месяцам</label
				>
			</div>
			<expenses-table
				v-if="view_type === 'table'"
				:expenses="expenses"
				:has_params="has_params"
			/>
			<expenses-by-category
				v-else-if="view_type === 'by_category'"
				:expenses="expenses"
			/>
			<expenses-by-date
				v-else-if="view_type === 'by_date'"
				:expenses="expenses"
			/>
		</div>
		<form v-if="all_categories.length" @submit.prevent>
			<h4>Фильтр</h4>
			<div>
				<div>Дата:</div>
				<div>с <input v-model="params.date_from" type="date" /></div>
				<div>по <input v-model="params.date_to" type="date" /></div>
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
				<button type="button" :disabled="!has_params" @click="reset_params">
					Сбросить фильтр
				</button>
			</div>
		</form>
	</div>
</template>

<style lang="scss" scoped>
.content-with-filter {
	display: flex;
	gap: 1rem;
}

.content {
	flex-grow: 1;
}

.tabs {
	display: flex;
	gap: 1rem;
}
</style>
