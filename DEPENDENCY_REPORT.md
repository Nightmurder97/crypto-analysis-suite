# Dependency Report for Crypto Analysis Suite

This report details the versions of core development tools, globally installed npm packages, and project-specific dependencies for the Crypto Analysis Suite.

## 1. System-Wide Tool Versions

* **Python:** `Python 3.12.9`
* **Conda:** `conda 25.1.1`
* **npm:** `10.8.2`

## 2. Global npm Packages

The following npm packages are installed globally on your system:

* `corepack@0.29.3`
* `eslint@9.30.1`
* `exa-mcp-server@0.3.10`
* `npm@10.8.2`
* `prettier@3.6.2`
* `typescript@5.8.3`
* `vite@6.3.5`

## 3. Conda Environments

The following Conda environments were detected on your system:

* `base` (`/opt/miniconda3`)
* `portfolio` (`/opt/miniconda3/envs/portfolio`)

To inspect the dependencies within a specific Conda environment, you can activate it and then use `conda list` or `pip list`. For example:

```bash
conda activate portfolio
conda list
```

## 4. Project-Specific Dependencies

### 4.1. `crypto-analysis-suite` Project (`./package.json`)

**Dependencies:**

* `@google/generative-ai`: ^0.21.0
* `@tanstack/react-query`: ^5.17.9
* `chart.js`: ^4.5.0
* `d3`: ^7.8.5
* `papaparse`: ^5.5.3
* `react`: ^18.2.0
* `react-chartjs-2`: ^5.3.0
* `react-dom`: ^18.2.0
* `react-markdown`: ^9.1.0
* `remark-gfm`: ^4.0.1
* `xlsx`: ^0.18.5
* `zustand`: ^4.4.7

**DevDependencies:**

* `@types/d3`: ^7.4.3
* `@types/papaparse`: ^5.3.16
* `@types/react`: ^18.2.43
* `@types/react-dom`: ^18.2.17
* `@typescript-eslint/eslint-plugin`: ^6.14.0
* `@typescript-eslint/parser`: ^6.14.0
* `@vitejs/plugin-react`: ^4.2.1
* `autoprefixer`: ^10.4.16
* `eslint`: ^8.55.0
* `eslint-plugin-react-hooks`: ^4.6.0
* `eslint-plugin-react-refresh`: ^0.4.5
* `postcss`: ^8.4.32
* `tailwindcss`: ^3.4.0
* `typescript`: ^5.2.2
* `vite`: ^5.0.8

### 4.2. `gemini-cli` Project (`./gemini-cli/package.json`)

**DevDependencies:**

* `@types/micromatch`: ^4.0.9
* `@types/mime-types`: ^2.1.4
* `@types/minimatch`: ^5.1.2
* `@types/shell-quote`: ^1.7.5
* `@vitest/coverage-v8`: ^3.1.1
* `concurrently`: ^9.2.0
* `cross-env`: ^7.0.3
* `esbuild`: ^0.25.0
* `eslint`: ^9.24.0
* `eslint-config-prettier`: ^10.1.2
* `eslint-plugin-import`: ^2.31.0
* `eslint-plugin-license-header`: ^0.8.0
* `eslint-plugin-react`: ^7.37.5
* `eslint-plugin-react-hooks`: ^5.2.0
* `glob`: ^10.4.5
* `globals`: ^16.0.0
* `json`: ^11.0.0
* `lodash`: ^4.17.21
* `memfs`: ^4.17.2
* `prettier`: ^3.5.3
* `react-devtools-core`: ^4.28.5
* `typescript-eslint`: ^8.30.1
* `vitest`: ^3.2.4
* `yargs`: ^17.7.2
