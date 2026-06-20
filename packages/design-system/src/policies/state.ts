import type { StateContract } from "../contracts/state.contract";
import { AFENDA_STATE_REGISTRY } from "../registries/state.registry";

export const statePolicy = AFENDA_STATE_REGISTRY satisfies StateContract;
