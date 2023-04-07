import qs from "qs";
import type { GetProblemSolvedUsersResult, GetProblemsResult, SubmitResult } from "../models/problem";
import { request } from "../request";

export async function getProblems() {
    return request('/problems').then(response => response.json()).then(json => json.data.problems as GetProblemsResult)
}

export async function getProblemSolvedUsers(problemId: string, teamId?: number) {
    return request(`/problems/${problemId}/solved-users?` + qs.stringify({ teamId }))
        .then(response => response.json())
        .then(json => json.data.users as GetProblemSolvedUsersResult);
}

export async function submitProblem(problemId: string, data: Record<string, string | Blob | FileList>): Promise<SubmitResult> {
    const formData = new FormData();

    for (const key in data) {
        const value = data[key];
        
        if(value instanceof FileList) {
            const file = value[0];
            formData.append(key, file);
        }
        else {
            formData.append(key, value);
        }
    }

    const response = await request(`/problems/${problemId}/submit`, {
        method: 'POST',
        body: formData
    }).then(async (response) => {
        const json = await response.json();
        if (response.ok) {
            return json.data as SubmitResult;
        }

        if ('statusCode' in json && 'message' in json && typeof json['message'] === 'string') {
            if (json.statusCode !== 500) {
                return { result: 'failed', reason: [json.message] } as const;
            }
        }

        return { result: 'error' } as const
    })

    return response;
}