<script lang="ts">
	import { Form, FormGroup, Input, Label } from 'sveltestrap';

	export const data: Record<string, string | Blob | FileList> = {
		userName: '',
		password: ''
	};
</script>

<Form>
	<FormGroup>
		<Label>이름</Label>
		<Input name="userName" bind:value={data.userName} />
	</FormGroup>
</Form>
