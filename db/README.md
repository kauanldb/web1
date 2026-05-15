# Banco de dados local StokFácil

Este diretório contém o banco de dados local que deve ser mantido fora da zona pública do site.

## Objetivo

- `stock.db` fica armazenado aqui em `db/`
- não deve ser servido como arquivo estático no site
- apenas você pode acessar o banco localmente no seu computador

## Como iniciar

No diretório `db`:

```bash
python3 manage_db.py init
```

Isso criará o arquivo `stock.db` com a estrutura e dados iniciais.

## Comandos úteis

```bash
python3 manage_db.py list
python3 manage_db.py lowstock
python3 manage_db.py summary
```

## Segurança local

- mantenha `db/stock.db` fora do diretório público do site
- não adicione `db/stock.db` a um servidor web público
- se quiser, use um firewall ou servidor local que escute apenas em `localhost`
