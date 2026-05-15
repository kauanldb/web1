const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');

const dbFile = path.resolve(__dirname, '..', '..', 'db', 'stock.db');

if (!fs.existsSync(dbFile)) {
  console.error('Arquivo de banco não encontrado:', dbFile);
  console.error('Execute `python3 manage_db.py init` no diretório db/ para criar o banco.');
  process.exit(1);
}

const db = new sqlite3.Database(dbFile, sqlite3.OPEN_READONLY, (err) => {
  if (err) {
    console.error('Erro ao abrir o banco de dados:', err.message);
    process.exit(1);
  }
});

const command = process.argv[2] || 'list';

function printProducts() {
  db.all('SELECT id, nome, categoria, quantidade, preco, alerta_minimo FROM produtos ORDER BY id', [], (err, rows) => {
    if (err) {
      console.error(err.message);
      return;
    }

    console.log('Produtos cadastrados:');
    rows.forEach((row) => {
      console.log(`${row.id.toString().padStart(2, ' ')} | ${row.nome.padEnd(26)} | ${row.categoria.padEnd(10)} | Qtde: ${row.quantidade.toString().padStart(3, ' ')} | Preço: R$ ${row.preco.toFixed(2)} | Alerta: ${row.alerta_minimo}`);
    });
  });
}

function printLowStock() {
  db.all('SELECT nome, quantidade, alerta_minimo FROM produtos WHERE quantidade <= alerta_minimo ORDER BY quantidade ASC', [], (err, rows) => {
    if (err) {
      console.error(err.message);
      return;
    }

    console.log('Produtos com estoque baixo:');
    rows.forEach((row) => {
      console.log(`- ${row.nome} (${row.quantidade} unidades, alerta ${row.alerta_minimo})`);
    });
  });
}

function printSummary() {
  db.get('SELECT COUNT(*) AS total_produtos, SUM(quantidade) AS total_unidades, SUM(quantidade * preco) AS valor_total, SUM(CASE WHEN quantidade <= alerta_minimo THEN 1 ELSE 0 END) AS alerta_count FROM produtos', [], (err, row) => {
    if (err) {
      console.error(err.message);
      return;
    }

    console.log('Resumo do estoque:');
    console.log(`- Produtos cadastrados: ${row.total_produtos}`);
    console.log(`- Unidades em estoque: ${row.total_unidades}`);
    console.log(`- Valor estimado: R$ ${row.valor_total.toFixed(2)}`);
    console.log(`- Produtos em alerta: ${row.alerta_count}`);
  });
}

switch (command.toLowerCase()) {
  case 'lowstock':
    printLowStock();
    break;
  case 'summary':
    printSummary();
    break;
  case 'list':
  default:
    printProducts();
    break;
}

db.close();
