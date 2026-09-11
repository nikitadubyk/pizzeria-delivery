import { Typography } from "@/components/ui";

type AdminPlaceholderProps = {
  title: string;
  description: string;
};

export function AdminPlaceholder({ title, description }: AdminPlaceholderProps) {
  return (
    <section className="grid gap-sm rounded-2xl border border-border bg-background p-lg">
      <Typography variant="h1">{title}</Typography>
      <Typography muted>{description}</Typography>
      <Typography variant="bodySm" muted>Раздел в разработке.</Typography>
    </section>
  );
}
