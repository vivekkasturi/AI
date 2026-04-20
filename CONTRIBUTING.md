# Contributing

## Branch Workflow

Use these branches consistently:

- `main`: stable branch with approved, releasable features
- `develop`: integration branch that collects feature work before release
- `feature/<name>`: short-lived branches for each new feature

## Daily Flow

1. Start from `develop`.
2. Create a new feature branch.
3. Build and validate the feature on that branch.
4. Open a pull request from the feature branch into `develop`.
5. After `develop` is validated, merge `develop` into `main`.

## Example Commands

```bash
git switch develop
git pull origin develop
git switch -c feature/my-new-feature
```

When the feature is ready:

```bash
git push -u origin feature/my-new-feature
```

Then open a pull request with:

- base branch: `develop`
- compare branch: `feature/my-new-feature`

## Release Flow

Only merge into `main` from `develop`.

That keeps:

- `main` as the clean branch with released features
- `develop` as the latest integrated branch
- feature branches focused on one change at a time
