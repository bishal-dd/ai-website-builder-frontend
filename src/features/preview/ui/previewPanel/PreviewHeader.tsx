import Image from "next/image";
import Link from "next/link";
import {
  CircleHelp,
  LayoutDashboard,
  Monitor,
  MoveUpRight,
  RefreshCw,
  Smartphone,
  Tablet,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import type { DeviceType } from "@/features/preview/types/previewPanel";

interface PreviewHeaderProps {
  device: DeviceType;
  isFetchingData: boolean;
  isDeployed: boolean;
  isGeneratingPreview: boolean;
  onDeviceChange: (device: DeviceType) => void;
  onSharePreview: () => void;
  onRepublish: () => void;
  onPublish: () => void;
}

export function PreviewHeader({
  device,
  isFetchingData,
  isDeployed,
  isGeneratingPreview,
  onDeviceChange,
  onSharePreview,
  onRepublish,
  onPublish,
}: PreviewHeaderProps) {
  return (
    <div className="flex items-center justify-between border-b bg-card px-4 py-3">
      <div className="hidden items-center gap-2 md:flex">
        <h3 className="text-sm font-semibold">Preview</h3>

        <Tabs
          value={device}
          onValueChange={(value) => onDeviceChange(value as DeviceType)}
        >
          <TabsList>
            <TabsTrigger value="desktop">
              <Monitor className="h-4 w-4" />
            </TabsTrigger>

            <TabsTrigger value="tablet">
              <Tablet className="h-4 w-4" />
            </TabsTrigger>

            <TabsTrigger value="mobile">
              <Smartphone className="h-4 w-4" />
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
        <Button
          asChild
          className="bg-green-600 px-2 text-white shadow-sm hover:bg-green-700 sm:px-3"
        >
          <a
            href="https://wa.me/97517959259?text=Hi%20I%20need%20help%20with%20my%20website"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center"
          >
            <Image
              src="/whatsapp-icon.svg"
              alt="WhatsApp"
              width={18}
              height={18}
            />

            <span className="hidden text-sm font-medium sm:inline">
              Ask for help
            </span>

            <span className="text-sm font-medium sm:inline md:hidden">
              Help?
            </span>
          </a>
        </Button>

        <Button variant="outline" asChild>
          <Link
            href="/help"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2"
          >
            <CircleHelp className="h-4 w-4" />
            <span className="hidden sm:inline">Help Docs</span>
            <span className="sm:hidden">Docs</span>
          </Link>
        </Button>

        <Button variant="outline" asChild>
          <Link href="/dashboard" className="flex items-center gap-2">
            <LayoutDashboard className="h-4 w-4" />
            <span className="sm:inline">Dashboard</span>
          </Link>
        </Button>

        <Button
          variant="outline"
          onClick={onSharePreview}
          disabled={isGeneratingPreview}
          className="flex items-center gap-2"
        >
          {isGeneratingPreview ? (
            <RefreshCw className="h-4 w-4 animate-spin" />
          ) : (
            <MoveUpRight className="h-4 w-4" />
          )}

          {isGeneratingPreview ? "Generating preview..." : "Preview"}
        </Button>

        {isFetchingData ? (
          <Button disabled variant="outline" className="px-3">
            <span className="hidden sm:inline">Checking status...</span>
            <span className="sm:hidden">…</span>
          </Button>
        ) : isDeployed ? (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="default" className="px-3">
                <span className="hidden sm:inline">Republish</span>
                <span className="sm:hidden">Republish</span>
              </Button>
            </AlertDialogTrigger>

            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>

                <AlertDialogDescription>
                  This will push your latest changes to the live production
                  site. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>

              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>

                <AlertDialogAction
                  onClick={onRepublish}
                  className="bg-primary text-primary-foreground"
                >
                  Confirm Republish
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        ) : (
          <Button className="px-3" onClick={onPublish}>
            <span className="hidden sm:inline">Publish</span>
            <span className="sm:hidden">Publish</span>
          </Button>
        )}
      </div>
    </div>
  );
}
