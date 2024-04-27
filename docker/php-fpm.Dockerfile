FROM php:8.1-fpm

# Arguments defined in docker-compose.yml
ARG user
ARG uid

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    libzip-dev \
    zip \
    unzip \
    libpq-dev \
    && pecl install xdebug \
    && docker-php-ext-enable xdebug \
    && docker-php-ext-install soap


RUN docker-php-ext-install pdo_mysql pdo_pgsql mbstring exif pcntl bcmath gd zip soap

# Clear cache
RUN apt-get clean && rm -rf /var/lib/apt/lists/*

RUN echo "php_admin_value[post_max_size] = 1600M" >> /usr/local/etc/php-fpm.d/www.conf && \
    echo "php_admin_value[upload_max_filesize] = 1600M" >> /usr/local/etc/php-fpm.d/www.conf && \
    echo "php_admin_value[memory_limit] = 160000M" >> /usr/local/etc/php-fpm.d/www.conf

RUN echo "php_admin_value[max_execution_time] = 11200" >> /usr/local/etc/php-fpm.d/www.conf && \
    echo "php_admin_value[max_input_time] = 11200" >> /usr/local/etc/php-fpm.d/www.conf

# Get latest Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Create system user to run Composer and Artisan Commands
RUN useradd -G www-data,root -u $uid -d /home/$user $user
RUN mkdir -p /home/$user/.composer && \
    chown -R $user:$user /home/$user


# Set working directory
WORKDIR /var/www

USER $user
