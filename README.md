# HILF-MIR Berlin

This repo hosts the code for the [hilf-mir.berlin](https://www.hilf-mir.berlin/) - a website for finding psychological and health-related facilities in Berlin.


<!-- @import "[TOC]" {cmd="toc" depthFrom=2 depthTo=6 orderedList=false} -->

<!-- code_chunk_output -->

- [HILF-MIR Berlin](#hilf-mir-berlin)
  - [Tech stack](#tech-stack)
    - [Setup](#setup)
  - [Development](#development)
  - [Grist](#grist)
    - [Authentik](#authentik)
  - [Contributors](#contributors)
  - [Credits](#credits)

<!-- /code_chunk_output -->


## Tech stack

The project is built using the React framework [Next.js](https://nextjs.org/) and [TypeScript](https://www.typescriptlang.org/).
The data of the facilities is stored in a [self-hosted Grist instance](https://github.com/technologiestiftung/grist-core).
The frontend is deployed to [Vercel](https://vercel.com/) and the backend is currently running on one of our own servers. See the section [grist](#grist) for a working example of the backend.
The map is provided by [maptiler.com](https://www.maptiler.com/)



### Setup

- Copy `.env.example` to `.env` and fill in the required environment variables as per `.env.example` to connect to your Grist instance.
- Install your dependencies via `npm ci`


## Development

- Start your grist instance
- Create the tables. You can find an example sqlite database in `./docs/example.db` with test data and the right rows. 
- Install dependencies via `npm ci` 
- Create a file `.env.development.local` and/or `.env` and fill it according to `.env.example`. The environment variables will connect to your development Grist instance.
- Create fake data in your grist instance for development `npx ts-node src/scripts/createFakeGristData.ts` 
- Create your local cache. `npm run downloadCacheData` (will create json from your records under `./data/`)
- Run `npm run dev` to get a development server running at [http://localhost:3000](http://localhost:3000)

If you want to start the app with the production table data, please change the values of 
`.env.development.local` to point to the production table.

## Grist

Here is a working example of a `docker-compose.yml` to run Grist. Note that we are running this on a single node docker swarm. You might need to adjust this. Since grist has no auth built in, we use [authentik](https://goauthentik.io/) (see below) for authentication. See [this guide](https://support.getgrist.com/install/saml/#example-authentik) hon how to connect both. 

```yaml
version: "3.9"
services:
  grist:
    # even though it is bad practice to use the latest tag, we want the latest state. Last tag v0.7.9 is 4 month old. There has been so many changes since then.
    # Other possibility would be to pull latest and rename the tag to mach some versioning we can use.
    image: gristlabs/grist:latest
    restart: always
    # currently not needed with pynbox
    # once gvisor is available in grist-core we can use it
    # runtime: runsc
    ports:
      - published: 8080
        target: 80
        mode: host
    volumes:
      - grist:/persist
      - /path/to/your/custom.css:/grist/static/custom.css
    deploy:
      mode: replicated
      replicas: 1
      placement:
        constraints: [ node.role == manager ]
    environment:

      DEBUG: "1"
      PORT: 80
      APP_DOC_URL: https://$GRIST_DOMAIN
      APP_HOME_URL: https://$GRIST_DOMAIN
        # GRIST_SINGLE_ORG: docs
      GRIST_ORG_IN_PATH: $GRIST_ORG_IN_PATH
      GRIST_DOMAIN: $GRIST_DOMAIN
      # GRIST_HOST: $GRIST_DOMAIN
      # GRIST_DEFAULT_EMAIL: $GRIST_DEFAULT_EMAIL
      GRIST_EXPERIMENTAL_PLUGINS: $GRIST_EXPERIMENTAL_PLUGINS
      GRIST_SANDBOX_FLAVOR: $GRIST_SANDBOX_FLAVOR
      GRIST_SESSION_SECRET: $GRIST_SESSION_SECRET
      APP_STATIC_INCLUDE_CUSTOM_CSS: $APP_STATIC_INCLUDE_CUSTOM_CSS

      GRIST_SAML_IDP_CERTS: $GRIST_SAML_IDP_CERTS
      GRIST_SAML_SP_KEY: $GRIST_SAML_SP_KEY
      GRIST_SAML_SP_CERT: $GRIST_SAML_SP_CERT
      GRIST_SAML_IDP_LOGIN: $GRIST_SAML_IDP_LOGIN
      GRIST_SAML_IDP_LOGOUT: $GRIST_SAML_IDP_LOGOUT
      GRIST_HIDE_UI_ELEMENTS: helpCenter,billing,templates
      PYTHON_VERSION: $PYTHON_VERSION
      PYTHON_VERSION_ON_CREATION: $PYTHON_VERSION_ON_CREATION
      GRIST_FORCE_LOGIN: $GRIST_FORCE_LOGIN
      GRIST_SAML_IDP_UNENCRYPTED: $GRIST_SAML_IDP_UNENCRYPTED
      GRIST_SAML_SP_HOST: https://$GRIST_DOMAIN
      PIPE_MODE: $PIPE_MODE
      ALLOWED_WEBHOOK_DOMAINS: $ALLOWED_WEBHOOK_DOMAINS
volumes:
  grist:
```

Here is an example .env for you to use:

```plain
GRIST_DOMAIN=
GRIST_SESSION_SECRET=
GRIST_SANDBOX_FLAVOR=
GRIST_ORG_IN_PATH=
APP_DOC_URL=
APP_HOME_URL=
PYTHON_VERSION=
PYTHON_VERSION_ON_CREATION=
GRIST_SAML_IDP_LOGIN=
GRIST_SAML_IDP_LOGOUT=
GRIST_SAML_IDP_CERTS=
GRIST_SAML_SP_KEY=
GRIST_SAML_SP_CERT=
GRIST_EXPERIMENTAL_PLUGINS=
GRIST_HIDE_UI_ELEMENTS=
GRIST_FORCE_LOGIN=
GRIST_SAML_IDP_UNENCRYPTED=
GRIST_SAML_SP_HOST=
PORT=
```


### Authentik

Here is our authentik docker-compose.yml configuration.


```yaml
version: '3.4'

services:
  postgresql:
    image: docker.io/library/postgres:12-alpine
    restart: unless-stopped
    deploy:
      replicas: 1
      placement:
        constraints:
          - node.role == manager
    healthcheck:
      test:
        [
          "CMD-SHELL",
          "pg_isready -d $${POSTGRES_DB} -U $${POSTGRES_USER}"
        ]
      start_period: 20s
      interval: 30s
      retries: 5
      timeout: 5s
    volumes:
      - database:/var/lib/postgresql/data
    environment:
      - POSTGRES_PASSWORD=${PG_PASS:?database password required}
      - POSTGRES_USER=${PG_USER:-authentik}
      - POSTGRES_DB=${PG_DB:-authentik}
    # env_file:
    #   - .env
  redis:
    deploy:
      replicas: 1
      placement:
        constraints:
          - node.role == manager
    image: docker.io/library/redis:alpine
    command: --save 60 1 --loglevel warning
    restart: unless-stopped
    healthcheck:
      test: [ "CMD-SHELL", "redis-cli ping | grep PONG" ]
      start_period: 20s
      interval: 30s
      retries: 5
      timeout: 3s
    volumes:
      - redis:/data
  server:
    image: ${AUTHENTIK_IMAGE:-ghcr.io/goauthentik/server}:${AUTHENTIK_TAG:-2022.9.0}
    restart: unless-stopped
    deploy:
      replicas: 1
      placement:
        constraints:
          - node.role == manager
    command: server
    environment:

      AUTHENTIK_SECRET_KEY: $AUTHENTIK_SECRET_KEY
      AUTHENTIK_ERROR_REPORTING__ENABLED: "true"
      # ----- email
      # SMTP Host Emails are sent to
      AUTHENTIK_EMAIL__HOST: $AUTHENTIK_EMAIL__HOST
      AUTHENTIK_EMAIL__PORT: $AUTHENTIK_EMAIL__PORT
      # Optionally authenticate (don't add quotation marks to you password)
      AUTHENTIK_EMAIL__USERNAME: $AUTHENTIK_EMAIL__USERNAME
      AUTHENTIK_EMAIL__PASSWORD: $AUTHENTIK_EMAIL__PASSWORD
      # Use StartTLS
      AUTHENTIK_EMAIL__USE_TLS: $AUTHENTIK_EMAIL__USE_TLS
      # Use SSL
      AUTHENTIK_EMAIL__USE_SSL: $AUTHENTIK_EMAIL__USE_SSL
      AUTHENTIK_EMAIL__TIMEOUT: 10
      # Email address authentik will send from, should have a correct @domain
      AUTHENTIK_EMAIL__FROM: $AUTHENTIK_EMAIL__FROM

      GEOIPUPDATE_ACCOUNT_ID: $GEOIPUPDATE_ACCOUNT_ID
      GEOIPUPDATE_LICENSE_KEY: $GEOIPUPDATE_LICENSE_KEY
      AUTHENTIK_AUTHENTIK__GEOIP: /geoip/GeoLite2-City.mmdb

      AUTHENTIK_PORT_HTTP: 9004
      AUTHENTIK_PORT_HTTPS: 9444
      AUTHENTIK_TAG: 2022.9.0
      AUTHENTIK_REDIS__HOST: redis
      AUTHENTIK_POSTGRESQL__HOST: postgresql
      AUTHENTIK_POSTGRESQL__USER: ${PG_USER:-authentik}
      AUTHENTIK_POSTGRESQL__NAME: ${PG_DB:-authentik}
      AUTHENTIK_POSTGRESQL__PASSWORD: ${PG_PASS}
      # AUTHENTIK_ERROR_REPORTING__ENABLED: "true"
    volumes:
      - media:/media
      - custom-templates:/templates
      - geoip:/geoip
    # env_file:
    #   - .env
    ports:
      - published: 9004
        target: 9000

        mode: host
      - published: 9444
        target: 9443

        mode: host
      # - "0.0.0.0:${AUTHENTIK_PORT_HTTP:-9004}:9000"
      # - "0.0.0.0:${AUTHENTIK_PORT_HTTPS:-9444}:9443"
  worker:
    image: ${AUTHENTIK_IMAGE:-ghcr.io/goauthentik/server}:${AUTHENTIK_TAG:-2022.9.0}
    restart: unless-stopped
    command: worker
    deploy:
      replicas: 1
      placement:
        constraints:
          - node.role == manager
    environment:
      AUTHENTIK_SECRET_KEY: $AUTHENTIK_SECRET_KEY
      AUTHENTIK_ERROR_REPORTING__ENABLED: "true"
      # ----- email
      # SMTP Host Emails are sent to
      AUTHENTIK_EMAIL__HOST: $AUTHENTIK_EMAIL__HOST
      AUTHENTIK_EMAIL__PORT: $AUTHENTIK_EMAIL__PORT
      # Optionally authenticate (don't add quotation marks to you password)
      AUTHENTIK_EMAIL__USERNAME: $AUTHENTIK_EMAIL__USERNAME
      AUTHENTIK_EMAIL__PASSWORD: $AUTHENTIK_EMAIL__PASSWORD
      # Use StartTLS
      AUTHENTIK_EMAIL__USE_TLS: $AUTHENTIK_EMAIL__USE_TLS
      # Use SSL
      AUTHENTIK_EMAIL__USE_SSL: $AUTHENTIK_EMAIL__USE_SSL
      AUTHENTIK_EMAIL__TIMEOUT: ${AUTHENTIK_EMAIL__TIMEOUT:-10}
      # Email address authentik will send from, should have a correct @domain
      AUTHENTIK_EMAIL__FROM: $AUTHENTIK_EMAIL__FROM

      GEOIPUPDATE_ACCOUNT_ID: $GEOIPUPDATE_ACCOUNT_ID
      GEOIPUPDATE_LICENSE_KEY: $GEOIPUPDATE_LICENSE_KEY
      AUTHENTIK_AUTHENTIK__GEOIP: /geoip/GeoLite2-City.mmdb

      AUTHENTIK_PORT_HTTP: 9004
      AUTHENTIK_PORT_HTTPS: 9444
      AUTHENTIK_TAG: 2022.9.0
      AUTHENTIK_REDIS__HOST: redis
      AUTHENTIK_POSTGRESQL__HOST: postgresql
      AUTHENTIK_POSTGRESQL__USER: ${PG_USER:-authentik}
      AUTHENTIK_POSTGRESQL__NAME: ${PG_DB:-authentik}
      AUTHENTIK_POSTGRESQL__PASSWORD: ${PG_PASS}
      # AUTHENTIK_ERROR_REPORTING__ENABLED: "true"
      # This is optional, and can be removed. If you remove this, the following will happen
      # - The permissions for the /media folders aren't fixed, so make sure they are 1000:1000
      # - The docker socket can't be accessed anymore
    user: root
    volumes:
      - media:/media
      - certs:/certs
      - /var/run/docker.sock:/var/run/docker.sock
      - custom-templates:/templates
      - geoip:/geoip
    # env_file:
    #   - .env
  geoipupdate:
    deploy:
      replicas: 1
      placement:
        constraints:
          - node.role == manager
    image: "maxmindinc/geoipupdate:latest"
    volumes:
      - "geoip:/usr/share/GeoIP"
    environment:
      GEOIPUPDATE_EDITION_IDS: "GeoLite2-City"
      GEOIPUPDATE_FREQUENCY: "8"
      GEOIPUPDATE_ACCOUNT_ID: $GEOIPUPDATE_ACCOUNT_ID
      GEOIPUPDATE_LICENSE_KEY: $GEOIPUPDATE_LICENSE_KEY
    # env_file:
    #   - .env

volumes:
  database:
    driver: local
  redis:
    driver: local
  geoip:
    driver: local
  media:
    driver: local
  certs:
    driver: local
  custom-templates:
    driver: local

```

And the .env for authentik.

```plain
PG_PASS=
AUTHENTIK_SECRET_KEY=
AUTHENTIK_ERROR_REPORTING__ENABLED=

# ----- email

# SMTP Host Emails are sent to
AUTHENTIK_EMAIL__HOST=
AUTHENTIK_EMAIL__PORT=
# Optionally authenticate (don't add quotation marks to you password)
AUTHENTIK_EMAIL__USERNAME=
AUTHENTIK_EMAIL__PASSWORD=
# Use StartTLS
AUTHENTIK_EMAIL__USE_TLS=
# Use SSL
AUTHENTIK_EMAIL__USE_SSL=
AUTHENTIK_EMAIL__TIMEOUT=
# Email address authentik will send from, should have a correct @domain
AUTHENTIK_EMAIL__FROM=

GEOIPUPDATE_ACCOUNT_ID=
GEOIPUPDATE_LICENSE_KEY=
AUTHENTIK_AUTHENTIK__GEOIP=

AUTHENTIK_PORT_HTTP=
AUTHENTIK_PORT_HTTPS=
AUTHENTIK_TAG= 
```

## Contributors

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tbody>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/dnsos"><img src="https://avatars.githubusercontent.com/u/15640196?v=4?s=64" width="64px;" alt="Dennis Ostendorf"/><br /><sub><b>Dennis Ostendorf</b></sub></a><br /><a href="https://github.com/technologiestiftung/wegweiser-frontend/commits?author=dnsos" title="Code">💻</a> <a href="#design-dnsos" title="Design">🎨</a> <a href="https://github.com/technologiestiftung/wegweiser-frontend/commits?author=dnsos" title="Documentation">📖</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://vogelino.com"><img src="https://avatars.githubusercontent.com/u/2759340?v=4?s=64" width="64px;" alt="Lucas Vogel"/><br /><sub><b>Lucas Vogel</b></sub></a><br /><a href="https://github.com/technologiestiftung/wegweiser-frontend/commits?author=vogelino" title="Code">💻</a> <a href="#design-vogelino" title="Design">🎨</a> <a href="https://github.com/technologiestiftung/wegweiser-frontend/commits?author=vogelino" title="Documentation">📖</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://fabianmoronzirfas.me/"><img src="https://avatars.githubusercontent.com/u/315106?v=4?s=64" width="64px;" alt="Fabian Morón Zirfas"/><br /><sub><b>Fabian Morón Zirfas</b></sub></a><br /><a href="https://github.com/technologiestiftung/wegweiser-frontend/commits?author=ff6347" title="Code">💻</a> <a href="#data-ff6347" title="Data">🔣</a> <a href="#infra-ff6347" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a></td>
      <td align="center" valign="top" width="14.28%"><a href="http://www.awsm.de/"><img src="https://avatars.githubusercontent.com/u/434355?v=4?s=64" width="64px;" alt="Ingo Hinterding"/><br /><sub><b>Ingo Hinterding</b></sub></a><br /><a href="#content-Esshahn" title="Content">🖋</a> <a href="https://github.com/technologiestiftung/wegweiser-frontend/pulls?q=is%3Apr+reviewed-by%3AEsshahn" title="Reviewed Pull Requests">👀</a> <a href="#mentoring-Esshahn" title="Mentoring">🧑‍🏫</a></td>
    </tr>
  </tbody>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!

## Credits

<table>
  <tr>
    <td>
      <a src="https://citylab-berlin.org/de/start/">
        <br />
        <br />
        <img width="200" src="https://logos.citylab-berlin.org/logo-citylab-berlin.svg" />
      </a>
    </td>
    <td>
      A project by: <a src="https://www.technologiestiftung-berlin.de/">
        <br />
        <br />
        <img width="150" src="https://logos.citylab-berlin.org/logo-technologiestiftung-berlin-de.svg" />
      </a>
    </td>
    <td>
      Supported by: <a src="https://www.berlin.de/">
        <br />
        <br />
        <img width="120" src="https://logos.citylab-berlin.org/logo-berlin.svg" />
      </a>
    </td>
  </tr>
</table>