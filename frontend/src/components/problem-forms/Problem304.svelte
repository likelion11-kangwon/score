<script lang="ts">
	import { Form, FormGroup, Input, Label } from 'sveltestrap';

	export const data: Record<string, string | Blob | FileList> = {};
</script>

<Form>
	<FormGroup>
		<Label>이름</Label>
		<Input name="userName" bind:value={data.userName} />
	</FormGroup>
	<FormGroup>
		<Label>이미지 파일</Label>
		{#if typeof data.imageFile !== 'string' && !(data.imageFile instanceof Blob)}
			<Input name="imageFile" type="file" bind:files={data.imageFile} />
		{/if}
	</FormGroup>
</Form>
