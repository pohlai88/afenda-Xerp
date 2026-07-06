import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@afenda/shadcn-studio-v2/clients";
import Image from "next/image";
import type { AppearanceSettingsPageData } from "@/lib/lab/contracts";

interface AppearanceGuidelinesPanelProps {
  readonly pageData: AppearanceSettingsPageData;
}

export function AppearanceGuidelinesPanel({
  pageData,
}: AppearanceGuidelinesPanelProps) {
  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle>Appearance route guidelines</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div className="overflow-hidden rounded-[1.75rem] border border-border/60 bg-muted/30">
          <Image
            alt={pageData.previewImage.alt}
            className="h-auto w-full"
            height={pageData.previewImage.height}
            loading="eager"
            sizes="(min-width: 1280px) 24rem, (min-width: 768px) 45vw, 100vw"
            src={pageData.previewImage.src}
            width={pageData.previewImage.width}
          />
        </div>
        <div className="rounded-2xl border border-border/60 px-4 py-3 text-sm">
          Canonical route: {pageData.canonicalHref}
        </div>
        {pageData.guidelines.map((item) => (
          <div className="rounded-2xl bg-muted px-4 py-3" key={item.title}>
            <p className="font-medium">{item.title}</p>
            <p className="mt-1 text-muted-foreground">{item.summary}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
