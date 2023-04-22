## Установка зависимостей

```sh
# используя node 18
npm i -g pnpm
pnpm i
```

## Запуск отладочной версии

```sh
pnpm dev
```

Открыть <http://localhost:5173/>

## Сборка и запуск продакшен версии

```sh
pnpm build
pnpm start
```

Открыть <http://localhost:4173/>

## Выкладка на Github pages

Ветка мастер автоматически собирается и выкладывается на <https://ilyasemenov.github.io/tinkoff-solutioncup-frontend/>

## Настройка IDE

### Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).

### Type Support For `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin) to make the TypeScript language service aware of `.vue` types.
