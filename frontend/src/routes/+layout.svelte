<script>
	import { Container } from 'sveltestrap';
</script>

<Container class="min-vh-100 d-flex flex-column align-items-center justify-content-center">
	<div class="inner d-flex flex-column align-items-stretch justify-content-center">
		<slot />
	</div>
</Container>

<style lang="scss">
	.inner {
		height: 100%;
		min-width: 300px;
		text-align: center;
	}
</style>
