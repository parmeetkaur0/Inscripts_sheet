# Inscripts Sheet

A spreadsheet-like web application built with **React**, **TypeScript**, **Vite**, and **Tailwind CSS**.  
It features editable tables, import/export (CSV), column/row management, search, filtering, and more.

## Features

- Editable spreadsheet table with keyboard navigation
- Add, remove, and hide columns/rows
- Import/export data as CSV (using [PapaParse](https://www.papaparse.com/))
- Search and filter data
- Sort columns
- Format cells (text, number, currency)
- Tabbed views for different statuses
- Responsive and modern UI with Tailwind CSS

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or newer recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation

```sh
git clone https://github.com/yourusername/inscripts-sheet.git
cd inscripts-sheet
npm install
```

### Development

Start the development server:

```sh
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build

To build for production:

```sh
npm run build
```

### Linting

To run ESLint:

```sh
npm run lint
```

## Project Structure

```
src/
  App.tsx           # Main app logic
  components/       # UI components (Table, Toolbar, TopBar, TitleTabs)
  data/mockData.ts  # Example/mock data
  assets/           # Static assets
  index.css         # Tailwind CSS entry
  App.css           # App-specific styles
```

## Customization

- **Table columns and data**: See [`src/data/mockData.ts`](src/data/mockData.ts)
- **UI components**: See [`src/components/`](src/components/)
- **ESLint/Prettier config**: See [`eslint.config.js`](eslint.config.js), [`.prettierrc`](.prettierrc)

## License

MIT

---

Made with ❤️ using [Vite](https://vitejs.dev/), [React](https://react.dev/), and [Tailwind CSS](https://tailwindcss.com/).