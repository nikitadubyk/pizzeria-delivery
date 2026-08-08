import type { Preview } from "@storybook/nextjs-vite";
import "@mantine/core/styles.css";
import "../app/globals.css";
import { AppProvider } from "../components/app-provider";

const preview: Preview = {
  decorators: [
    (Story) => (
      <AppProvider>
        <div className="min-h-screen bg-background p-6 text-text">
          <Story />
        </div>
      </AppProvider>
    ),
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: "Pizzeria white",
      values: [
        { name: "Pizzeria white", value: "var(--app-color-background)" },
        { name: "Dough", value: "var(--app-color-surface)" },
        { name: "Dark footer", value: "var(--app-color-secondary-active)" },
      ],
    },
    layout: "padded",
  },
};

export default preview;
