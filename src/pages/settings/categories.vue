<script lang="ts">
import { computed, defineComponent } from "vue"

import * as services from "@/services"
import { store } from "@/store"
import { Category } from "@/types"

export default defineComponent({
	setup() {
		const categories = computed(() => store.categories)
		function add_category() {
			const name = prompt("Название категории?")
			if (name) {
				services.add_category({ name })
			}
		}
		function delete_category(cat: Category) {
			if (confirm(`Удалить категорию ${cat.name}?`)) {
				services.delete_category(cat.id)
			}
		}
		return { categories, add_category, delete_category }
	},
})
</script>

<template>
	<div>
		<table>
			<thead>
				<th>Категория</th>
				<th>Удалить</th>
			</thead>
			<tr v-for="cat in categories" :key="cat.id">
				<td>{{ cat.name }}</td>
				<td>
					<button type="button" @click="delete_category(cat)">Удалить</button>
				</td>
			</tr>
		</table>
		<button type="button" @click="add_category">Добавить категорию</button>
	</div>
</template>
