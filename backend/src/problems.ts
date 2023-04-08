import { Problems } from './problem/problem.service.js';

const REQUIRED_SOLVED_USER_COUNT = 3;

export const PROBLEMS = {
  '1-1': {
    isLeaderAssigned: true,
    score: 4,
    requiredSolvedUserCount: 1,
  },
  '1-2': {
    isNonLeaderAssigned: true,
    requiredSolvedUserCount: REQUIRED_SOLVED_USER_COUNT - 1,
    score: 6,
    previousId: '1-1',
  },
  '1-3': {
    requiredSolvedUserCount: REQUIRED_SOLVED_USER_COUNT,
    score: 4,
    previousId: '1-2',
  },
  '1-4': {
    isLeaderAssigned: true,
    score: 3,
    previousId: '1-3',
    requiredSolvedUserCount: 1,
  },
  '1-5': {
    requiredSolvedUserCount: REQUIRED_SOLVED_USER_COUNT,
    score: 3,
    previousId: '1-4',
  },
  '2-1': {
    isLeaderAssigned: true,
    score: 3,
    requiredSolvedUserCount: 1,
  },
  '2-2': {
    isNonLeaderAssigned: true,
    requiredSolvedUserCount: REQUIRED_SOLVED_USER_COUNT - 1,
    score: 3,
    previousId: '2-1',
  },
  '2-3': {
    requiredSolvedUserCount: REQUIRED_SOLVED_USER_COUNT,
    score: 6,
    previousId: '2-2',
  },
  '2-4': {
    isLeaderAssigned: true,
    score: 3,
    previousId: '2-3',
    requiredSolvedUserCount: 1,
  },
  '2-5': {
    requiredSolvedUserCount: REQUIRED_SOLVED_USER_COUNT,
    score: 15,
    previousId: '2-4',
  },
  '3-1': {
    isLeaderAssigned: true,
    score: 2,
    requiredSolvedUserCount: 1,
  },
  '3-2': {
    isNonLeaderAssigned: true,
    requiredSolvedUserCount: REQUIRED_SOLVED_USER_COUNT - 1,
    score: 3,
    previousId: '3-1',
  },
  '3-3': {
    requiredSolvedUserCount: REQUIRED_SOLVED_USER_COUNT,
    score: 15,
    previousId: '3-2',
  },
  '3-4': {
    requiredSolvedUserCount: REQUIRED_SOLVED_USER_COUNT,
    score: 10,
    previousId: '3-3',
  },
} as const;

const _: Problems = PROBLEMS;
