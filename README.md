WARJ-10: Adicionado Sprint-1 para inicialiação do projeto
# Nuxt Starter Template

[![Nuxt UI](https://img.shields.io/badge/Made%20with-Nuxt%20UI-00DC82?logo=nuxt&labelColor=020420)](https://ui.nuxt.com)

Use this template to get started with [Nuxt UI](https://ui.nuxt.com) quickly.

- [Live demo](https://starter-template.nuxt.dev/)
- [Documentation](https://ui.nuxt.com/docs/getting-started/installation/nuxt)

## Quick Start

```bash
npm install
```

```bash
npm run dev
```
Start the development server on `http://localhost:3000`:

## Lint:

To view only the errors
```bash
npm run lint
```

To fix the errors automatically
```bash
npm run lint:fix
```
# 📘 Guia de Padronização — Warj-Group (Frontend)

Este guia estabelece as normas de contribuição para manter a **qualidade** e a **rastreabilidade** entre o YouTrack e o GitHub.

---

## 🧾 1. Padrão de Mensagens de Commit

As mensagens devem seguir o formato: `{tipo}/{id_yt}: Descrição`


### 🔹 Componentes

- **tipo**: Natureza da alteração (veja tabela abaixo)
- **id_yt**: ID da tarefa no YouTrack (ex: `WARJ-1`)
  - Para alterações globais em branches protegidas, use:
    - `main`
    - `sprint-X`
- **Descrição**: Resumo claro e objetivo do que foi feito

---

### 🧩 Tipos Permitidos

| Tipo      | Descrição                                              |
|----------|--------------------------------------------------------|
| feat     | Nova funcionalidade                                    |
| fix      | Correção de bug                                        |
| doc      | Alteração em documentação                              |
| style    | Formatação/estilo (sem mudança de lógica)              |
| refactor | Refatoração de código                                  |
| test     | Adição ou atualização de testes                        |
| chore    | Manutenção, builds, configs ou bibliotecas             |
| ci       | Alterações em pipelines de integração contínua         |

---

### ✅ Exemplo
`feat/WARJ-1: Inicializado repositório frontend com Nuxt 3`


---

## 🌿 2. Padrão de Branches

Branches de trabalho devem seguir o formato:
`{tipo}/{id_yt}-descricao-breve`


### 🔹 Prefixos permitidos

- `feature/`
- `hotfix/`
- `release/`

### 🔹 Branches de integração

- `main` → produção  
- `sprint-X` → desenvolvimento

---

### ✅ Exemplo
`feature/WARJ-1-organize-documentation`


---

## ⚙️ 3. Configuração Automática

O projeto utiliza:

- **Husky**
- **Commitlint**

Essas ferramentas validam automaticamente os commits antes de serem realizados.

### 🚫 Importante

Se o padrão não for seguido:

- O commit será bloqueado
- Um guia de correção será exibido no terminal

---

## 🛠️ 4. Como Configurar (Novos Membros)

### 🪟 Windows

Execute: setup-warj.bat


---

### 🐧 Linux / 🍎 Mac / Git Bash

Execute: bash setup-warj.sh
