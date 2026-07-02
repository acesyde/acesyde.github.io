---
title: "Sharing Tasks with Mise - How We Standardize and Scale Across Projects"
publishDate: 2025-04-20T00:00:00+02:00
description: "How we share versioned mise tasks across projects and CI with a centralized repository and a download-tasks script for consistent tooling."
tags: ["mise", "work", "devops"]
coverImage:
  src: ./mise-part3-banner.webp
  alt: "Sharing Tasks with Mise"
---

## 🧼 Reduce your boilerplate

As mentioned in [Part 1](/posts/2025/04/how-we-use-mise-at-work-part-1), we've moved away from Makefiles and bash scripts in favor of `mise`. In this final post of the series, I'll walk you through how we've taken things further by sharing tasks across projects and environments—speeding up onboarding and keeping things consistent between dev machines and CI/CD.

## ⚙️ How tasks work in `mise`

`mise` offers multiple ways to define and run tasks. After experimenting, we've decided to use a mix of both TOML-based and file-based tasks to get the best of both worlds.

### TOML-based tasks

The most straightforward way is to define tasks directly in your `mise.toml` using the [TOML format](https://mise.jdx.dev/tasks/toml-tasks.html):

```toml
[tasks.serve]
description = "Serve the site"
run = "hugo serve"
```

That's easy and declarative—but if you need more logic or control, it gets limiting fast.

### File-based tasks

For more flexibility, we use [file tasks](https://mise.jdx.dev/tasks/file-tasks.html). These are regular scripts that live in files. You can use any scripting language, but we've chosen to stick with `bash`. Why? Because a lot of our previous tooling was already in bash and Makefiles, so migrating was mostly a copy-paste job.

Example:

```bash
#!/usr/bin/env bash
#MISE description="Serve the site"

hugo serve
```

## 💼 In the real world

Now that we’ve got the basics down, let’s look at how we’ve applied this setup in our actual day-to-day work.

### 📦 Centralized task repository

To encourage reusability, we created a centralized repository with a clear structure for all shared tasks:

```shell
.
├── shared-tasks
│   ├── download-tasks
│   ├── aws
│   │   ├── check-prerequisites
│   │   └── login
│   ├── azure
│   ├── docker
│   ├── poetry
│   ├── precommit
│   ├── python
│   ├── rust
│   ├── terraform
│   └── terragrunt
└── tasks
    └── lint
```

We grouped related tasks (e.g. `aws`, `azure`, etc.) into folders and added a standard `check-prerequisites` task in each group to ensure required tools are installed.

Example:

```bash
#!/usr/bin/env bash
#MISE description="✅ Check prerequisites for aws"

set -e

if ! command -v aws &> /dev/null; then
    echo "❌ AWS CLI is not installed"
    exit 1
fi
```

Then, other tasks in that group can declare a dependency on this check:

```bash
#!/usr/bin/env bash
#MISE description="🔑 Login to AWS"
#MISE depends=["aws:check-prerequisites"]

set -e

if [ -z "$AWS_PROFILE" ]; then
  echo "AWS_PROFILE env variable is not set"
  exit 1
fi

echo "🔑 Logging in to AWS..."
aws sso login --profile $AWS_PROFILE
```

### 📥 The `download-tasks` script

The backbone of our shared task system is a special script: `download-tasks`. Think of it as our little automation butler—it fetches selected task groups from the shared repository and installs them in your local project directory.

Here’s why it’s a game-changer:

- ✅ **Versioning**: Tasks are pulled from a specific tag or branch, ensuring consistency across teams and CI environments.
- 📦 **Selective installation**: You only download what you need. This keeps your project tidy and avoids unnecessary bloat.
- 🔄 **Reproducibility**: By pinning the task version, your tasks won’t suddenly change under your feet.
- 🧹 **Clean environment**: The script deletes and re-creates the target folder every time, so you’re always working with a fresh copy.
- 🧩 **Plug-and-play**: Once tasks are in place, `mise` recognizes them immediately. No need for extra config.

Let’s look at the script:

```bash
#!/usr/bin/env bash
#MISE description="📥 Download and install tasks"
#USAGE arg "<version>" help="Version of the tasks to download and install"
#USAGE arg "<tasks>" help="List of tasks to download and install (comma separated)"
#USAGE flag "-d --directory <directory>" help="Directory where tasks will be installed (default: shared-tasks)"

REPO_URL="git@github.com:owner/mise-shared-tasks.git"
TMP_DIR=$(mktemp -d)
TASK_DIR="${usage_directory:-shared-tasks}"
TASKS=${usage_tasks}
VERSION=${usage_version}

# Info
echo "========================================================================================================================"
echo "Downloading tasks from $REPO_URL"
echo "Repo version: $VERSION"
echo "Installing tasks in $TASK_DIR"
echo "Tasks to install: $TASKS"
echo "========================================================================================================================"

# Clean existing tasks
if [ -d "$TASK_DIR" ]; then
    echo "🧹 Cleaning tasks directory"
    rm -rf "$TASK_DIR"
fi

# Create tasks directory
echo "📁 Creating tasks directory"
mkdir -p "$TASK_DIR"

# Clone repo
echo "📥 Cloning repository"
git clone "$REPO_URL" "$TMP_DIR" --branch "$VERSION" --depth 1 > /dev/null 2>&1

# Copy selected tasks
IFS=',' read -r -a TASK_ARRAY <<< "$TASKS"

for TASK in "${TASK_ARRAY[@]}"; do
  if [ -d "$TMP_DIR/shared-tasks/$TASK" ]; then
    cp -r "$TMP_DIR/shared-tasks/$TASK" "$TASK_DIR/"
    echo "🖨️ Copied $TASK to $TASK_DIR"
  else
    echo "🚨 Directory $TASK does not exist in the repository."
  fi
done

# Add .gitignore
echo "🤷 Creating .gitignore file"
cat <<EOF > "$TASK_DIR/.gitignore"
*
!.gitignore
EOF

# Cleanup
echo "🧹 Cleaning temporary directory"
rm -rf "$TMP_DIR"
```

This simple but powerful tool ensures that all your teams, tools, and pipelines speak the same language—without requiring everyone to reinvent the wheel.

### 📁 Project integration

Using the shared tasks in your own project is easy. Just update your `mise.toml` like this:

```toml
[task_config]
includes = ["shared-tasks", "tasks"]

[tasks.download-shared-tasks]
description = "Download shared tasks"
hide = true
file = "git::ssh://git@github.com/owner/mise-tasks.git//shared-tasks/download-tasks?ref=<branch/tag>"

[tasks.apply-shared-tasks]
description = "📩 Download shared tasks in the current workspace"
wait_for = "download-shared-tasks"
run = "mise download-shared-tasks <branch/tag> aws,terraform,terragrunt"
```

Then simply run:

```shell
mise apply-shared-tasks
```

And voilà—you've got consistent, versioned, ready-to-use tasks in your project.

## 📚 References & Next Steps

- [Remote tasks](https://mise.jdx.dev/tasks/toml-tasks.html#remote-tasks)
