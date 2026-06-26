FROM postgis/postgis:16-3.4

# Install pgvector build dependencies and build pgvector
RUN apt-get update && apt-get install -y --no-install-recommends \
    postgresql-server-dev-16 \
    build-essential \
    git \
    && git clone --branch v0.7.0 https://github.com/pgvector/pgvector.git /tmp/pgvector \
    && cd /tmp/pgvector \
    && make \
    && make install \
    && apt-get purge -y --auto-remove build-essential git postgresql-server-dev-16 \
    && rm -rf /var/lib/apt/lists/* /tmp/pgvector
