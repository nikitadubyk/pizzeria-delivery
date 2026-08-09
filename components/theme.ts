import {
  createTheme,
  rem,
  type CSSVariablesResolver,
  type MantineColorsTuple,
} from "@mantine/core";

export type PizzeriaBrandColor =
  | string
  | {
      base: string;
      hover?: string;
      active?: string;
      soft?: string;
      contrast?: string;
    };

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

const success = [
  "#ecfdf3",
  "#d1fadf",
  "#a6f4c5",
  "#6ce9a6",
  "#32d583",
  "#12b76a",
  "#039855",
  "#027a48",
  "#05603a",
  "#054f31",
] satisfies MantineColorsTuple;

const info = [
  "#eff8ff",
  "#d1e9ff",
  "#b2ddff",
  "#84caff",
  "#53b1fd",
  "#2e90fa",
  "#1570ef",
  "#175cd3",
  "#1849a9",
  "#194185",
] satisfies MantineColorsTuple;

const warning = [
  "#fffaeb",
  "#fef0c7",
  "#fedf89",
  "#fec84b",
  "#fdb022",
  "#f79009",
  "#dc6803",
  "#b54708",
  "#93370d",
  "#7a2e0e",
] satisfies MantineColorsTuple;

export const pizzeriaPalette = {
  white: "#ffffff",
  black: "#171717",
  brand: orange,
  orange,
  dough,
  failed: tomato,
  info,
  success,
  tomato,
  warning,
} as const;

export const pizzeriaTypography = {
  fontFamily: '"Roboto Variable", Arial, Helvetica, sans-serif',
  fontFamilyMonospace: '"Roboto Variable", Arial, Helvetica, sans-serif',
  fontSizes: {
    xs: rem(12),
    sm: rem(14),
    md: rem(16),
    lg: rem(18),
    xl: rem(20),
  },
  lineHeights: {
    xs: "var(--app-leading-tight)",
    sm: "var(--app-leading-snug)",
    md: "var(--app-leading-normal)",
    lg: "var(--app-leading-normal)",
    xl: "var(--app-leading-relaxed)",
  },
} as const;

export const pizzeriaSpacing = {
  xs: rem(4),
  sm: rem(8),
  md: rem(12),
  lg: rem(16),
  xl: rem(24),
} as const;

type RgbColor = {
  r: number;
  g: number;
  b: number;
};

type ResolvedPizzeriaBrandColor = {
  palette: MantineColorsTuple;
  contrast: string;
};

function normalizeHexColor(color: string): string {
  const trimmedColor = color.trim();
  const colorWithoutHash = trimmedColor.startsWith("#")
    ? trimmedColor.slice(1)
    : trimmedColor;

  if (/^[0-9a-f]{3}$/i.test(colorWithoutHash)) {
    return `#${colorWithoutHash
      .split("")
      .map((value) => value + value)
      .join("")
      .toLowerCase()}`;
  }

  if (/^[0-9a-f]{6}$/i.test(colorWithoutHash)) {
    return `#${colorWithoutHash.toLowerCase()}`;
  }

  return trimmedColor;
}

function hexToRgb(color: string): RgbColor | null {
  const normalizedColor = normalizeHexColor(color);

  if (!/^#[0-9a-f]{6}$/i.test(normalizedColor)) {
    return null;
  }

  const value = Number.parseInt(normalizedColor.slice(1), 16);

  return {
    r: (value >> 16) & 255,
    g: (value >> 8) & 255,
    b: value & 255,
  };
}

function rgbToHex({ r, g, b }: RgbColor): string {
  return `#${[r, g, b]
    .map((value) => Math.round(value).toString(16).padStart(2, "0"))
    .join("")}`;
}

function mixColors(source: RgbColor, target: RgbColor, weight: number): RgbColor {
  return {
    r: source.r + (target.r - source.r) * weight,
    g: source.g + (target.g - source.g) * weight,
    b: source.b + (target.b - source.b) * weight,
  };
}

function getContrastColor(color: string): string {
  const rgbColor = hexToRgb(color);

  if (!rgbColor) {
    return pizzeriaPalette.white;
  }

  const channels = [rgbColor.r, rgbColor.g, rgbColor.b].map((channel) => {
    const normalizedChannel = channel / 255;
    return normalizedChannel <= 0.03928
      ? normalizedChannel / 12.92
      : ((normalizedChannel + 0.055) / 1.055) ** 2.4;
  });
  const luminance =
    0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];

  return luminance > 0.52 ? pizzeriaPalette.black : pizzeriaPalette.white;
}

