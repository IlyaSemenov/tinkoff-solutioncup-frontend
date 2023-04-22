<script lang="ts">
import { defineComponent } from "vue"

import {
	add_category as add_category_impl,
	all_categories,
	delete_category as delete_category_impl,
	patch_category,
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

		function rename_category(cat: Category) {
			const name = prompt("Название категории?", cat.name)
			if (name) {
				patch_category(cat.id, { name })
			}
		}

		return { all_categories, add_category, delete_category, rename_category }
	},
})
</script>

<template>
	<div>
		<table v-if="all_categories.length" class="x-table">
			<thead>
				<tr>
					<th>Категория</th>
					<th />
				</tr>
			</thead>
			<tbody>
				<tr v-for="cat in all_categories" :key="cat.id">
					<td>
						<span class="name" @click="rename_category(cat)">{{
							cat.name
						}}</span>
					</td>
					<td>
						<button type="button" @click="delete_category(cat)">Удалить</button>
					</td>
				</tr>
			</tbody>
		</table>
		<div v-else>Вы пока не добавили ни одной категории.</div>
		<button type="button" @click="add_category">Добавить категорию</button>
	</div>
</template>

<style lang="scss" scoped>
.name {
	text-decoration: underline;
	text-decoration-style: dotted;
	cursor: pointer;
}
</style>
