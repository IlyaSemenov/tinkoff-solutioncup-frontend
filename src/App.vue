<script lang="ts">
import { defineComponent } from "vue"

import MainLayout from "@/layouts/MainLayout.vue"

export default defineComponent({
	components: { MainLayout },
})
</script>

<template>
	<main-layout>
		<router-view v-slot="{ Component }">
			<template v-if="Component">
				<Suspense>
					<component :is="Component" />
					<template #fallback>
						<div>Loading...</div>
					</template>
				</Suspense>
			</template>
		</router-view>
	</main-layout>
</template>

<style lang="scss">
@import "@/styles/index";
</style>
