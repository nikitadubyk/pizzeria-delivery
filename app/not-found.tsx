"use client";

import Link from "next/link";
import { IconArrowLeft } from "@tabler/icons-react";

import { PageContainer } from "@/components/page-container";
import { NotFoundIllustration } from "@/components/not-found-illustration";
import { Button } from "@/components/ui";

export default function NotFound() {
  return (
    <main className="relative flex flex-1 overflow-hidden bg-surface text-text">
      <div className="pointer-events-none absolute -left-24 top-16 h-72 w-72 rounded-full bg-primary-soft/70 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-warning-soft/70 blur-3xl" />

      <PageContainer className="relative flex min-h-[calc(100svh-6.5rem)] items-center justify-center py-12 sm:py-16 lg:min-h-[calc(100svh-7rem)]">
        <section className="mx-auto flex w-full max-w-3xl flex-col items-center text-center">
          <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-background px-4 py-2 text-sm font-extrabold text-primary-active shadow-sm">
            Кажется, здесь ничего не готовят
          </p>

          <h1 className="sr-only">Ошибка 404 — страница не найдена</h1>
          <NotFoundIllustration />

          <h2 className="mt-7 text-3xl font-black tracking-tight text-text sm:mt-9 sm:text-4xl">
            Упс! Этот кусочек потерялся
          </h2>
          <p className="mt-3 max-w-[36rem] text-base font-medium leading-relaxed text-muted sm:text-lg">
            Такой страницы нет или её уже съели. Возвращайтесь в меню — там
            точно найдётся что-нибудь вкусное.
          </p>

          <Button
            className="mt-7 rounded-full px-6"
            component={Link}
            href="/#menu"
            leftSection={
              <IconArrowLeft aria-hidden="true" size={20} stroke={2.5} />
            }
          >
            Вернуться в меню
          </Button>
        </section>
      </PageContainer>
    </main>
  );
}
