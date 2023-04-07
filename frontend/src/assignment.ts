import Problem101 from "./components/problem-forms/Problem101.svelte";
import Problem102 from "./components/problem-forms/Problem102.svelte";
import Problem103 from "./components/problem-forms/Problem103.svelte";
import Problem104 from "./components/problem-forms/Problem104.svelte";
import Problem105 from "./components/problem-forms/Problem105.svelte";
import Problem201 from "./components/problem-forms/Problem201.svelte";
import Problem202 from "./components/problem-forms/Problem202.svelte";
import Problem203 from "./components/problem-forms/Problem203.svelte";
import Problem204 from "./components/problem-forms/Problem204.svelte";
import Problem205 from "./components/problem-forms/Problem205.svelte";
import Problem301 from "./components/problem-forms/Problem301.svelte";
import Problem302 from "./components/problem-forms/Problem302.svelte";
import Problem303 from "./components/problem-forms/Problem303.svelte";
import Problem304 from "./components/problem-forms/Problem304.svelte";
import type ProblemBase from "./components/problem-forms/ProblemBase.svelte";

export const assignments: Record<string, {
    name: string, problems: {
        id: string,
        formComponent: typeof ProblemBase,
    }[]
}> = {
    '1': {
        name: '첫 번째', problems: [{
            id: '1-1',
            formComponent: Problem101,
        }, {
            id: '1-2',
            formComponent: Problem102,
        }, {
            id: '1-3',
            formComponent: Problem103,
        }, {
            id: '1-4',
            formComponent: Problem104,
        }, {
            id: '1-5',
            formComponent: Problem105,
        }]
    },
    '2': {
        name: '두 번째', problems: [{
            id: '2-1',
            formComponent: Problem201,
        }, {
            id: '2-2',
            formComponent: Problem202,
        }, {
            id: '2-3',
            formComponent: Problem203,
        }, {
            id: '2-4',
            formComponent: Problem204,
        }, {
            id: '2-5',
            formComponent: Problem205,
        }]
    },
    '3': {
        name: '세 번째', problems: [{
            id: '3-1',
            formComponent: Problem301,
        },
        {
            id: '3-2',
            formComponent: Problem302,
        },
        {
            id: '3-3',
            formComponent: Problem303,
        },
        {
            id: '3-4',
            formComponent: Problem304,
        }]
    }
}
