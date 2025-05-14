---
title: "The Journey from Makefiles to Mise: Transforming Our Development Workflow"
description: "Discover how we transitioned from Makefiles and bash scripts to Mise, revolutionizing our development process."
pubDate: 2025-04-19T00:00:00+02:00
tags: ["mise", "work", "devops"]
categories: ["work", "devops"]
---

## Reflecting on Our Legacy: Makefiles and Bash Scripts

For many years, Makefiles and bash scripts were the faithful workhorses of our development process. They efficiently automated our tasks, were well-understood by developers, and did the job reliably, day in and day out. Whether it was setting up development environments or automating builds, these familiar tools were the backbone of our workflows.

However, as our organization expanded, our trusty old tools began showing signs of strain:

- **Repository Explosion**: Each new repository came with its own Makefile and bash scripts. Maintaining uniformity across numerous repositories became increasingly complex and time-consuming.
- **CI/CD Complexity**: Our Jenkins pipelines required multiple specialized build agents. This created a cumbersome process of:
  - Maintaining various agent images
  - Resolving frequent tool-version conflicts
  - Regularly updating and versioning the agent environments
  - Ensuring essential tools were always available and consistent
- **Onboarding Challenges**: New developers often found themselves bogged down by our customized Makefile conventions and complex scripts, slowing their integration and productivity.

It became clear—we needed a modern solution.

## Discovering Mise: 🚀 A Game-Changer!

During the 2024 winter vacation, I stumbled upon Mise—it felt like opening the perfect gift 🎁. Mise instantly addressed challenges we'd faced for years and simplified our workflow tremendously.

Here’s why we embraced Mise:

- **Unified Development Environment 🌐**
  - Clearly documented tasks
  - Consistent, reproducible environments
  - Flawless Linux and macOS compatibility
  - Eliminates "it works on my machine" frustrations

- **Streamlined CI/CD Integration 🔄**
  - No more specialized build agents
  - Simple, unified tool management
  - Built-in versioning of tools
  - Seamless alignment between local and CI/CD setups

- **Improved Developer Experience 💡**
  - Intuitive and easy-to-learn tasks
  - Quick onboarding for new team members
  - Excellent documentation of setups and tools
  - Automatic management of tool installations

- **Easy Maintenance 🛠️**
  - Single version source for tools across projects
  - Easy updates across repositories
  - Built-in support for multiple languages
  - Thriving community-driven plugins

## The Positive Impact of Mise

Switching to Mise has been transformative. We now enjoy a smoother workflow, fewer compatibility headaches, and simplified maintenance. Our CI/CD pipelines are simpler, and both new and seasoned developers become productive faster.

## Ready to Try Mise?

If Mise sounds like the solution you've been waiting for, I highly encourage you to give it a try. Explore the [official Mise getting started guide](https://mise.jdx.dev/getting-started.html) to experience firsthand how Mise can simplify and enhance your development workflow.



