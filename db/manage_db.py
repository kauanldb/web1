#!/usr/bin/env python3
import sqlite3
import sys
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
DB_PATH = BASE_DIR / 'stock.db'
SQL_PATH = BASE_DIR / 'setup.sql'


def init_database():
    if SQL_PATH.exists():
        with sqlite3.connect(DB_PATH) as conn:
            with SQL_PATH.open('r', encoding='utf-8') as script:
                conn.executescript(script.read())
        print(f'Banco de dados criado ou atualizado: {DB_PATH}')
    else:
        print('Arquivo setup.sql não encontrado.')


def query_database(query, params=()):
    with sqlite3.connect(DB_PATH) as conn:
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        cursor.execute(query, params)
        return cursor.fetchall()


def list_products():
    rows = query_database('SELECT * FROM produtos ORDER BY id;')
    for row in rows:
        print(f"{row['id']:>2} | {row['nome']:<25} | {row['categoria']:<10} | {row['quantidade']:>3} | R$ {row['preco']:.2f} | alerta {row['alerta_minimo']}")


def low_stock():
    rows = query_database('SELECT * FROM produtos WHERE quantidade <= alerta_minimo;')
    print('Produtos em estoque baixo:')
    for row in rows:
        print(f"- {row['nome']} ({row['quantidade']} unidades, alerta {row['alerta_minimo']})")


def category_summary():
    rows = query_database(
        'SELECT categoria, SUM(quantidade) AS total_unidades, SUM(quantidade * preco) AS valor_total FROM produtos GROUP BY categoria;'
    )
    for row in rows:
        print(f"{row['categoria']}: {row['total_unidades']} unidades | R$ {row['valor_total']:.2f}")


def print_help():
    print('''Uso: python3 manage_db.py [comando]

Comandos:
  init            Cria ou atualiza o banco de dados local
  list            Lista todos os produtos
  lowstock        Mostra produtos com estoque baixo
  summary         Mostra resumo por categoria
  help            Exibe esta ajuda
''')


if __name__ == '__main__':
    if len(sys.argv) < 2 or sys.argv[1] == 'help':
        print_help()
        sys.exit(0)

    command = sys.argv[1].lower()
    if command == 'init':
        init_database()
    elif command == 'list':
        list_products()
    elif command == 'lowstock':
        low_stock()
    elif command == 'summary':
        category_summary()
    else:
        print('Comando desconhecido.')
        print_help()