function createPaletteFromColor(color: string): MantineColorsTuple {
  const baseColor = normalizeHexColor(color);
  const rgbColor = hexToRgb(baseColor);

  if (!rgbColor) {
    return orange;
  }

  const white = { r: 255, g: 255, b: 255 };
  const black = { r: 0, g: 0, b: 0 };

  return [
    rgbToHex(mixColors(rgbColor, white, 0.92)),
    rgbToHex(mixColors(rgbColor, white, 0.8)),
    rgbToHex(mixColors(rgbColor, white, 0.62)),
    rgbToHex(mixColors(rgbColor, white, 0.42)),
    rgbToHex(mixColors(rgbColor, white, 0.18)),
    baseColor,
    rgbToHex(mixColors(rgbColor, black, 0.05)),
    rgbToHex(mixColors(rgbColor, black, 0.14)),
    rgbToHex(mixColors(rgbColor, black, 0.23)),
    rgbToHex(mixColors(rgbColor, black, 0.32)),
  ] satisfies MantineColorsTuple;
}

function resolveBrandColor(
  primaryColor?: PizzeriaBrandColor,
): ResolvedPizzeriaBrandColor {
  if (!primaryColor) {
    return {
      palette: orange,
      contrast: pizzeriaPalette.white,
    };
  }

  if (typeof primaryColor === "string") {
    const palette = createPaletteFromColor(primaryColor);

    return {
      palette,
      contrast: getContrastColor(palette[5]),
    };
  }

  const baseColor = normalizeHexColor(primaryColor.base);
  const palette = createPaletteFromColor(baseColor);
  const resolvedBaseColor = hexToRgb(baseColor) ? baseColor : palette[5];

  return {
    palette: [
      primaryColor.soft ?? palette[0],
      palette[1],
      palette[2],
      palette[3],
      palette[4],
      resolvedBaseColor,
      primaryColor.hover ?? palette[6],
      primaryColor.active ?? palette[7],
      palette[8],
      palette[9],
    ] satisfies MantineColorsTuple,
    contrast: primaryColor.contrast ?? getContrastColor(resolvedBaseColor),
  };
}

export function createPizzeriaCssVariablesResolver({
  contrast,
}: ResolvedPizzeriaBrandColor): CSSVariablesResolver {
  return (theme) => ({
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
      "--app-color-primary": theme.colors.brand[5],
      "--app-color-primary-hover": theme.colors.brand[6],
      "--app-color-primary-active": theme.colors.brand[7],
      "--app-color-primary-soft": theme.colors.brand[0],
      "--app-color-primary-contrast": contrast,
      "--app-color-secondary": theme.colors.dough[7],
      "--app-color-secondary-hover": theme.colors.dough[8],
      "--app-color-secondary-active": theme.colors.dough[9],
      "--app-color-secondary-soft": theme.colors.dough[1],
      "--app-color-secondary-contrast": theme.white,
      "--app-color-danger": theme.colors.tomato[5],
      "--app-color-danger-hover": theme.colors.tomato[6],
      "--app-color-danger-active": theme.colors.tomato[7],
      "--app-color-danger-soft": theme.colors.tomato[0],
      "--app-color-danger-contrast": theme.white,
      "--app-color-failed": theme.colors.failed[5],
      "--app-color-failed-hover": theme.colors.failed[6],
      "--app-color-failed-active": theme.colors.failed[7],
      "--app-color-failed-soft": theme.colors.failed[0],
      "--app-color-failed-contrast": theme.white,
      "--app-color-info": theme.colors.info[5],
      "--app-color-info-hover": theme.colors.info[6],
      "--app-color-info-active": theme.colors.info[7],
      "--app-color-info-soft": theme.colors.info[0],
      "--app-color-info-contrast": theme.white,
      "--app-color-success": theme.colors.success[5],
      "--app-color-success-hover": theme.colors.success[6],
      "--app-color-success-active": theme.colors.success[7],
      "--app-color-success-soft": theme.colors.success[0],
      "--app-color-success-contrast": theme.white,
      "--app-color-warning": theme.colors.warning[5],
      "--app-color-warning-hover": theme.colors.warning[6],
      "--app-color-warning-active": theme.colors.warning[7],
      "--app-color-warning-soft": theme.colors.warning[0],
      "--app-color-warning-contrast": theme.colors.dough[9],
      "--app-font-sans": pizzeriaTypography.fontFamily,
      "--app-font-mono": pizzeriaTypography.fontFamilyMonospace,
      "--app-text-xs": pizzeriaTypography.fontSizes.xs,
      "--app-text-sm": pizzeriaTypography.fontSizes.sm,
      "--app-text-md": pizzeriaTypography.fontSizes.md,
      "--app-text-lg": pizzeriaTypography.fontSizes.lg,
      "--app-text-xl": pizzeriaTypography.fontSizes.xl,
      "--app-text-2xl": rem(24),
      "--app-text-3xl": rem(32),
      "--app-text-4xl": rem(40),
      "--app-leading-tight": "1.2",
      "--app-leading-snug": "1.35",
      "--app-leading-normal": "1.5",
      "--app-leading-relaxed": "1.6",
      "--app-space-2xs": rem(4),
      "--app-space-xs": pizzeriaSpacing.sm,
      "--app-space-sm": pizzeriaSpacing.md,
      "--app-space-md": pizzeriaSpacing.lg,
      "--app-space-lg": pizzeriaSpacing.xl,
      "--app-space-xl": rem(32),
      "--app-space-2xl": rem(48),
    },
    light: {},
    dark: {},
  });
}

