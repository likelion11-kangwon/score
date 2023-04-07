<script lang="ts">
	import { Button, ListGroup, ListGroupItem, Progress, Spinner } from 'sveltestrap';
	import Center from '../../../components/Center.svelte';
	import type { GetTeamSolvedProblemsResult, GetTeamResult } from '../../../models/team.js';
	import { assignments } from '../../../assignment.js';
	import { onMount } from 'svelte';
	import { getTeam, getTeamSolvedProblems } from '../../../api/team.js';

	export let data;

	type Assignment = (typeof assignments)[keyof typeof assignments];

	function getPercentage(assignment: Assignment, solvedProblems: GetTeamSolvedProblemsResult) {
		return (
			(solvedProblems.filter((problem) =>
				assignment.problems.map((problem) => problem.id).includes(problem.id)
			).length /
				assignment.problems.length) *
			100
		);
	}

	function getScore(assignment: Assignment, solvedProblems: GetTeamSolvedProblemsResult) {
		return solvedProblems
			.filter((problem) => assignment.problems.map((problem) => problem.id).includes(problem.id))
			.reduce((prev, curr) => prev + curr.score, 0);
	}

	let team: GetTeamResult;
	let solvedProblems: GetTeamSolvedProblemsResult;

	onMount(async () => {
		team = await getTeam(Number(data.teamId));
		team.users.sort((a, b) => {
			if (a.isLeader) return -1;
			if (b.isLeader) return 1;
			return a.name.localeCompare(b.name);
		});

		solvedProblems = await getTeamSolvedProblems(Number(data.teamId));
	});
</script>

{#if team}
	<h3>팀원</h3>
	<div class="mb-3">
		<ListGroup>
			{#each team.users as user}
				{#if user.isLeader}
					<ListGroupItem color="primary">{user.name}</ListGroupItem>
				{:else}
					<ListGroupItem>{user.name}</ListGroupItem>
				{/if}
			{/each}
		</ListGroup>
	</div>
	<h3>과제</h3>
	<div class="assignments">
		{#each Object.entries(assignments) as [id, assignment]}
			<div class="assignment">
				<Button
					color={solvedProblems && getPercentage(assignment, solvedProblems) === 100
						? 'success'
						: 'secondary'}
					block
					href={`/team/${data.teamId}/assignment/${id}`}
					class="mb-2">{assignment.name}</Button
				>
				{#if solvedProblems}
					<Progress value={getPercentage(assignment, solvedProblems)}
						>{getScore(assignment, solvedProblems)}</Progress
					>
				{:else}
					<Progress value={0} />
				{/if}
			</div>
		{/each}
	</div>
{:else}
	<Center>
		<Spinner />
	</Center>
{/if}

<style lang="scss">
	.assignments {
		display: flex;
		flex-direction: row;
		column-gap: 4px;
	}

	.assignment {
		flex: 1;
	}
</style>
