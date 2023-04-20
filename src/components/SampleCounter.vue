<script lang="ts">
import { defineComponent, ref } from "vue"

export default defineComponent({
	props: {
		start: { type: Number, default: 0 },
	},
	setup(props) {
		const count = ref(props.start)
		function inc() {
			count.value++
		}
		return { count, inc }
	},
})
</script>

<template>
	<div>
		<div class="value">count={{ count }}</div>
		<button type="button" @click="inc">Click me</button>
	</div>
</template>

<style scoped>
.value {
	color: red;
}
</style>
