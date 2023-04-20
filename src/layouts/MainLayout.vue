<template>
	<header>
		<router-link to="/">Home</router-link>
		<router-link to="/about">About</router-link>
		<router-link to="/info">Info</router-link>
	</header>
	<hr />
	<slot />
</template>

<style scss>
header {
	display: flex;
	align-items: center;
	padding: 1rem;
	gap: 1rem;
}
</style>
