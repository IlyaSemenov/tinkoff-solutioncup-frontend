<template>
	<header>
		<router-link to="/">Мои расходы</router-link>
		<router-link to="/settings/categories">Настройки</router-link>
	</header>
	<hr />
	<main>
		<slot />
	</main>
</template>

<style scss>
header {
	display: flex;
	align-items: center;
	padding: 1rem;
	gap: 1rem;
}

main {
	padding: 1rem;
}
</style>
