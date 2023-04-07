type User = {
    id: number,
    name: string,
    githubUsername: string,
    teamId: number | null,
    isLeader: boolean,
    destroyedAt: Date | null
}

type Team = {
    id: number,
    name: string,
    destroyedAt: Date | null,
    users: User[]
}

type Req = {
    user: User;
    team: Team | null;
}

type Input = Record<string, string> & {
    request: Req;
}