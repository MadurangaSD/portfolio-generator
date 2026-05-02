"use client";

import React from "react";
import Image from "next/image";
import { CldUploadWidget, CldUploadWidgetOnUpload } from "next-cloudinary";

type Props = {
  name: string;
  setValue: (name: string, value: unknown, opts?: unknown) => void;
  value?: string | null;
  uploadPreset?: string;
  buttonLabel?: string;
};

export default function CloudinaryUpload({ name, setValue, value, uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET ?? "ml_default", buttonLabel = "Upload" }: Props) {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

  const handleUploadResult = (result: Parameters<CldUploadWidgetOnUpload>[0]) => {
    try {
      // result.info is expected from CldUploadWidget callback
      const info = (result as unknown as { info?: Record<string, unknown> })?.info;
      const secureUrl = info && typeof info.secure_url === "string" ? info.secure_url : null;
      const fallbackUrl = info && typeof info.url === "string" ? info.url : null;
      const url = secureUrl ?? fallbackUrl;

      if (url) {
        // Immediately bind uploaded URL into React Hook Form state
        setValue(name, url, { shouldValidate: true, shouldDirty: true, shouldTouch: true });
        console.debug("[CloudinaryUpload] set form value", name, url);
      } else {
        console.warn("[CloudinaryUpload] upload did not return secure_url", info);
      }
    } catch (e) {
      console.error("[CloudinaryUpload] Upload callback error", e);
    }
  };

  return (
    <div>
      <CldUploadWidget
        uploadPreset={uploadPreset}
        cloudName={cloudName}
        onUpload={handleUploadResult}
        onSuccess={handleUploadResult}
        options={{ sources: ["local", "url", "camera"], multiple: false }}
      >
        {({ open }: { open: () => void }) => (
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => open()}
              disabled={!cloudName}
              className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm font-medium text-zinc-100 hover:bg-zinc-800"
            >
              {buttonLabel}
            </button>
            {value ? (
              <div className="h-12 w-12 rounded-full overflow-hidden">
                <Image src={value} alt="preview" width={48} height={48} className="object-cover" />
              </div>
            ) : null}
          </div>
        )}
      </CldUploadWidget>
      {!cloudName ? (
        <p className="mt-2 text-xs text-rose-400">
          Missing NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME in environment.
        </p>
      ) : null}
    </div>
  );
}
