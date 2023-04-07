<script lang="ts">
	import { Badge, Button, Modal, Spinner } from 'sveltestrap';
	import { P, match } from 'ts-pattern';
	import type {
		GetProblemSolvedUsersResult,
		GetProblemsResult,
		SubmitResult
	} from '../../../../../models/problem';
	import { assignments } from '../../../../../assignment';
	import { getProblemSolvedUsers, getProblems, submitProblem } from '../../../../../api/problem';
	import { assign, onMount } from 'svelte/internal';
	import Problem101 from '../../../../../components/problem-forms/Problem101.svelte';
	import { getTeamSolvedProblems } from '../../../../../api/team';
	import Center from '../../../../../components/Center.svelte';
	import type { GetTeamSolvedProblemsResult } from '../../../../../models/team';
	import { invalidate } from '$app/navigation';

	export let data;

	type FormComponent = (typeof assignments)[number]['problems'][number]['formComponent'];
	type Problem = GetProblemsResult[number] & {
		formComponent: FormComponent;
	};

	let currentProblem: Problem | undefined = undefined;

	function showProblemModal(id: string, formComponent: FormComponent) {
		if (problems) {
			currentProblem = { ...problems[id], formComponent };
		}
	}

	function hideProblemModal() {
		currentProblem = undefined;
	}

	function iToS(i: number) {
		return ['영', '첫', '두', '세'][i];
	}

	let formData: Record<string, string | Blob | FileList> = {};

	let loading = false;
	let result: SubmitResult | undefined;

	function closeResultModal() {
		result = undefined;
	}

	async function submit(problem: Problem) {
		loading = true;
		result = await submitProblem(problem.id, formData);
		await load();
		currentProblem = undefined;
		formData = {};
		loading = false;
	}

	let teamSolvedProblems: GetTeamSolvedProblemsResult | undefined = undefined;
	let problemSolvedUsers: Record<string, GetProblemSolvedUsersResult> = {};

	async function updateProblemSolvedUsers(id: string) {
		try {
			problemSolvedUsers[id] = await getProblemSolvedUsers(id, Number(data.teamId));
		} catch (e) {}
	}

	let problems: Record<string, GetProblemsResult[number]> | undefined = undefined;

	async function load() {
		problems = Object.fromEntries(
			await getProblems().then((problems) => problems.map((problem) => [problem.id, problem]))
		);
		teamSolvedProblems = await getTeamSolvedProblems(Number(data.teamId));

		for (const { id } of assignments[data.assignmentId].problems) {
			updateProblemSolvedUsers(id);
		}
	}

	function canSolve(
		problems: Record<string, GetProblemsResult[number]> | undefined,
		teamSolvedProblems: GetTeamSolvedProblemsResult | undefined,
		id: string
	) {
		return (
			problems === undefined ||
			problems[id].previousId === null ||
			(teamSolvedProblems !== undefined &&
				teamSolvedProblems.map((p) => p.id).includes(problems[id].previousId))
		);
	}

	function isSolved(teamSolvedProblems: GetTeamSolvedProblemsResult | undefined, id: string) {
		return teamSolvedProblems !== undefined && teamSolvedProblems.map((p) => p.id).includes(id);
	}

	function getTitle(id: string) {
		return `도전 #${id.split('-').slice(1).join('-')}`;
	}

	onMount(async () => {
		await load();
	});
</script>

{#if teamSolvedProblems !== undefined && problems !== undefined}
	<h3>{iToS(Number(data.assignmentId))} 번째 과제</h3>

	<div class="problems">
		{#each assignments[data.assignmentId].problems as { id, formComponent }}
			<div class="problem">
				<Button
					disabled={!canSolve(problems, teamSolvedProblems, id)}
					color={isSolved(teamSolvedProblems, id) ? 'success' : 'danger'}
					on:click={() => showProblemModal(id, formComponent)}
				>
					{getTitle(id)}
				</Button>
				<div class="badges">
					{#if problems[id].isLeaderAssigned}
						<Badge color="primary">리더만</Badge>
					{:else if problems[id].isNonLeaderAssigned}
						<Badge color="dark">리더빼고</Badge>
					{:else}
						<Badge color="success">모두다</Badge>
					{/if}
					{#if problemSolvedUsers[id] !== undefined}
						<Badge color="secondary">
							{problemSolvedUsers[id].length}/{problems[id].requiredSolvedUserCount}명
						</Badge>
					{/if}
					<Badge color="success">{problems[id].score}점</Badge>
				</div>
			</div>
		{/each}
		<Modal
			body
			header={currentProblem && getTitle(currentProblem.id)}
			isOpen={currentProblem !== undefined}
			toggle={hideProblemModal}
		>
			{#if currentProblem !== undefined}
				<svelte:component this={currentProblem.formComponent} bind:data={formData} />
				{#if loading}
					<Spinner />
				{:else}
					<Button color="primary" on:click={() => currentProblem && submit(currentProblem)}
						>제출</Button
					>{/if}
			{/if}
		</Modal>

		<Modal
			body
			header={match(result?.result)
				.with('success', () => '성공')
				.with('failed', () => '실패')
				.with('error', () => '오류 발생')
				.with(undefined, () => '')
				.exhaustive()}
			isOpen={result !== undefined}
			toggle={closeResultModal}
		>
			{#if result !== undefined}
				{match(result)
					.with({ result: 'success' }, () => '도전을 해결했습니다.')
					.with(
						{ result: 'error' },
						() => '알 수 없는 오류가 발생했습니다. 운영진에게 문의해주세요.'
					)
					.with({ result: 'failed' }, () => '다음 이유로 인해 실패했습니다. 다시 시도해보세요.')
					.exhaustive()}
				{#if result.result === 'failed'}
					<ul>
						{#each result.reason as reason}
							<li>{reason}</li>
						{/each}
					</ul>
				{/if}
			{/if}
		</Modal>
	</div>
{:else}
	<Center><Spinner /></Center>
{/if}

<style lang="scss">
	.problems {
		display: flex;
		flex-direction: column;
		row-gap: 8px;
	}

	.problem {
		display: flex;
		flex-direction: column;
	}
</style>
