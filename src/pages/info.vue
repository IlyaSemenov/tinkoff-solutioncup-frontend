<script lang="ts">
import { defineComponent } from "vue"

import { api } from "@/api"

interface Data {
	origin: string
}

export default defineComponent({
	async setup() {
		const { data } = await api.get<Data>("/anything")
		return { data }
	},
})
</script>

<template>
	<pre>{{ data }}</pre>
</template>
