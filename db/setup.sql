-- Schema do banco de dados StokFácil
-- Tabela de produtos para controle de estoque de mercados e lojas.

DROP TABLE IF EXISTS produtos;
CREATE TABLE produtos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    categoria TEXT NOT NULL,
    quantidade INTEGER NOT NULL DEFAULT 0,
    preco REAL NOT NULL DEFAULT 0.0,
    alerta_minimo INTEGER NOT NULL DEFAULT 0,
    criado_em DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Dados iniciais de exemplo
INSERT INTO produtos (nome, categoria, quantidade, preco, alerta_minimo) VALUES
('Arroz Tipo 1', 'mercearia', 24, 6.90, 10),
('Detergente 500ml', 'limpeza', 8, 4.80, 6),
('Cerveja Pilsen', 'bebidas', 42, 3.50, 12),
('Sabonete Neutro', 'higiene', 14, 2.40, 8),
('Macarrão Espaguete', 'mercearia', 18, 5.20, 7);

-- Consultas úteis
-- 1. Produtos com estoque baixo
SELECT *
FROM produtos
WHERE quantidade <= alerta_minimo;

-- 2. Total em estoque por categoria
SELECT categoria,
       SUM(quantidade) AS total_unidades,
       SUM(quantidade * preco) AS valor_total
FROM produtos
GROUP BY categoria;

-- 3. Buscar produto por nome
SELECT *
FROM produtos
WHERE nome LIKE '%Arroz%';
