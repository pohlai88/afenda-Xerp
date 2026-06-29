/**
 * PAS-001 §8 — ERP metadata permission model vocabulary (kernel authority mirror).
 * ADR-0027: replaces retired @afenda/ui-composition metadata permission contracts.
 */

import {
  isPermissionAction,
  isPermissionModelScope,
  PERMISSION_ACTIONS,
  PERMISSION_MODEL_SCOPES,
  type PermissionAction,
  type PermissionModelScope,
} from "@afenda/kernel";

export type MetadataRuntimePermissionAction = PermissionAction;
export type MetadataRuntimePermissionModelScope = PermissionModelScope;

export const METADATA_RUNTIME_PERMISSION_ACTIONS = PERMISSION_ACTIONS;
export const METADATA_RUNTIME_PERMISSION_MODEL_SCOPES = PERMISSION_MODEL_SCOPES;

export function isMetadataRuntimePermissionAction(
  value: string
): value is MetadataRuntimePermissionAction {
  return isPermissionAction(value);
}

export function isMetadataRuntimePermissionModelScope(
  value: string
): value is MetadataRuntimePermissionModelScope {
  return isPermissionModelScope(value);
}
