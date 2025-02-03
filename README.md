# GitHub Explorer

# Solution

## Start && access application

- To start application execute following commands in project's directory
  - `npm install`
  - `ng serve`
- Application should be accessible via **http://localhost:4200**

## Design

- Application is divided into 2 main sections:
  - Header with "logo", title and "logout" button to reset Token (only visible on Repositories and Repository routes)
  - Main content according to current route
- There are 3 routes available
  - `/` - is used to provide GitHub API Token (default route)
  - `/repositories` - list of public repositories
  - `/:owner/:name` - list issues of selected repository with basic information
  - using any other route causes redirection to default `/` one

## Features

- Verify validity of GitHub API Token
- List of public GitHub repositories sorted by start count
- Repository information with list of its issues sorted by date

## Libraries

Solution is using following 3rd party libraries (on top of the latest Angular 19):

- PrimeNG - to create unified design for UI components
- Tailwind CSS - to simplify usage of basic CSS classes
- NgRx - for state management
- Apollo - for GraphQL requests

## TODO

TODOs:

- Add error handling (e.g. for GraphQL resuests)
- Improve unit tests
- Add E2E tests
- Implement more advanced RWD
- Add application configuration for better handling multiple environments (staging/integration/production/etc.)

## Default documentation

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.1.3.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Jest](https://jestjs.io/) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
