# TakeNews

Small web mobile application to remember to take news from friends

Uses:
- [ReactJS](https://fr.reactjs.org/)
- [TailwindCSS](https://tailwindcss.com/)
- [MUI](https://mui.com/)

Commands can be run nativelly (using Node, npm and react scripts) or using docker.

## Install

| Nativelly | Dockerized |
| --------- | ---------- |
| `npm install` | `make docker_build` |

## Generation of a production-ready source code

| Nativelly | Dockerized |
| --------- | ---------- |
| `npm run build` | `make build` |

## Development

| Nativelly | Dockerized |
| --------- | ---------- |
| `npm start` | `make dev` |

### Formatting

- Automatic reformat:

    | Nativelly | Dockerized |
    | --------- | ---------- |
    | `npm run format` | `make format` |

- Static analysis (lint):

    | Nativelly | Dockerized |
    | --------- | ---------- |
    | `npm run lint` | `make lint` |
