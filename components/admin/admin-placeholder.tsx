import { Typography } from "@/components/ui";

type AdminPlaceholderProps = {
  title: string;
  description: string;
};

export function AdminPlaceholder({
  title,
  description,
}: AdminPlaceholderProps) {
  return (
    <section className="gap-sm border-border bg-background p-lg grid rounded-2xl border">
      <Typography variant="h1">{title}</Typography>
      <Typography muted>{description}</Typography>
      <Typography variant="bodySm" muted>
        Раздел в разработке.
      </Typography>
    </section>
  );
}
