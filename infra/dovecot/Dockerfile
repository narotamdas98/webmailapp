FROM debian:bullseye-slim

# Install dovecot and postgresql client
RUN apt-get update && \
    apt-get install -y dovecot-core dovecot-imapd dovecot-pgsql postgresql-client && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Create vmail user
RUN groupadd -g ${VMAIL_GID:-5000} vmail && \
    useradd -u ${VMAIL_UID:-5000} -g vmail -s /bin/false -d /var/mail/vhosts vmail

# Create mail directories
RUN mkdir -p /var/mail/vhosts && \
    chown -R vmail:vmail /var/mail/vhosts

# Copy configuration files
COPY dovecot.conf /etc/dovecot/dovecot.conf
COPY dovecot-sql.conf.ext /etc/dovecot/dovecot-sql.conf.ext

# Create entrypoint script
RUN echo '#!/bin/bash\n\
    set -e\n\
    \n\
    # Wait for postgres to be ready\n\
    echo "Waiting for postgres..."\n\
    while ! pg_isready -h $MAIL_DB_HOST -p 5432 -U $MAIL_DB_USER; do\n\
    sleep 1\n\
    done\n\
    echo "Postgres is ready!"\n\
    \n\
    # Start dovecot\n\
    exec dovecot -F' > /entrypoint.sh && \
    chmod +x /entrypoint.sh

EXPOSE 143

CMD ["/entrypoint.sh"]
