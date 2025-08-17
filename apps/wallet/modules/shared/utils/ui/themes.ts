import { vars } from "nativewind";

type Theme = "main" | "neon";

const themes: Record<Theme, ReturnType<typeof vars>> = {
  main: vars({
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
    "--ned-text-secondary": "200 200 200",
    "--ned-text-muted": "150 150 150",
    "--ned-text-inverse": "10 10 10",
  }),
  neon: vars({
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
    "--ned-text-secondary": "200 200 200",
    "--ned-text-muted": "150 150 150",
    "--ned-text-inverse": "10 10 10",
  }),
};

export default themes;
