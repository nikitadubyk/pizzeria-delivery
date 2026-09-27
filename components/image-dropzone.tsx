"use client";

import { Box, Image } from "@mantine/core";
import { Dropzone } from "@mantine/dropzone";
import { IconPhoto, IconTrash, IconUpload, IconX } from "@tabler/icons-react";
import { useEffect, useState } from "react";

import { cn, interactiveTransitionClassName } from "@/lib/class-names";

import {
  ACCEPTED_IMAGE_TYPES,
  getImageRejectionMessage,
  IMAGE_SOURCE_MAX_BYTES,
} from "./image-dropzone/config";
import type { ImageDropzoneProps } from "./image-dropzone/types";
import { Typography } from "./ui";

export type { ImageDropzoneProps } from "./image-dropzone/types";

function SelectedImagePreview({ file }: { file: File }) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    const reader = new FileReader();
    const handleLoad = () => {
      setPreviewUrl(typeof reader.result === "string" ? reader.result : null);
    };

    reader.addEventListener("load", handleLoad);
    reader.readAsDataURL(file);

    return () => {
      reader.removeEventListener("load", handleLoad);
      if (reader.readyState === FileReader.LOADING) reader.abort();
    };
  }, [file]);

  if (!previewUrl) return null;

  return (
    <Image
      alt="Предпросмотр выбранного изображения"
      className="size-full"
      fit="contain"
      src={previewUrl}
    />
  );
}

function RemoveImageButton({
  disabled,
  onClick,
}: {
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      aria-label="Удалить изображение"
      className="right-sm top-sm border-danger-soft bg-background/95 text-danger hover:border-danger hover:bg-danger-soft focus-visible:outline-danger-active pointer-events-auto absolute grid size-10 cursor-pointer place-items-center rounded-full border shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
      disabled={disabled}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        onClick();
      }}
      type="button"
    >
      <IconTrash aria-hidden="true" size={18} />
    </button>
  );
}

export function ImageDropzone({
  value,
  onChange,
  className,
  currentImageUrl,
  disabled = false,
  error,
  label = "Изображение",
  loading = false,
  maxSize = IMAGE_SOURCE_MAX_BYTES,
  onRemoveCurrentImage,
}: ImageDropzoneProps) {
  const [rejectionError, setRejectionError] = useState<string | null>(null);
  const visibleError = error ?? rejectionError;
  return (
    <div className={cn("gap-xs grid min-w-0", className)}>
      <Typography className="font-extrabold" variant="bodySm">
        {label}
      </Typography>

      <Dropzone
        accept={ACCEPTED_IMAGE_TYPES}
        acceptColor="brand"
        classNames={{
          root: cn(
            "!rounded-xl !border-border !bg-background !p-sm text-text hover:!border-primary-hover hover:!bg-primary-soft focus-visible:!outline focus-visible:!outline-2 focus-visible:!outline-offset-2 focus-visible:!outline-primary-active",
            interactiveTransitionClassName,
            visibleError && "!border-danger"
          ),
        }}
        disabled={disabled}
        enablePointerEvents
        inputProps={{ "aria-label": label }}
        loading={loading}
        maxFiles={1}
        maxSize={maxSize}
        multiple={false}
        onDrop={([file]) => {
          setRejectionError(null);
          onChange(file ?? null);
        }}
        onReject={(rejections) =>
          setRejectionError(getImageRejectionMessage(rejections, maxSize))
        }
        rejectColor="tomato"
      >
        <div className="bg-surface grid min-h-52 place-items-center overflow-hidden rounded-lg">
          {value ? (
            <div className="bg-surface relative h-52 w-full overflow-hidden rounded-lg">
              <SelectedImagePreview
                file={value}
                key={`${value.name}-${value.lastModified}-${value.size}`}
              />
              <RemoveImageButton
                disabled={disabled || loading}
                onClick={() => {
                  setRejectionError(null);
                  onChange(null);
                }}
              />
            </div>
          ) : currentImageUrl ? (
            <div className="bg-surface relative h-52 w-full overflow-hidden rounded-lg">
              <Box
                alt="Текущее изображение продукта"
                className="size-full object-cover"
                component="img"
                src={currentImageUrl}
              />
              {onRemoveCurrentImage ? (
                <RemoveImageButton
                  disabled={disabled || loading}
                  onClick={() => {
                    setRejectionError(null);
                    onRemoveCurrentImage();
                  }}
                />
              ) : null}
              <span className="bottom-sm left-sm bg-background/90 px-sm py-xs text-text absolute rounded-lg text-xs font-bold">
                Нажмите, чтобы заменить
              </span>
            </div>
          ) : (
            <div className="gap-sm px-md py-xl grid justify-items-center text-center">
              <Dropzone.Accept>
                <IconUpload
                  aria-hidden="true"
                  className="text-primary-active"
                  size={42}
                />
              </Dropzone.Accept>
              <Dropzone.Reject>
                <IconX aria-hidden="true" className="text-danger" size={42} />
              </Dropzone.Reject>
              <Dropzone.Idle>
                <IconPhoto
                  aria-hidden="true"
                  className="text-muted"
                  size={42}
                />
              </Dropzone.Idle>
              <div className="grid gap-1">
                <Typography className="font-extrabold" variant="bodySm">
                  Перетащите изображение или нажмите для выбора
                </Typography>
                <Typography muted variant="caption">
                  JPG, PNG или WebP, до {Math.round(maxSize / 1024 / 1024)} МБ
                </Typography>
              </div>
            </div>
          )}
        </div>
      </Dropzone>

      {visibleError ? (
        <Typography className="!text-danger" role="alert" variant="caption">
          {visibleError}
        </Typography>
      ) : (
        <Typography muted variant="caption">
          Перед загрузкой изображение будет автоматически сжато.
        </Typography>
      )}
    </div>
  );
}
