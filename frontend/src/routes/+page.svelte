<script lang="ts">
	import { Button, Spinner, Table } from 'sveltestrap';
	import type { GetTeamsResult } from '../models/team';
	import Center from '../components/Center.svelte';
	import { onMount } from 'svelte';
	import { getTeams } from '../api/team';

	let teams: GetTeamsResult;
	onMount(async () => {
		teams = await getTeams();
		teams.sort((a, b) => a.score - b.score);
	});
</script>

{#if teams}
	<h3>제출하기</h3>
	<div class="mb-3">
		{#each teams as team}
			<Button href={`/team/${team.id}`}>{team.name}</Button>
		{/each}
	</div>

	<h3>대시보드</h3>
	<Table bordered style="width: 400px;">
		<thead>
			<tr>
				<th>번호</th>
				<th>이름</th>
				<th>점수</th>
			</tr>
		</thead>
		<tbody>
			{#each teams as team}
				<tr>
					<th>{team.id}</th>
					<td>{team.name}</td>
					<td>{team.score}</td>
				</tr>
			{/each}
		</tbody>
	</Table>
{:else}
	<Center>
		<Spinner />
	</Center>
{/if}

<svelte:head>
	<title>Git 대회: 대시보드</title>
</svelte:head>
