import { Trash2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  accountSettingsSectionContentClassName,
  accountSettingsSectionGridClassName,
  accountSettingsSectionHeadingClassName,
} from "../../_shared/account-settings-page-shell.js";

const DangerZone = () => {
  return (
    <div className={accountSettingsSectionGridClassName}>
      {/* Vertical Tabs List */}
      <div className={accountSettingsSectionHeadingClassName}>
        <h3 className="font-semibold">Danger Zone</h3>
        <p className="text-muted-foreground text-sm">
          Delete your account permanently. This action will remove all your data
          and cannot be undone{" "}
          <a
            className="font-medium text-card-foreground hover:underline"
            href="#"
          >
            Learn more
          </a>
        </p>
      </div>

      {/* Content */}
      <div className={accountSettingsSectionContentClassName("6")}>
        <Card>
          <CardContent>
            <div className="flex justify-between gap-4 max-lg:flex-col lg:items-center">
              <div className="space-y-1">
                <h3 className="font-medium text-sm">Delete account</h3>
                <p className="text-muted-foreground text-sm">
                  Delete your account permanently. This action will remove all
                  your data and cannot be undone.
                </p>
              </div>
              <Dialog>
                <DialogTrigger
                  render={
                    <Button
                      className="border-destructive! text-destructive! hover:bg-destructive/10! focus-visible:ring-destructive/20 max-lg:w-full dark:focus-visible:ring-destructive/40"
                      variant="outline"
                    />
                  }
                >
                  <Trash2Icon />
                  Delete
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader className="space-y-2">
                    <DialogTitle>Delete account</DialogTitle>
                    <div className="text-muted-foreground text-sm">
                      Delete your account permanently. This action will remove
                      all your data and cannot be undone.
                    </div>
                  </DialogHeader>
                  <div className="flex flex-col-reverse gap-4 sm:flex-row sm:justify-end">
                    <DialogClose render={<Button variant="outline" />}>
                      Cancel
                    </DialogClose>
                    <DialogClose render={<Button variant="destructive" />}>
                      Delete
                    </DialogClose>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DangerZone;
