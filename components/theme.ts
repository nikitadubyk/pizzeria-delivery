import {
  createTheme,
  rem,
  type CSSVariablesResolver,
  type MantineColorsTuple,
} from "@mantine/core";

const orange = [
  "#fff4e6",
  "#ffe3c7",
  "#ffc28d",
  "#ff9e4f",
  "#ff7f1d",
  "#ff650f",
  "#f75c05",
  "#dc4d00",
  "#c44100",
  "#aa3600",
] satisfies MantineColorsTuple;

const dough = [
  "#fffaf5",
  "#f8f1eb",
  "#eaded5",
  "#d9c7bb",
  "#c6ad9d",
  "#a58775",
  "#7d6151",
  "#5a4438",
  "#3a2a23",
  "#241911",
] satisfies MantineColorsTuple;

const tomato = [
  "#fff0ee",
  "#ffd9d3",
  "#ffaea3",
  "#ff8171",
  "#ff5d4b",
  "#f04438",
  "#dd3429",
  "#ba251d",
  "#971f19",
  "#7d1b16",
] satisfies MantineColorsTuple;

export const pizzeriaPalette = {
  white: "#ffffff",
  black: "#171717",
  orange,
  dough,
  tomato,
} as const;

export const pizzeriaTheme = createTheme({
  primaryColor: "orange",
  primaryShade: { light: 5, dark: 4 },
  white: pizzeriaPalette.white,
  black: pizzeriaPalette.black,
  defaultRadius: "xl",
  fontFamily: "var(--font-geist-sans), Arial, Helvetica, sans-serif",
  headings: {
    fontFamily: "var(--font-geist-sans), Arial, Helvetica, sans-serif",
    fontWeight: "800",
  },
  colors: {
    orange: pizzeriaPalette.orange,
    dough: pizzeriaPalette.dough,
    tomato: pizzeriaPalette.tomato,
  },
  components: {
    Button: {
      defaultProps: {
        radius: "xl",
        fw: 800,
        size: "md",
      },
      styles: {
        root: {
          minHeight: rem(44),
          paddingInline: rem(24),
          borderWidth: rem(1),
          letterSpacing: 0,
          transition:
            "background-color 160ms ease, border-color 160ms ease, box-shadow 160ms ease, transform 160ms ease",
        },
      },
    },
    TextInput: {
      defaultProps: {
        radius: "xl",
        size: "md",
      },
      styles: {
        input: {
          minHeight: rem(44),
          backgroundColor: "var(--app-color-background)",
          borderColor: "var(--app-color-border)",
          color: "var(--app-color-text)",
        },
        label: {
          color: "var(--app-color-text)",
          fontWeight: 800,
        },
      },
    },
    Textarea: {
      defaultProps: {
        radius: "lg",
        size: "md",
      },
      styles: {
        input: {
          backgroundColor: "var(--app-color-background)",
          borderColor: "var(--app-color-border)",
          color: "var(--app-color-text)",
        },
        label: {
          color: "var(--app-color-text)",
          fontWeight: 800,
        },
      },
    },
    PasswordInput: {
      defaultProps: {
        radius: "xl",
        size: "md",
      },
      styles: {
        input: {
          minHeight: rem(44),
          backgroundColor: "var(--app-color-background)",
          borderColor: "var(--app-color-border)",
          color: "var(--app-color-text)",
        },
        label: {
          color: "var(--app-color-text)",
          fontWeight: 800,
        },
      },
    },
    Checkbox: {
      defaultProps: {
        radius: "sm",
        color: "orange",
      },
      styles: {
        label: {
          color: "var(--app-color-text)",
          fontWeight: 800,
        },
        description: {
          color: "var(--app-color-text-muted)",
        },
      },
    },
    Radio: {
      defaultProps: {
        color: "orange",
      },
      styles: {
        label: {
          color: "var(--app-color-text)",
          fontWeight: 800,
        },
        description: {
          color: "var(--app-color-text-muted)",
        },
      },
    },
    Switch: {
      defaultProps: {
        color: "orange",
      },
    },
    Tabs: {
      defaultProps: {
        color: "orange",
        radius: "xl",
      },
    },
  },
});

export const pizzeriaCssVariablesResolver: CSSVariablesResolver = (theme) => ({
  variables: {
    "--app-color-white": theme.white,
    "--app-color-black": theme.black,
    "--app-color-background": theme.white,
    "--app-color-foreground": theme.colors.dough[9],
    "--app-color-surface": theme.colors.dough[0],
    "--app-color-surface-muted": theme.colors.dough[1],
    "--app-color-border": theme.colors.dough[2],
    "--app-color-text": theme.colors.dough[9],
    "--app-color-text-muted": theme.colors.dough[6],
    "--app-color-primary": theme.colors.orange[5],
    "--app-color-primary-hover": theme.colors.orange[6],
    "--app-color-primary-active": theme.colors.orange[7],
    "--app-color-primary-soft": theme.colors.orange[0],
    "--app-color-primary-contrast": theme.white,
    "--app-color-secondary": theme.colors.dough[7],
    "--app-color-secondary-hover": theme.colors.dough[8],
    "--app-color-secondary-active": theme.colors.dough[9],
    "--app-color-secondary-soft": theme.colors.dough[1],
    "--app-color-secondary-contrast": theme.white,
    "--app-color-danger": theme.colors.tomato[5],
    "--app-color-danger-hover": theme.colors.tomato[6],
    "--app-color-danger-active": theme.colors.tomato[7],
    "--app-color-danger-soft": theme.colors.tomato[0],
  },
  light: {},
  dark: {},
});
