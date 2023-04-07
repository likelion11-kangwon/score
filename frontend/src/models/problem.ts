export type GetProblemsResult = {
    id: string,
    score: number,
    isLeaderAssigned: boolean,
    isNonLeaderAssigned: boolean,
    requiredSolvedUserCount: number,
    previousId: string,
}[];

export type GetProblemSolvedUsersResult = {
    id: number;
    name: string;
    teamId: number | null;
    isLeader: boolean
}[];

export type SubmitResult = {
    result: 'success' | 'error',
} | {
    result: 'failed',
    reason: readonly string[]
}