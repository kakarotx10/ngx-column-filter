# Library Conversion Guide

This guide explains how to convert this Angular application into a publishable npm library.

## Step 1: Generate Angular Library

Use Angular CLI to generate a library workspace:

```bash
ng generate library column-filter --prefix=lib
```

This will create:
- `projects/column-filter/` - The library project
- Update `angular.json` with library configuration

## Step 2: Move Source Files

Move the following files to the library project:

```
src/app/components/column-filter/  →  projects/column-filter/src/lib/components/column-filter/
src/app/lib/models/                →  projects/column-filter/src/lib/models/
src/app/lib/utils/                 →  projects/column-filter/src/lib/utils/
```

## Step 3: Update Library Public API

The library's public API is defined in `projects/column-filter/src/public-api.ts`:

```typescript
/*
 * Public API Surface of column-filter
 */

export * from './lib/components/column-filter/column-filter.component';
export * from './lib/components/column-filter/column-filter.module';
export * from './lib/models/filter.models';
export * from './lib/utils/column-filter.utils';
```

## Step 4: Update Package Configuration

Update `projects/column-filter/package.json`:

```json
{
  "name": "@your-org/column-filter",
  "version": "1.0.0",
  "description": "A reusable Angular column filter component",
  "keywords": ["angular", "filter", "column", "table", "data-table"],
  "author": "Your Name",
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "https://github.com/your-org/column-filter.git"
  },
  "peerDependencies": {
    "@angular/common": "^14.0.0 || ^15.0.0 || ^16.0.0 || ^17.0.0 || ^18.0.0 || ^19.0.0 || ^20.0.0 || ^21.0.0",
    "@angular/core": "^14.0.0 || ^15.0.0 || ^16.0.0 || ^17.0.0 || ^18.0.0 || ^19.0.0 || ^20.0.0 || ^21.0.0",
    "@angular/forms": "^14.0.0 || ^15.0.0 || ^16.0.0 || ^17.0.0 || ^18.0.0 || ^19.0.0 || ^20.0.0 || ^21.0.0"
  }
}
```

## Step 5: Build the Library

Build the library for production:

```bash
ng build column-filter --configuration production
```

This generates the distributable files in `dist/column-filter/`.

## Step 6: Test the Library Locally

Before publishing, test the library locally:

```bash
# Build the library
ng build column-filter

# In your test project, install locally
npm install ../column-filter-library/dist/column-filter
```

## Step 7: Publish to npm

Once tested:

```bash
cd dist/column-filter
npm publish
```

Or publish with scoped package:

```bash
npm publish --access public
```

## Folder Structure for Library

```
projects/column-filter/
├── src/
│   ├── lib/
│   │   ├── components/
│   │   │   └── column-filter/
│   │   │       ├── column-filter.component.ts
│   │   │       ├── column-filter.component.html
│   │   │       ├── column-filter.component.scss
│   │   │       └── column-filter.module.ts
│   │   ├── models/
│   │   │   └── filter.models.ts
│   │   └── utils/
│   │       └── column-filter.utils.ts
│   └── public-api.ts
├── ng-package.json
└── package.json
```

## Additional Considerations

### Styling

Make sure SCSS files are properly bundled. Update `ng-package.json`:

```json
{
  "$schema": "../../node_modules/ng-packagr/ng-package.schema.json",
  "dest": "../../dist/column-filter",
  "lib": {
    "entryFile": "src/public-api.ts",
    "styleIncludePaths": ["src/styles"]
  }
}
```

### Documentation

- Update README.md with installation and usage
- Add CHANGELOG.md for version history
- Add CONTRIBUTING.md for contributors

### Testing

Consider adding:
- Unit tests using Jasmine/Karma
- Integration tests
- Example usage in the main app

### CI/CD

Set up:
- GitHub Actions for automated testing
- Automated publishing on version tags
- Semantic versioning

## Version Management

Follow semantic versioning (semver):
- `MAJOR.MINOR.PATCH` (e.g., 1.0.0)
- MAJOR: Breaking changes
- MINOR: New features (backward compatible)
- PATCH: Bug fixes (backward compatible)

## Publishing Checklist

- [ ] All tests pass
- [ ] README is up to date
- [ ] Version number is updated
- [ ] CHANGELOG is updated
- [ ] Build succeeds without errors
- [ ] Library works in a test application
- [ ] Package.json is correctly configured
- [ ] License file is included