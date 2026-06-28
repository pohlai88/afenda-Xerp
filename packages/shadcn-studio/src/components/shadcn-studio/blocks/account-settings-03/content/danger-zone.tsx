import { Trash2Icon } from "lucide-react";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

const DangerZone = () => {
  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
      {/* Vertical Tabs List */}
      <div className="flex flex-col space-y-1">
        <h3 className="font-semibold">Danger zone</h3>
        <p className="text-muted-foreground text-sm">
          Manage general workspace. Contact system admin for more information{" "}
          <Link
            className="font-medium text-card-foreground hover:underline"
            href="#"
          >
            Learn more
          </Link>
        </p>
      </div>

      {/* Content */}
      <div className="space-y-6 lg:col-span-2">
        <Card>
          <CardContent>
            <div className="flex justify-between gap-4 max-lg:flex-col lg:items-center">
              <div className="space-y-1">
                <h3 className="font-medium text-sm">Leave workspace</h3>
                <p className="text-muted-foreground text-sm">
                  Revoke your access to this team. Other people you have added
                  to the workspace will remain.
                </p>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    className="border-destructive! text-destructive! hover:bg-destructive/10! focus-visible:ring-destructive/20 max-lg:w-full dark:focus-visible:ring-destructive/40"
                    variant="outline"
                  >
                    <Trash2Icon />
                    Leave
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader className="space-y-2">
                    <DialogTitle>Leave workspace</DialogTitle>
                    <div className="text-muted-foreground text-sm">
                      Revoke your access to this team. Other people you have
                      added to the workspace will remain.
                    </div>
                  </DialogHeader>
                  <DialogFooter className="mt-4 gap-4 sm:justify-end">
                    <DialogClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <DialogClose asChild>
                      <Button variant="destructive">Leave</Button>
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>
        <Card className="cursor-not-allowed opacity-60">
          <CardContent>
            <div className="flex justify-between gap-4 max-lg:flex-col lg:items-center">
              <div className="space-y-1">
                <h3 className="font-medium text-sm">Delete workspace</h3>
                <p className="text-muted-foreground text-sm">
                  Delete your workspace permanently. This action will remove all
                  data and cannot be undone.
                </p>
              </div>
              <Button
                className="border-destructive! text-destructive! hover:bg-destructive/10! focus-visible:ring-destructive/20 max-lg:w-full dark:focus-visible:ring-destructive/40"
                disabled
                variant="outline"
              >
                <Trash2Icon />
                Delete workspace
              </Button>
            </div>
            <Separator className="my-4" />
            <p className="text-muted-foreground text-sm">
              You cannot delete the workspace because you are not the system
              admin.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DangerZone;
