"use client";

import { PlusIcon, XIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ConnectedAccount {
  iconUrl: string;
  id: string;
  name: string;
}

const initialAccounts: ConnectedAccount[] = [
  {
    id: "google",
    name: "Google",
    iconUrl:
      "https://cdn.shadcnstudio.com/ss-assets/brand-logo/google-icon.png",
  },
  {
    id: "slack",
    name: "Slack",
    iconUrl: "https://cdn.shadcnstudio.com/ss-assets/brand-logo/slack-icon.png",
  },
];

const ConnectedAccount = () => {
  const [connectedAccounts, setConnectedAccounts] =
    useState<ConnectedAccount[]>(initialAccounts);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [appName, setAppName] = useState("");
  const [appUrl, setAppUrl] = useState("");
  const [appIconUrl, setAppIconUrl] = useState("");
  const [description, setDescription] = useState("");

  const handleRemoveAccount = (accountId: string) => {
    setConnectedAccounts((prev) =>
      prev.filter((account) => account.id !== accountId)
    );
  };

  const resetForm = () => {
    setAppName("");
    setAppUrl("");
    setAppIconUrl("");
    setDescription("");
  };

  const handleConnect = () => {
    if (!(appName.trim() && appUrl.trim())) return;

    const id = appName.toLowerCase().replace(/\s+/g, "-");

    setConnectedAccounts((prev) => [
      ...prev,
      {
        id,
        name: appName,
        iconUrl: appIconUrl.trim() || "",
      },
    ]);

    resetForm();
    setIsDialogOpen(false);
  };

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
      {/* Vertical Tabs List */}
      <div className="flex flex-col">
        <h3 className="font-semibold text-foreground">Connect Accounts</h3>
        <p className="text-muted-foreground text-sm">
          Manage your connected accounts.
        </p>
      </div>

      {/* Content */}
      <div className="space-y-4 lg:col-span-2">
        <div className="flex flex-wrap items-center gap-4">
          {connectedAccounts.map((account) => (
            <div
              className="flex w-fit items-center gap-3 rounded-md border p-2"
              key={account.id}
            >
              {account.iconUrl ? (
                <img
                  alt={account.name}
                  className="size-4 rounded"
                  src={account.iconUrl}
                />
              ) : (
                <div className="flex size-4 items-center justify-center rounded bg-muted-foreground/10 font-medium text-muted-foreground text-sm">
                  {account.name.charAt(0)}
                </div>
              )}

              <p className="font-medium text-sm">{account.name}</p>
              <Button
                aria-label={`Remove ${account.name}`}
                className="rounded-md bg-primary/10 text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2"
                onClick={() => handleRemoveAccount(account.id)}
                size="xs"
                variant="ghost"
              >
                <XIcon aria-hidden="true" className="size-3" />
              </Button>
            </div>
          ))}

          {/* Add App Button + Modal */}
          <Dialog onOpenChange={setIsDialogOpen} open={isDialogOpen}>
            <DialogTrigger asChild>
              <Button
                className="h-10.5"
                onClick={() => setIsDialogOpen(true)}
                variant="outline"
              >
                <PlusIcon className="size-4" />
                Add App
              </Button>
            </DialogTrigger>

            <DialogContent>
              <DialogHeader>
                <DialogTitle>Connect New App</DialogTitle>
                <DialogDescription>
                  Add a new integration by providing the details below.
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-3 py-2">
                <div className="grid gap-1">
                  <Label>App Name</Label>
                  <Input
                    onChange={(e) => setAppName(e.target.value)}
                    placeholder="e.g., Zoom"
                    value={appName}
                  />
                </div>

                <div className="grid gap-1">
                  <Label>App URL or Integration Key</Label>
                  <Input
                    onChange={(e) => setAppUrl(e.target.value)}
                    placeholder="https://app.example.com or key_abc123"
                    value={appUrl}
                  />
                </div>

                <div className="grid gap-1">
                  <Label>Optional Description</Label>
                  <Input
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Notes about this integration (optional)"
                    value={description}
                  />
                </div>
              </div>

              <DialogFooter>
                <Button
                  onClick={() => {
                    resetForm();
                    setIsDialogOpen(false);
                  }}
                  variant="outline"
                >
                  Cancel
                </Button>
                <Button
                  disabled={!(appName.trim() && appUrl.trim())}
                  onClick={handleConnect}
                >
                  Connect
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        <p className="text-muted-foreground text-sm">
          Connected accounts allow you to integrate with third-party services
          for enhanced functionality.
        </p>
      </div>
    </div>
  );
};

export default ConnectedAccount;
