using System;
using System.IO;
using Microsoft.Data.Sqlite;

var dbPath = Path.Combine(AppContext.BaseDirectory, "..", "..", "..", "..", "..", "db", "stock.db");
var normalizedPath = Path.GetFullPath(dbPath);

Console.WriteLine("=== StokFácil C# - Acesso ao banco SQLite local ===");
Console.WriteLine($"Usando arquivo de banco: {normalizedPath}");

if (!File.Exists(normalizedPath))
{
    Console.WriteLine("Arquivo de banco não encontrado. Execute 'python3 manage_db.py init' em db/ antes.");
    return;
}

using var connection = new SqliteConnection($"Data Source={normalizedPath}");
connection.Open();

ListProducts(connection);
Console.WriteLine();
PrintSummary(connection);

static void ListProducts(SqliteConnection connection)
{
    Console.WriteLine("\nProdutos cadastrados:");
    using var command = connection.CreateCommand();
    command.CommandText = "SELECT id, nome, categoria, quantidade, preco, alerta_minimo FROM produtos ORDER BY id;";

    using var reader = command.ExecuteReader();
    while (reader.Read())
    {
        var id = reader.GetInt64(0);
        var nome = reader.GetString(1);
        var categoria = reader.GetString(2);
        var quantidade = reader.GetInt32(3);
        var preco = reader.GetDouble(4);
        var alerta = reader.GetInt32(5);

        Console.WriteLine($"{id,2} | {nome,-26} | {categoria,-10} | Qtde: {quantidade,3} | Preço: R$ {preco,6:F2} | Alerta: {alerta}");
    }
}

static void PrintSummary(SqliteConnection connection)
{
    using var command = connection.CreateCommand();
    command.CommandText = @"
        SELECT
            COUNT(*) AS total_produtos,
            SUM(quantidade) AS total_unidades,
            SUM(quantidade * preco) AS total_valor,
            SUM(CASE WHEN quantidade <= alerta_minimo THEN 1 ELSE 0 END) AS produtos_alerta
        FROM produtos;";

    using var reader = command.ExecuteReader();
    if (reader.Read())
    {
        var totalProdutos = reader.GetInt64(0);
        var totalUnidades = reader.GetInt64(1);
        var totalValor = reader.GetDouble(2);
        var produtosAlerta = reader.GetInt64(3);

        Console.WriteLine("Resumo do estoque:");
        Console.WriteLine($"- Produtos cadastrados: {totalProdutos}");
        Console.WriteLine($"- Unidades em estoque: {totalUnidades}");
        Console.WriteLine($"- Valor estimado: R$ {totalValor:F2}");
        Console.WriteLine($"- Produtos em alerta: {produtosAlerta}");
    }
}
