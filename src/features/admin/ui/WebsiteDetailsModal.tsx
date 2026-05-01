import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Globe } from "lucide-react";
import { AdminUserContact } from "../api/getAdminContacts";

export function WebsiteDetailsModal({
  user,
  onClose,
}: {
  user: AdminUserContact | null;
  onClose: () => void;
}) {
  if (!user) return null;

  return (
    <Dialog open={!!user} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Globe className="size-5 text-blue-600" />
            Projects created by {user.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4 max-h-[60vh] overflow-y-auto pr-2">
          {user.websites.map((site) => (
            <div
              key={site.id}
              className="p-4 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-between"
            >
              <div className="space-y-1">
                <h4 className="font-bold text-slate-900 flex items-center gap-2">
                  {site.title}
                  <Badge variant="outline" className="text-[10px] uppercase">
                    {site.deployment_status}
                  </Badge>
                </h4>
                <p className="text-xs text-muted-foreground font-mono">
                  {site.id}
                </p>
              </div>

              <div className="text-right space-y-2">
                <p className="text-xs font-medium text-slate-600">
                  {site.contact_email}
                </p>
                <p className="text-xs text-slate-500">{site.phone}</p>
              </div>
            </div>
          ))}

          {user.websites.length === 0 && (
            <p className="text-center py-8 text-slate-400 italic">
              No websites found.
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
