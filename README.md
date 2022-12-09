# TakeNews

Small web mobile application to remember to take news from friends

Uses:
- [ReactJS](https://fr.reactjs.org/)
- [TailwindCSS](https://tailwindcss.com/)
- [MUI](https://mui.com/)

Commands can be run nativelly (using Node, npm and react scripts) or using docker.

## Install

- Nativelly

    ```bash
    npm install
    ``` 

- Dockerized

    ```bash
    make build
    ```

## Development

- Nativelly

    ```bash
    npm start
    ```

- Dockerized

    ```bash
    make dev
    ```

### Formatting

- Automatic reformat:
  - Nativelly: `npm run format`
  - Dockerized: `make format`
- Static analysis (lint):
  - Nativelly: `npm run lint`
  - Dockerized: `make lint`