export function createPizzeriaTheme(primaryColor?: PizzeriaBrandColor) {
  const brandColor = resolveBrandColor(primaryColor);

  return {
    cssVariablesResolver: createPizzeriaCssVariablesResolver(brandColor),
    theme: createTheme({
      primaryColor: "brand",
      primaryShade: { light: 5, dark: 4 },
      white: pizzeriaPalette.white,
      black: pizzeriaPalette.black,
      defaultRadius: "xl",
      fontFamily: pizzeriaTypography.fontFamily,
      fontFamilyMonospace: pizzeriaTypography.fontFamilyMonospace,
      fontSizes: pizzeriaTypography.fontSizes,
      lineHeights: pizzeriaTypography.lineHeights,
      spacing: pizzeriaSpacing,
      headings: {
        fontFamily: pizzeriaTypography.fontFamily,
        fontWeight: "800",
        sizes: {
          h1: {
            fontSize: "var(--app-text-4xl)",
            lineHeight: "var(--app-leading-tight)",
          },
          h2: {
            fontSize: "var(--app-text-3xl)",
            lineHeight: "var(--app-leading-tight)",
          },
          h3: {
            fontSize: "var(--app-text-2xl)",
            lineHeight: "var(--app-leading-snug)",
          },
          h4: {
            fontSize: "var(--app-text-xl)",
            lineHeight: "var(--app-leading-snug)",
          },
          h5: {
            fontSize: "var(--app-text-lg)",
            lineHeight: "var(--app-leading-snug)",
          },
          h6: {
            fontSize: "var(--app-text-md)",
            lineHeight: "var(--app-leading-snug)",
          },
        },
      },
      colors: {
        brand: brandColor.palette,
        failed: pizzeriaPalette.failed,
        info: pizzeriaPalette.info,
        orange: pizzeriaPalette.orange,
        dough: pizzeriaPalette.dough,
        success: pizzeriaPalette.success,
        tomato: pizzeriaPalette.tomato,
        warning: pizzeriaPalette.warning,
      },
      components: {
        Badge: {
          defaultProps: {
            radius: "xl",
            size: "md",
            tt: "none",
          },
          styles: {
            root: {
              borderWidth: rem(1),
              fontWeight: 800,
              letterSpacing: 0,
            },
          },
        },
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
            color: "brand",
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
            color: "brand",
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
            color: "brand",
          },
        },
        Tabs: {
          defaultProps: {
            color: "brand",
            radius: "xl",
          },
        },
      },
    }),
  };
}

const defaultPizzeriaTheme = createPizzeriaTheme();

export const pizzeriaTheme = defaultPizzeriaTheme.theme;

export const pizzeriaCssVariablesResolver =
  defaultPizzeriaTheme.cssVariablesResolver;
