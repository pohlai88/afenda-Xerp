export { kernelContext } from "./kernel-context.js";
export {
  assertKernelContextFrame,
  type assertKernelContextFrameWireSerializable,
  assertWireKernelContextFrame,
} from "./kernel-context-frame.assert.js";
export type {
  ExecutionContextWire,
  KernelContextFrame,
  KernelContextFrameWire,
} from "./kernel-context-frame.contract.js";
export {
  normalizeKernelContextFrameForWire,
  serializeKernelContextFrame,
} from "./kernel-context-frame.parser.js";
