export type GetTeamResult = {
	id: number,
	name: string,
	score: number,
	users: { id: number, name: string, isLeader: boolean }[]
}

export type GetTeamsResult = {
	id: number;
	name: string;
	score: number;
	users: { id: number; name: string; isLeader: boolean }[];
}[];

export type GetTeamSolvedProblemsResult = {
	id: string,
	score: number,
}[]