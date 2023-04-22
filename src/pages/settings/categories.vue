<script lang="ts">
import { defineComponent } from "vue"

import {
	add_category as add_category_impl,
	all_categories,
	delete_category as delete_category_impl,
} from "@/services"
import { Category } from "@/types"

export default defineComponent({
	setup() {
		function add_category() {
			const name = prompt("Название категории?")
			if (name) {
				add_category_impl({ name })
			}
		}

		function delete_category(cat: Category) {
			if (confirm(`Удалить категорию ${cat.name}?`)) {
				delete_category_impl(cat.id)
			}
		}

		return { all_categories, add_category, delete_category }
	},
})
</script>

<template>
	<div>
		<table>
			<thead>
				<th>Категория</th>
				<th />
			</thead>
			<tr v-for="cat in all_categories" :key="cat.id">
				<td>{{ cat.name }}</td>
				<td>
					<button type="button" @click="delete_category(cat)">Удалить</button>
				</td>
			</tr>
		</table>
		<button type="button" @click="add_category">Добавить категорию</button>
	</div>
</template>
