import { vars } from "nativewind";
import { pickBy } from "remeda";

type Theme = "main" | "neon";

const themeValues: Record<Theme, Record<string, string | string[]>> = {
  main: {
    "--ned-primary": "0 239 209",
    "--ned-secondary": "42 170 244",
    "--ned-info": "255 173 96",
    "--ned-warning": "250 166 255",
    "--ned-danger": "229 83 129",
    "--ned-background": "25 25 25",
    "--ned-background-secondary": "40 40 40",
    "--ned-muted": "115 115 115" /* neutral-600 */,
    "--ned-inverse": "255 255 255" /* white */,
    "--ned-text": "255 255 255",
    "--ned-text-secondary": "150 150 150",
    "--ned-text-muted": "100 100 100",
    "--ned-text-inverse": "20 20 20",
    "background-gradient": ["#00ACEA", "rgba(10, 10, 10, 0)"],
  },
  neon: {
    "--ned-primary": "0 239 209",
    "--ned-secondary": "42 170 244",
    "--ned-info": "255 173 96",
    "--ned-warning": "250 166 255",
    "--ned-danger": "229 83 129",
    "--ned-background": "10 10 10",
    "--ned-background-secondary": "20 20 20",
    "--ned-muted": "115 115 115",
    "--ned-inverse": "255 255 255",
    "--ned-text": "255 255 255",
    "--ned-text-secondary": "100 100 100",
    "--ned-text-muted": "50 50 50",
    "--ned-text-inverse": "10 10 10",
  },
};

type ThemeVariable = Record<`--${string}`, string | number>;

const filterClasses = (value: string | string[], key: string) =>
  typeof value === "string" && key.startsWith("--ned-");

const themes = {
  main: vars(pickBy(themeValues.main, filterClasses) as ThemeVariable),
  neon: vars(pickBy(themeValues.neon, filterClasses) as ThemeVariable),
};

export { themes, themeValues };

export default themes;
