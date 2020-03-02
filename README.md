# Sport Calendar

## Brief

A simple weekly calendar interface, wrapping the following data structure:

```ts
type FetchData = {
  success: boolean;
  data: {
    days: string[];
    availability: {
      [name: string]: number[];
    };
  };
};
```

## Implementation

A web app written in React in the Typescript dialect.
Libraries used:

- `create-react-app`
- `react-big-calendar`
- `axios`
- `moment`
- React hooks

## Execution

- Deployed a `create-react-app` typescript template and stripped to barebone (2 min)
- added the basic hooks and started fiddling with the data structure to best map to a convenient updated data structure (20 min)
- adding `react-big-calendar` and scraping the library source because documentation is inexistent to find the right props to edit and provide (30 min)
- styling (10 min)
- documenting (30 min)

## Requisites

- node
- yarn/npm

You can download the dependencies by running: `yarn` or `npm install`
You can run the project by running: `yarn start` or `npm run start`.

The project will open at localhost:3000.

## Improvements

- I'd add responsive UI, improved UX, better fonts, loaders, UI testing, a storybook, export useful as library
- The pastebin provided have rightfully CORS problems, provide a mock backend service or add the task of mocking backend data
