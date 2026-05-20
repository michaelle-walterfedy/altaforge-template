# @altaforge-ui/themes

## Setup

1. Configure `.npmrc` with a Personal Access Token (PAT) with **read and write** permissions for npm packages in Azure DevOps.

2. Then install dependencies:

```bash
npm install
```

## Development

GitHub Actions CI/CD is not set up yet (due to `.npmrc` authentication requirements). Please run quality checks manually before committing:

```bash
make format    # Format code
make lint      # Lint and auto-fix
make typecheck # Type check
make build     # Build the project
```

## Publish

1. Increment the version in `package.json`.

2. Once merged with dev, build the package and publish:

```bash
make build
npm publish
```

## Package exports

- `altaforge-ui/themes` – Radix theme and layout components
- `altaforge-ui/charts` – Chart.js setup and types
- `altaforge-ui/components` – Custom UI components (DataVisualCard, DatePicker, DateRangePicker, MultiSelect, StatCard)

Example:

```ts
import { Theme } from "altaforge-ui/themes";
import "altaforge-ui/themes/styles.css";
import "altaforge-ui/components/styles.css";
import { DatePicker, DateRangePicker, MultiSelect, StatCard, DataVisualCard, DataGrid } from "altaforge-ui/components";
```

### Peer dependencies

Install these alongside `altaforge-ui`:

```bash
npm install @radix-ui/themes @radix-ui/react-icons react react-dom
# For charts:
npm install chart.js react-chartjs-2
# For DataGrid:
npm install ag-grid-community@^35.0.0 ag-grid-react@^35.0.0
```

## Custom components

We use Storybook to locally develop and test components. You can start Storybook by running:

```bash
npm run storybook
```

You can view the components in the browser at `http://localhost:6006`.

You can also edit the components in the `src/components` directory.