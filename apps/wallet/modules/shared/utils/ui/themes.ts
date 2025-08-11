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
  }),
};

export default themes;
