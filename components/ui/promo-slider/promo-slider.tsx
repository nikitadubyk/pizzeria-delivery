"use client";

import {
  IconChevronLeft,
  IconChevronRight,
} from "@tabler/icons-react";
import { Box } from "@mantine/core";
import { Carousel, type CarouselProps } from "@mantine/carousel";
import { cn, interactiveTransitionClassName } from "@/lib/class-names";
import {
  type ComponentPropsWithoutRef,
  type ReactNode,
  useEffect,
  useState,
} from "react";

export type PromoSliderItem = {
  action?: ReactNode;
  badge?: ReactNode;
  description?: ReactNode;
  eyebrow?: ReactNode;
  id: string;
  imageAlt?: string;
  imageSrc?: string;
  price?: ReactNode;
  title?: ReactNode;
};

export type PromoSliderProps = Omit<
  ComponentPropsWithoutRef<"section">,
  "children" | "onChange"
> & {
  activeIndex?: number;
  ariaLabel?: string;
  defaultActiveIndex?: number;
  items: PromoSliderItem[];
  onActiveIndexChange?: (activeIndex: number) => void;
  showControls?: boolean;
  showIndicators?: boolean;
};

function clampIndex(index: number, itemsCount: number) {
  if (itemsCount <= 0) {
    return 0;
  }

  return Math.min(Math.max(index, 0), itemsCount - 1);
}

type EmblaApi = Parameters<NonNullable<CarouselProps["getEmblaApi"]>>[0];

export function PromoSlider({
  activeIndex,
  ariaLabel = "Рекламные предложения",
  className,
  defaultActiveIndex = 0,
  items,
  onActiveIndexChange,
  showControls = true,
  showIndicators = true,
  ...props
}: PromoSliderProps) {
  const [emblaApi, setEmblaApi] = useState<EmblaApi | null>(null);
  const [internalActiveIndex, setInternalActiveIndex] = useState(() =>
    clampIndex(defaultActiveIndex, items.length),
  );
  const currentActiveIndex = clampIndex(
    activeIndex ?? internalActiveIndex,
    items.length,
  );
  const hasMultipleItems = items.length > 1;

  useEffect(() => {
    if (activeIndex === undefined || !emblaApi) {
      return;
    }

    emblaApi.scrollTo(currentActiveIndex);
  }, [activeIndex, currentActiveIndex, emblaApi]);

  const handleSlideChange = (nextIndex: number) => {
    const clampedIndex = clampIndex(nextIndex, items.length);

    if (activeIndex === undefined) {
      setInternalActiveIndex(clampedIndex);
    }

    onActiveIndexChange?.(clampedIndex);
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <section
      aria-label={ariaLabel}
      className={cn(
        "min-w-0 [--promo-slider-height:30rem] sm:px-8 sm:[--promo-slider-height:22rem]",
        hasMultipleItems && showIndicators && "pb-7",
        className,
      )}
      {...props}
    >
      <Carousel
        classNames={{
          container: "!h-full",
          control: cn(
            "!grid !size-10 !place-items-center !rounded-full !border !border-border !bg-surface/95 !text-text !shadow-sm !backdrop-blur hover:!border-primary hover:!text-primary-active disabled:!cursor-not-allowed disabled:!opacity-40 disabled:hover:!border-border disabled:hover:!text-text",
            interactiveTransitionClassName,
          ),
          controls: "!hidden !px-0 sm:!-end-8 sm:!-start-8 sm:!flex",
          indicator: cn(
            "!h-2.5 !w-2.5 !rounded-full !bg-border !opacity-100 data-[active]:!w-7 data-[active]:!bg-primary",
            interactiveTransitionClassName,
          ),
          indicators: "!bottom-0 !top-auto !translate-y-7 !gap-2",
          slide: "!h-full",
          viewport: "!rounded-xl",
        }}
        controlSize={40}
        controlsOffset="sm"
        emblaOptions={{ align: "start", loop: false }}
        getEmblaApi={setEmblaApi}
        height="var(--promo-slider-height)"
        initialSlide={clampIndex(defaultActiveIndex, items.length)}
        nextControlIcon={<IconChevronRight aria-hidden="true" size={20} />}
        nextControlProps={{
          "aria-label": "Показать следующее предложение",
        }}
        onSlideChange={handleSlideChange}
        previousControlIcon={<IconChevronLeft aria-hidden="true" size={20} />}
        previousControlProps={{
          "aria-label": "Показать предыдущее предложение",
        }}
        slideGap="md"
        slideSize="100%"
        withControls={hasMultipleItems && showControls}
        withIndicators={hasMultipleItems && showIndicators}
      >
        {items.map((item, index) => {
          const hasContent = Boolean(
            item.action ||
              item.badge ||
              item.description ||
              item.eyebrow ||
              item.price ||
              item.title,
          );
          const hasMedia = Boolean(item.imageSrc);

          return (
            <Carousel.Slide key={item.id}>
              <article
                aria-label={`${index + 1} из ${items.length}`}
                className={cn(
                  "grid h-full overflow-hidden rounded-xl border border-border bg-surface shadow-sm",
                  hasContent &&
                    hasMedia &&
                    "grid-rows-[minmax(0,1fr)_8.5rem] md:grid-cols-[minmax(0,1fr)_minmax(16rem,0.64fr)] md:grid-rows-[1fr]",
                )}
              >
                {hasContent && (
                  <div className="grid min-h-0 min-w-0 content-start gap-4 overflow-hidden px-5 pb-6 pt-5 sm:p-6 md:content-center lg:p-8">
                    <div className="grid max-w-[34rem] gap-2.5 sm:gap-3">
                      {(item.eyebrow || item.badge) && (
                        <div className="flex min-w-0 flex-wrap items-center gap-2">
                          {item.eyebrow && (
                            <span className="text-xs font-extrabold uppercase tracking-normal text-primary-active">
                              {item.eyebrow}
                            </span>
                          )}
                          {item.badge && item.badge}
                        </div>
                      )}

                      {item.title && (
                        <h2 className="m-0 text-xl font-extrabold leading-tight text-text sm:text-2xl md:text-3xl">
                          {item.title}
                        </h2>
                      )}

                      {item.description && (
                        <p className="m-0 text-sm leading-relaxed text-muted">
                          {item.description}
                        </p>
                      )}
                    </div>

                    {(item.price || item.action) && (
                      <div className="flex min-w-0 flex-wrap items-center gap-2.5 sm:gap-3">
                        {item.price && (
                          <span className="text-lg font-extrabold text-primary-active sm:text-xl">
                            {item.price}
                          </span>
                        )}
                        {item.action && item.action}
                      </div>
                    )}
                  </div>
                )}

                {hasMedia && (
                  <div className="relative min-h-0 overflow-hidden bg-primary-soft">
                    <Box
                      alt={item.imageAlt ?? ""}
                      className="size-full object-cover"
                      component="img"
                      src={item.imageSrc}
                    />
                  </div>
                )}
              </article>
            </Carousel.Slide>
          );
        })}
      </Carousel>
    </section>
  );
}
