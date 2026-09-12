export type ImageDropzoneProps = {
  value: File | null;
  onChange: (file: File | null) => void;
  className?: string;
  currentImageUrl?: string | null;
  disabled?: boolean;
  error?: string;
  label?: string;
  loading?: boolean;
  maxSize?: number;
  onRemoveCurrentImage?: () => void;
};
