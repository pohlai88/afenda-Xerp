"use client";

/**
 * Normalized account-settings-05 (members) — ARCH-AUTH-001 wiring.
 * Source: @ss-blocks/account-settings-05 staged in packages/ui.
 */

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Separator,
} from "@afenda/ui";
import type { GovernedUiComponentName } from "@afenda/ui/governance";
import { BadgeCheckIcon, EllipsisVerticalIcon } from "lucide-react";
import type { ReactNode } from "react";

export interface AppShellAccountSettings05MemberRow {
  readonly avatarUrl?: string;
  readonly email: string;
  readonly id: string;
  readonly isAdmin?: boolean;
  readonly name: string;
  readonly role: string;
}

export interface AppShellAccountSettings05PendingInviteRow {
  readonly avatarUrl?: string;
  readonly email: string;
  readonly id: string;
  readonly name: string;
  readonly role: string;
}

export interface AppShellAccountSettings05RoleOption {
  readonly label: string;
  readonly value: string;
}

export interface AppShellAccountSettings05Props {
  readonly inviteSlot?: ReactNode;
  readonly members: readonly AppShellAccountSettings05MemberRow[];
  readonly onMemberRemove?: (memberId: string) => void;
  readonly onMemberRoleChange?: (memberId: string, role: string) => void;
  readonly onPendingRemove?: (inviteId: string) => void;
  readonly onPendingResend?: (inviteId: string) => void;
  readonly onPendingRoleChange?: (inviteId: string, role: string) => void;
  readonly pending?: boolean;
  readonly pendingInvites: readonly AppShellAccountSettings05PendingInviteRow[];
  readonly roleOptions: readonly AppShellAccountSettings05RoleOption[];
}

export function AppShellAccountSettings05({
  inviteSlot,
  members,
  onMemberRemove,
  onMemberRoleChange,
  onPendingRemove,
  onPendingResend,
  onPendingRoleChange,
  pending = false,
  pendingInvites,
  roleOptions,
}: AppShellAccountSettings05Props) {
  return (
    <div className="app-shell-studio-account-settings-05">
      <section
        aria-label="Members"
        className="app-shell-studio-account-settings-05__header"
      >
        <div>
          <h3 className="app-shell-studio-account-settings-05__title">
            Members
          </h3>
          <p className="app-shell-studio-account-settings-05__description">
            Manage your team members and their permissions.
          </p>
        </div>
        {inviteSlot}
      </section>

      <div className="app-shell-studio-account-settings-05__list">
        {members.map((member, index) => {
          const isAdmin = member.isAdmin === true || member.role === "admin";

          return (
            <div key={member.id}>
              <div className="app-shell-studio-account-settings-05__row">
                <div className="app-shell-studio-account-settings-05__identity">
                  <div className="app-shell-studio-account-settings-05__avatar-wrap">
                    <Avatar>
                      {member.avatarUrl ? (
                        <AvatarImage alt="" src={member.avatarUrl} />
                      ) : null}
                      <AvatarFallback>
                        {member.name.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    {isAdmin ? (
                      <BadgeCheckIcon
                        aria-hidden
                        className="app-shell-studio-account-settings-05__verified-icon"
                      />
                    ) : null}
                  </div>
                  <div>
                    <p className="app-shell-studio-account-settings-05__item-title">
                      {member.name}
                    </p>
                    <p className="app-shell-studio-account-settings-05__description">
                      {member.email}
                    </p>
                  </div>
                </div>
                <div className="app-shell-studio-account-settings-05__actions">
                  <Select
                    disabled={isAdmin || pending || !onMemberRoleChange}
                    onValueChange={(value) =>
                      onMemberRoleChange?.(member.id, value)
                    }
                    value={member.role}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {roleOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        aria-label={`Actions for ${member.name}`}
                        disabled={isAdmin || pending}
                        emphasis="ghost"
                        intent="secondary"
                        presentation="icon"
                        size="sm"
                        type="button"
                      >
                        <EllipsisVerticalIcon aria-hidden />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuGroup>
                        {onMemberRemove ? (
                          <DropdownMenuItem
                            onSelect={() => onMemberRemove(member.id)}
                          >
                            Remove
                          </DropdownMenuItem>
                        ) : null}
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
              {index < members.length - 1 ? <Separator /> : null}
            </div>
          );
        })}
      </div>

      {pendingInvites.length > 0 ? (
        <section
          aria-label="Pending invitations"
          className="app-shell-studio-account-settings-05__pending"
        >
          <h3 className="app-shell-studio-account-settings-05__title">
            Pending invitations
          </h3>
          <div className="app-shell-studio-account-settings-05__list">
            {pendingInvites.map((invite, index) => (
              <div key={invite.id}>
                <div className="app-shell-studio-account-settings-05__row">
                  <div className="app-shell-studio-account-settings-05__identity">
                    <Avatar>
                      {invite.avatarUrl ? (
                        <AvatarImage alt="" src={invite.avatarUrl} />
                      ) : null}
                      <AvatarFallback>
                        {invite.name.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="app-shell-studio-account-settings-05__item-title">
                        {invite.name}
                      </p>
                      <p className="app-shell-studio-account-settings-05__description">
                        {invite.email}
                      </p>
                    </div>
                  </div>
                  <div className="app-shell-studio-account-settings-05__actions">
                    <Select
                      disabled={pending || !onPendingRoleChange}
                      onValueChange={(value) =>
                        onPendingRoleChange?.(invite.id, value)
                      }
                      value={invite.role}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {roleOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          aria-label={`Actions for pending invite ${invite.email}`}
                          disabled={pending}
                          emphasis="ghost"
                          intent="secondary"
                          presentation="icon"
                          size="sm"
                          type="button"
                        >
                          <EllipsisVerticalIcon aria-hidden />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuGroup>
                          {onPendingResend ? (
                            <DropdownMenuItem
                              onSelect={() => onPendingResend(invite.id)}
                            >
                              Resend
                            </DropdownMenuItem>
                          ) : null}
                          {onPendingRemove ? (
                            <DropdownMenuItem
                              onSelect={() => onPendingRemove(invite.id)}
                            >
                              Revoke
                            </DropdownMenuItem>
                          ) : null}
                        </DropdownMenuGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                {index < pendingInvites.length - 1 ? <Separator /> : null}
              </div>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}

export type AppShellAccountSettings05GovernedComponents = Extract<
  GovernedUiComponentName,
  | "Avatar"
  | "AvatarFallback"
  | "AvatarImage"
  | "Button"
  | "DropdownMenu"
  | "DropdownMenuContent"
  | "DropdownMenuGroup"
  | "DropdownMenuItem"
  | "DropdownMenuTrigger"
  | "Select"
  | "SelectContent"
  | "SelectGroup"
  | "SelectItem"
  | "SelectTrigger"
  | "SelectValue"
  | "Separator"
>;
