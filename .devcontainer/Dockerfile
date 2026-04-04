FROM php:8.4-cli-bookworm

ARG NODE_VERSION=24

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates \
    curl \
    git \
    gnupg \
    unzip \
    libicu72 \
    libzip4 \
    libicu-dev \
    libzip-dev \
    sqlite3 \
    libsqlite3-dev \
    sudo \
    && rm -rf /var/lib/apt/lists/*

# Standard extensions
RUN docker-php-ext-install bcmath intl zip pcntl pdo_sqlite

# Install Composer
COPY --from=composer:2 /usr/bin/composer /usr/local/bin/composer

# Install Node.js
RUN curl -fsSL https://deb.nodesource.com/setup_${NODE_VERSION}.x | bash - \
    && apt-get install -y nodejs \
    && rm -rf /var/lib/apt/lists/*

# Create a non-root user for development
ARG USERNAME=vscode
ARG USER_UID=1000
ARG USER_GID=$USER_UID

RUN groupadd --gid $USER_GID $USERNAME \
    && useradd --uid $USER_UID --gid $USER_GID -m $USERNAME \
    && echo $USERNAME ALL=\(root\) NOPASSWD:ALL > /etc/sudoers.d/$USERNAME \
    && chmod 0440 /etc/sudoers.d/$USERNAME

USER $USERNAME
WORKDIR /workspaces/saturno
