# NPM Publishing Guide

## Prerequisites

1. Create an npm account at [npmjs.com](https://www.npmjs.com/)
2. Login to npm from your terminal:
   ```bash
   npm login
   ```

## Publishing Steps

### 1. Build the Library

```bash
npm run build
```

### 2. Update Version (if needed)

Update the version in `package.json`:
- Patch: `1.0.0` → `1.0.1` (bug fixes)
- Minor: `1.0.0` → `1.1.0` (new features)
- Major: `1.0.0` → `2.0.0` (breaking changes)

### 3. Publish to NPM

```bash
npm publish --access public
```

Or use the npm script:
```bash
npm run publish:npm
```

## Package Structure

The published package will include:
- `dist/` - Built library files
- `README.md` - Main documentation
- `DOCUMENTATION.md` - Complete documentation
- `USAGE_EXAMPLES.md` - Usage examples
- `LICENSE` - MIT License
- `package.json` - Package metadata

## After Publishing

Users can install your package:

```bash
npm install ngx-column-filter-popup
```

And use it:

```typescript
import { ColumnFilterComponent } from 'ngx-column-filter-popup';
import { applyColumnFilter } from 'ngx-column-filter-popup';
```

## Updating the Package

1. Make your changes
2. Update version in `package.json`
3. Run `npm run build`
4. Run `npm publish --access public`

## Notes

- Make sure you're logged into npm (`npm whoami`)
- The package name is `ngx-column-filter-popup`
- Since it's not a scoped package, you don't need `--access public` flag
- Always test locally before publishing
