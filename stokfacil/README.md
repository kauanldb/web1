# StokFácil

Este diretório contém um site de controle de estoque em HTML/CSS/JS e exemplos de back-end em Java e C++.

## Estrutura

- `index.html` - interface web moderna de controle de estoque
- `style.css` - estilos do site
- `script.js` - lógica do inventário para o front-end
- `img/` - ícones e ilustrações vetoriais
- `backend-java/` - aplicativo Java de exemplo para controle de estoque
- `backend-cpp/` - aplicativo C++ de exemplo para controle de estoque
- `backend-csharp/` - aplicativo C# de exemplo que acessa o SQLite local
- `backend-js/` - backend JavaScript de exemplo usando SQLite local

## Executar o site

Abra `stokfacil/index.html` no navegador.

## Executar em Java

No diretório `stokfacil/backend-java`:

```bash
javac StockItem.java StockManager.java
java StockManager
```

## Executar em C++

No diretório `stokfacil/backend-cpp`:

```bash
g++ stock_manager.cpp -o stock_manager
./stock_manager
```

## Executar em C#

No diretório `stokfacil/backend-csharp`:

```bash
dotnet run
```

> O projeto C# usa `Microsoft.Data.Sqlite` para abrir o banco local em `db/stock.db`.

## Executar em JavaScript

No diretório `stokfacil/backend-js`:

```bash
npm install
npm run list
```

Comandos adicionais:

```bash
npm run lowstock
npm run summary
```

> O backend JavaScript acessa o mesmo banco SQLite local em `db/stock.db`.

## Exemplo em SQL

O banco de dados foi criado fora do diretório público do site, em `db/stock.db`.

No diretório `db` você encontra:
- `setup.sql` com o schema e dados iniciais
- `stock.db` o arquivo SQLite local
- `manage_db.py` para iniciar e consultar o banco
- `README.md` com instruções de uso seguro

No diretório `stokfacil/backend-sql` você encontra um arquivo `schema.sql` com:
- criação da tabela `produtos`
- inserções de exemplo
- consultas para estoque baixo, valor por categoria e busca por nome

## Comandos adicionais

Java:
- `categoria <nome>` - filtra por categoria
- `buscar <texto>` - busca por nome do produto

C++:
- `./stock_manager categoria <nome>`
- `./stock_manager buscar <texto>`
