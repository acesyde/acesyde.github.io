---
title: "Get mise.toml Autocomplete in Zed"
publishDate: 2026-07-02T00:00:00+02:00
description: "A quick tip to get schema-backed autocomplete and validation for your mise.toml files in the Zed editor using the TOML and Tombi extensions."
tags: ["mise", "zed", "devops"]
---

If you've adopted [`mise`](/posts/2025/04/how-we-use-mise-at-work-part-1) and made the switch to [Zed](https://zed.dev), here's a quick tip to get schema-backed autocomplete and validation for your `mise.toml` files right inside the editor.

## 🧩 The steps

1. Install the **TOML** and **Tombi** extensions in Zed.
2. Create the file `~/.config/tombi/config.toml`.
3. Add the following configuration:

```toml
[schema]
enabled = true

# Associate all mise config files with the correct schema
[[schemas]]
path = "https://mise.jdx.dev/schema/mise.json"
include = [
  "**/mise.toml",
  "**/mise.*.toml",          # mise.local.toml, mise.<env>.toml, mise.windows.toml, ...
  "**/.mise.toml",
  "**/.mise.*.toml",         # dotfile variants
  "**/mise/config.toml",
  "**/.mise/config.toml",
  "**/.config/mise.toml",
  "**/.config/mise/config.toml",
  "**/.config/mise/conf.d/*.toml",
]
```

Those globs cover every location `mise` recognizes: `mise.toml` / `.mise.toml`, `mise.local.toml`, environment-specific (`mise.production.toml`) and platform-specific (`mise.macos-arm64.toml`) variants, the `mise/config.toml` and `.config/mise/` layouts, plus the `conf.d/*.toml` drop-ins.

## ✅ The payoff

Reload Zed and open any `mise.toml`. You now get key completion, inline documentation, and validation as you type—no more guessing whether it's `[tools]` or `[tasks]`, or which fields a task accepts.

## 📚 References

- [mise configuration paths](https://mise.jdx.dev/configuration.html#mise-toml)
- [Tombi — TOML language server](https://tombi-toml.github.io/tombi/)
- [Tombi — schema configuration](https://tombi-toml.github.io/tombi/docs/configuration#schema)
