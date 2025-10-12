import { vars } from "nativewind";

type Theme = "main" | "neon";

const themeValues: Record<Theme, Record<string, string>> = {
  main: {
    "--ned-primary": "0 239 209",
    "--ned-secondary": "42 170 244",
    "--ned-info": "255 173 96",
    "--ned-warning": "250 166 255",
    "--ned-danger": "229 83 129",
    "--ned-background": "10 10 10",
    "--ned-background-secondary": "23 23 23",
    "--ned-muted": "115 115 115" /* neutral-600 */,
    "--ned-inverse": "255 255 255" /* white */,
    "--ned-text": "255 255 255",
    "--ned-text-secondary": "150 150 150",
    "--ned-text-muted": "100 100 100",
    "--ned-text-inverse": "10 10 10",
  },
  neon: {
    "--ned-primary": "0 239 209",
    "--ned-secondary": "42 170 244",
    "--ned-info": "255 173 96",
    "--ned-warning": "250 166 255",
    "--ned-danger": "229 83 129",
    "--ned-background": "10 10 10",
    "--ned-background-secondary": "20 20 20",
    "--ned-muted": "115 115 115" /* neutral-600 */,
    "--ned-inverse": "255 255 255" /* white */,
    "--ned-text": "255 255 255",
    "--ned-text-secondary": "100 100 100",
    "--ned-text-muted": "50 50 50",
    "--ned-text-inverse": "10 10 10",
  },
};

const themes = {
  main: vars(themeValues.main),
  neon: vars(themeValues.neon),
};

export { themes, themeValues };

export default themes;
