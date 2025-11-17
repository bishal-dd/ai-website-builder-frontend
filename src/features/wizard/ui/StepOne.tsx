"use client";

import { Card } from "@/components/ui/card";
import { useWizardStore } from "@/features/wizard/store/wizardStore";
import { cn } from "@/lib/utils";
import { websiteTypes } from "../constants";
import { useState } from "react";
import { handleUpload } from "@/features/wizard/utils/handleUpload";

export function StepOne() {
  const { websiteType, setWebsiteType } = useWizardStore();
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const { cloudFrontUrl } = await handleUpload(
        file,
        "132822ee-299e-4f93-b836-7a7199c525c8"
      );
      setUploadedUrl(cloudFrontUrl);
    } catch (err) {
      console.error(err);
      alert("Upload failed!");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-balance">
          Choose Your Website Type
        </h2>
        <p className="text-muted-foreground text-pretty">
          Select the type of website you want to create
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl mx-auto">
        {websiteTypes.map((item) => {
          const Icon = item.icon;
          const isSelected = websiteType === item.type;

          return (
            <Card
              key={item.type}
              className={cn(
                "p-6 cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02]",
                isSelected
                  ? "ring-2 ring-primary bg-primary/5"
                  : "hover:border-primary/50"
              )}
              onClick={() => setWebsiteType(item.type)}
            >
              <div className="flex flex-col items-center text-center gap-3">
                <div
                  className={cn(
                    "w-12 h-12 rounded-lg flex items-center justify-center transition-colors",
                    isSelected
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{item.label}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {item.description}
                  </p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Upload button */}
      <div className="mt-6 text-center">
        <label className="cursor-pointer inline-block bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/80">
          {uploading ? "Uploading..." : "Upload Test File"}
          <input type="file" className="hidden" onChange={handleFileUpload} />
        </label>

        {uploadedUrl && (
          <p className="mt-2 text-sm text-green-600">
            Uploaded!{" "}
            <a href={uploadedUrl} target="_blank" className="underline">
              View File
            </a>
          </p>
        )}
      </div>
    </div>
  );
}
