# ERC20 Token transfers

## Getting started

Application that enables you to send ERC20 tokens on Ethereum. It only works on Ropsten test network for now.
You need to have a [metamask](https://metamask.io/) installed in order to interact with the app.

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

### Installation & running locally

It's recommended to use node v16.10.0, if you'r a [nvm](https://github.com/nvm-sh/nvm) user, simply run `nvm use` inside the project.

Install all dependencies:

```sh
yarn install
```

Run the app locally:

```sh
yarn dev
```

## Contributing

### Creating a PR

All code should be submitted through PRs and approved by at least one code owner. Code owners are
listed in the [CODEOWNERS](.github/CODEOWNERS) file. When creating a PR, follow the PR template and
provide whatever information is required for people to understand the why, what and how of your
changes.

### Conventional commits

We use [conventional commits](https://www.conventionalcommits.org) to keep our commits readable, but
also to automatically handle our release flow and generate changelogs in the future.

## Deployment

TBD

### Pushing to a branch

The following happens when a commit is pushed to a branch other than master:

1.  Dependencies are installed.
1.  Linter is run.
1.  Branch version of the app is deployed via Vercel

### Pushing/merging to master

App is automatically deployed to: https://rpsls-sigma.vercel.app/
