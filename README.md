# ligth-novel-kindle-integration

To install dependencies:

```bash
bun install
```

To run:

```bash
bun  dev
```

#### This project for automate my scrapping for light novels in -> tsundoku.com.br


### Steps

#### Set Env files

```bash

TEMP_FILE_DIR=./temp
KINDLE_EMAIL=
RESEND_API_SECRET_KEY=
RESENT_FROM_EMAIL=

```


##### Send to Urls to post Route


```curl
http POST :3333/files/import < ./file.json 
```

```json
// file.json

{
  "urls": [
    "https://tsundoku.com.br/mushoku-tensei-reencarnacao-do-desempregado-vol-22-cap-02-as-desgracas-de-randolph/"
  ]
}


```
