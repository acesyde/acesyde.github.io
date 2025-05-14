---
title: "How We Use Mise and DevContainers to Simplify Development"
description: "Discover how we leverage Microsoft DevContainers and Mise to streamline our development workflow, ensuring consistency and automation."
date: 2025-04-19T14:00:00+02:00
tags: ["mise", "work", "devops"]
categories: ["work", "devops"]
---

In our development team, consistency and automation are essential. Here's how we use Microsoft DevContainers and the fantastic `mise` tool to streamline tooling and environment setup. The combination of both provides a clean, reliable, and reproducible workflow that scales with the team.

## DevContainers and Mise ❤️

Using Microsoft DevContainers has significantly improved our development workflow by offering consistent environments across different machines. They make onboarding faster and smoother, especially for new team members, by encapsulating all dependencies and tools. However, one of the trade-offs is the added complexity introduced by layered features like Dockerfile extensions and Compose setups. These layers can sometimes obscure what's really happening under the hood, making debugging and customization more challenging.

To help manage this complexity, we've introduced Mise into our stack. Mise has simplified the tooling aspect of our development setup by handling all runtime versions through a single, unified interface. By offloading tool and language version management from the container itself, we reduce complexity and gain more transparency and control over our environment.

## 📦 Generate a DevContainer Configuration with Mise

Once `mise` is installed, you can leverage it to generate a DevContainer configuration. This feature is particularly useful for creating a consistent development environment across different machines or team members.

### Basic Usage

Navigate to your project directory and run:

```shell
mise generate devcontainer
```

This command will generate a `.devcontainer/devcontainer.json` file with default settings.

### Customizing the DevContainer

You can customize the generated DevContainer by using various flags:

- Specify a Name: Assign a custom name to your DevContainer.

```shell
mise generate devcontainer --name my-project
```

- Choose a Base Image: Define the Docker image to use.

```shell
mise generate devcontainer --image node:18
```

- Mount mise Data Volume: Bind the mise data volume to the DevContainer.

```shell
mise generate devcontainer --mount-mise-data
```

By using the `mise` data volume, you can share tools and runtimes across multiple DevContainers, drastically reducing redundant downloads and conserving disk space on your machine.

## 💼 Real World Example

### 🛠️ Example `mise.toml`

Here's a basic `mise.toml` file we include in our project root to define the tools and their versions:

```toml
[tools]
pre-commit = "4.2"
python = "3.13"
```

This file tells `mise` exactly which versions to use for each tool, ensuring consistency across environments.

### 📁 Example `devcontainer.json`

Here's a complete sample configuration that we use in our company. It brings together the benefits of DevContainers, mise features, and volume mounts to create a powerful and reusable setup:

```json
{
  "name": "my-project",
  "image": "mcr.microsoft.com/devcontainers/base:ubuntu-24.04",
  "features": {
    "ghcr.io/devcontainers-extra/features/mise:1": {}
  },
  "customizations": {
    "vscode": {
      "extensions": ["hverlin.mise-vscode"]
    }
  },
  "mounts": [
    {
      "source": "mise-data-volume",
      "target": "/mnt/mise-data",
      "type": "volume"
    },
    {
      "source": "${localEnv:HOME}${localEnv:USERPROFILE}/.ssh",
      "target": "/home/vscode/.ssh",
      "type": "bind"
    }
  ],
  "containerEnv": {
    "MISE_DATA_DIR": "/mnt/mise-data"
  },
  "remoteEnv": {
    "PATH": "${containerEnv:PATH}:/mnt/mise-data/shims"
  },
  "postCreateCommand": ".devcontainer/scripts/postCreate.sh",
  "postStartCommand": ".devcontainer/scripts/postStart.sh"
}
```

This setup uses a shared mise data volume for tool caching, mounts your SSH keys for convenience, and hooks into container lifecycle events with custom scripts. It's a solid foundation for scalable and consistent development environments.

### 🧩 Example `postCreate.sh` Script

Here's an example of a `postCreate.sh` script we use to finalize container setup and ensure proper permissions:

```bash
#!/usr/bin/env bash
set -e

#------------------------------
# FUNCTIONS
#------------------------------
print_command() {
    local message=$1
    local icon=$2
    echo -e "\e[34m»»» $icon \e[32m$message\e[0m ..."
}

MISE=$(which mise)

if [ -z "$MISE" ]; then
  print_command "Mise is not installed. Please install Mise before running this script." "❌"
  exit 1
fi

#------------------------------
# Permissions
#------------------------------

print_command "Setting up permissions..." "🔧"
sudo chown -R vscode:vscode /mnt/mise-data
print_command "Permissions are set up!" "✅"
```

This script ensures that the mise data directory is writable by the vscode user inside the container, which avoids permission issues when installing or using tools.

### 🧩 Example `postStart.sh` Script

Here's the `postStart.sh` script we use to complete environment configuration and setup once the container is running:

```bash
#!/usr/bin/env bash
set -e

#------------------------------
# FUNCTIONS
#------------------------------
print_command() {
    local message=$1
    local icon=$2
    echo -e "\e[34m»»» $icon \e[32m$message\e[0m ..."
}

#------------------------------
# MISE
#------------------------------
MISE=$(which mise)

if [ -z "$MISE" ]; then
    echo "Mise is not installed. Please install Mise before running this script."
    exit 1
fi

print_command "Configuring Mise..." "🔧"

$MISE trust
echo "eval $($MISE activate bash)" >> ~/.bashrc
echo "eval $($MISE activate zsh)" >> ~/.zshrc

print_command "Mise is configured!" "✅"

print_command "Setting up Mise environment..." "🚀"

$MISE i

print_command "Mise environment is set up!" "✅"

# Get tools
GIT=$(which git)

#------------------------------
# PRE COMMIT
#------------------------------
print_command "Configuring pre-commit..." "🔧"

$MISE exec -- pre-commit install --install-hooks
$MISE exec -- pre-commit install --hook-type commit-msg

print_command "Pre-commit is configured!" "✅"

#------------------------------
# CONFIGURE ENV
#------------------------------
print_command "Configuring environment..." "🔧"

$GIT config --global pull.rebase false

print_command "Environment is configured!" "✅"
```

This script not only activates mise in supported shells, but also installs project tools, sets up pre-commit hooks, and adjusts global Git settings—wrapping up your container boot process with a clean and ready-to-code environment.

## 💡 Tips and tricks

### 🔌 PATH configuration for VS Code extensions

Many VS Code extensions require access to CLI tools but don't always expose configuration options for custom tool paths. This critical setting ensures extensions can find and use tools managed by Mise:

```json
"remoteEnv": {
  "PATH": "${containerEnv:PATH}:/mnt/mise-data/shims"
}
```

This configuration extends the container's PATH environment variable to include Mise's shims directory, allowing extensions to seamlessly use your project's specific tool versions.

## 📚 References & Next Steps

- [Mise Documentation](https://mise.jdx.dev)
- [DevContainers Documentation](https://containers.dev)
- Explore [custom features for DevContainers](https://github.com/devcontainers/feature-starter)