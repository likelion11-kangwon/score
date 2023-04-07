import type { GetTeamSolvedProblemsResult, GetTeamResult, GetTeamsResult } from "../models/team";
import { request } from "../request";

export async function getTeam(teamId: number): Promise<GetTeamResult> {
    const response = await request(`/teams/${teamId}`).then((response) => response.json());
    const team = response.data.team as GetTeamResult;
    return team;
}

export async function getTeams(): Promise<GetTeamsResult> {
    const response = await request(`/teams`).then((response) => response.json());
    const teams = response.data.teams as GetTeamsResult;
    return teams;
}

export async function getTeamSolvedProblems(teamId: number): Promise<GetTeamSolvedProblemsResult> {
    const response = await request(`/teams/${teamId}/solved-problems`).then((response) => response.json());
    return response.data.problems as GetTeamSolvedProblemsResult;
}