---
title: "The Journey from Makefiles to Mise: Transforming Our Development Workflow"
date: 2025-04-20T00:00:00+02:00
tags: ["mise", "work", "devops"]
categories: ["work", "devops"]
showToc: false
cover:
  image: "mise.png"
  alt: "Mise"
  title: "Mise"
  relative: false
---

## Reduce your boilerplate

As I said in my [previous posts](/posts/2025/04/how-we-use-mise-at-work-part-1), we have moved from makefiles and bash scripts to `Mise`.
Now we will see together how we have implemented step by step a complete solution to share your taks between your projects and speed up new projects and the ability to use the same tasks between differente environments like the developer laptop and the CICD.

## How tasks work in mise

In `mise` you hve a lot of possibilities to create and manage your tasks, we have decided to mix them and to use the best part of them.

The first possibility is the [TOML task](https://mise.jdx.dev/tasks/toml-tasks.html) based, basically you describe your task in a toml file like this

```toml
[tasks.serve]
description = "Serve the site"
run = "hugo serve"
```

Using this is fine but if you want to do more things you're quickly limited

For that you can use [file tasks](https://mise.jdx.dev/tasks/file-tasks.html)

File tasks are easy to use because you can write them in the interpreted language you want

We hve choosen the `bash` why ? because previously we have writtern our scripts into bash and makefiles, so we just have to copy / past the previous content to our tasks.

```bash
#!/usr/bin/env bash
#MISE description="Serve the site"

hugo serve
```

## In the real world

So now we have all necessary information to move forward and I will share with how we do it in our company.

### Centralized repository

We have created a centralize repository to be able to share these tasks with all projects, we also decided to create a specific project structure.

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

As you can see we have decided to split our tasks by group like (aws, azure, etc...)

We also decide to add in each group a `check-prerequisites` like this

```bash
#!/usr/bin/env bash
#MISE description="✅ Check prerequisites for aws"

set -e

if ! command -v aws &> /dev/null; then
    echo "❌ Aws CLI is not installed"
    exit 1
fi
```

And we use it in the `login` script like this

```bash
#!/usr/bin/env bash
#MISE description="🔑 Login to AWS"
#MISE depends=["aws:check-prerequisites"]

set -e

if [ -z "$AWS_PROFILE" ]; then
  echo "AWS_PROFILE env variable is not set"
  exit 1
fi

echo "🔑 Login to AWS..."

aws sso login --profile $AWS_PROFILE
```

You can also see a `download-tasks` and that's our angular stone of this repository and i will share it with you

```bash
#!/usr/bin/env bash
#MISE description="📥 Download and install tasks"
#USAGE arg "<version>" help="Version of the tasks to download and install"
#USAGE arg "<tasks>" help="List of tasks to download and install (comma separated)"
#USAGE flag "-d --directory <directory>" help="Directory where tasks will be installed `shared_tasks` by default"

# Variables
REPO_URL="git@github.com:owner/mise-shared-tasks.git"
TMP_DIR=$(mktemp -d)
TASK_DIR="${usage_directory:-shared-tasks}"
TASKS=${usage_tasks}
VERSION=${usage_version}

# Information
echo "========================================================================================================================"
echo "Downloading tasks from $REPO_URL"
echo "Repo version: $VERSION"
echo "Installing tasks in $TASK_DIR"
echo "Tasks to install: $TASKS"
echo "========================================================================================================================"

# Check if tasks_dir exists and delete it if it does
if [ -d "$TASK_DIR" ]; then
    echo "🧹 Cleaning tasks directory"
    rm -rf "$TASK_DIR"
fi

# Create the tasks directory
echo "📁 Creating tasks directory"
mkdir -p "$TASK_DIR"

# Clone the repository into the temporary directory
echo "📥 Cloning repository"
git clone "$REPO_URL" "$TMP_DIR" --branch "$VERSION" --depth 1 > /dev/null 2>&1

# Split the USAGE_TASKS variable into an array
IFS=',' read -r -a TASK_ARRAY <<< "$TASKS"

# Copy each directory from the temporary directory to the shared directory
for TASK in "${TASK_ARRAY[@]}"; do
  if [ -d "$TMP_DIR/shared-tasks/$TASK" ]; then
    cp -r "$TMP_DIR/shared-tasks/$TASK" "$TASK_DIR/"
    echo "🖨️ Copied $TASK to $TASK_DIR"
  else
    echo "🚨 Directory $TASK does not exist in the repository."
  fi
done

# Create a gitignore content of the tasks directory
echo "🤷 Creating .gitignore file"
cat <<EOF > "$TASK_DIR/.gitignore"
# Ignore all files in the tasks directory
*
# Except for the .gitignore file
!.gitignore
EOF

# Clean the temporary directory
echo "🧹 Cleaning temporary directory"
rm -rf "$TMP_DIR"
```

This script will download tasks from this repository and copy them into you project repository.
You will use the <branch>/<tag> to have immutable tasks shared between repositories and you also have the ability to select only a subset of tasks.

### Project repository

As I said previously we can consume easily these shared tasks and it's pretty easy

In your `mise.toml` you will add 2 new tasks

```toml
[task_config]
includes = ["shared-tasks", "tasks"]

[tasks.download-shared-tasks]
description = "Download shared tasks"
hide = true
file = "git::ssh://git@github.com:owner/mise-tasks.git//shared-tasks/download-tasks?ref=<branch/tag>"

[tasks.apply-shared-tasks]
description = "📩 Download shared tasks in the current workspace"
wait_for = "download-shared-tasks"
run = "mise download-shared-tasks <branch/tag> aws,terraform,terragrunt"
```

And it's enough you are ready to use you shared tasks.

Just execute

```shell
mise apply-shared-tasks
```

And in your project you have now your shared and versioned tasks.

## 📚 References & Next Steps

- [Remote tasks](https://mise.jdx.dev/tasks/toml-tasks.html#remote-tasks)