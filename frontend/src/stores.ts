import { writable, type Writable } from "svelte/store";
import type { GetTeamsResult } from "./models/team";

export const teams: Writable<[GetTeamsResult[], number]> = writable([[], 0]);