<script lang="ts">
import { defineComponent } from "vue"

import SampleCounter from "@/components/SampleCounter.vue"

export default defineComponent({
	components: { SampleCounter },
})
</script>

<template>
	<h1>Welcome</h1>
	<sample-counter :start="5" />
</template>
