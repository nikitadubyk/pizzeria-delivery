"use client";

import Link from "next/link";
import { IconArrowLeft } from "@tabler/icons-react";

import { PageContainer } from "@/components/page-container";
import { NotFoundIllustration } from "@/components/not-found-illustration";
import { Button } from "@/components/ui";

export default function NotFound() {
  return (
    <main className="bg-surface text-text relative flex flex-1 overflow-hidden">
      <div className="bg-primary-soft/70 pointer-events-none absolute top-16 -left-24 h-72 w-72 rounded-full blur-3xl" />
      <div className="bg-warning-soft/70 pointer-events-none absolute -right-24 bottom-0 h-80 w-80 rounded-full blur-3xl" />

      <PageContainer className="relative flex min-h-[calc(100svh-6.5rem)] items-center justify-center py-12 sm:py-16 lg:min-h-[calc(100svh-7rem)]">
        <section className="mx-auto flex w-full max-w-3xl flex-col items-center text-center">
          <p className="border-primary/15 bg-background text-primary-active mb-3 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-extrabold shadow-sm">
            Кажется, здесь ничего не готовят
          </p>

          <h1 className="sr-only">Ошибка 404 — страница не найдена</h1>
          <NotFoundIllustration />

          <h2 className="text-text mt-7 text-3xl font-black tracking-tight sm:mt-9 sm:text-4xl">
            Упс! Этот кусочек потерялся
          </h2>
          <p className="text-muted mt-3 max-w-[36rem] text-base leading-relaxed font-medium sm:text-lg">
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
