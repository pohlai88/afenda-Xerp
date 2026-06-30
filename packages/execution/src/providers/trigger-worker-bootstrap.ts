import { runServiceActorS2sPingProbe } from "../jobs/service-actor-s2s-ping.probe.js";
import { configureServiceActorS2sPingTask } from "./trigger.provider.js";

/**
 * Trigger.dev worker bootstrap — registers ERP-independent task handlers
 * before static task definitions invoke them.
 */
configureServiceActorS2sPingTask(runServiceActorS2sPingProbe);
