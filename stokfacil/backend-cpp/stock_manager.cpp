#include <algorithm>
#include <iomanip>
#include <iostream>
#include <string>
#include <vector>

struct StockItem {
    std::string name;
    std::string category;
    int quantity;
    double price;
    int alertThreshold;
};

std::string formatCurrency(double value) {
    std::ostringstream output;
    output << std::fixed << std::setprecision(2) << "R$ " << value;
    return output.str();
}

bool matchesCategory(const StockItem& item, const std::string& category) {
    return category.empty() || item.category == category;
}

bool matchesSearch(const StockItem& item, const std::string& query) {
    return query.empty() || item.name.find(query) != std::string::npos;
}

void printItem(const StockItem& item) {
    std::cout << item.name << " | " << item.category << " | Qtde: " << item.quantity
              << " | Preço: " << formatCurrency(item.price)
              << " | Alerta: " << item.alertThreshold << "\n";
}

void printSummary(const std::vector<StockItem>& inventory) {
    int totalUnits = 0;
    int lowStockCount = 0;
    double totalValue = 0.0;

    for (const auto& item : inventory) {
        totalUnits += item.quantity;
        totalValue += item.quantity * item.price;
        if (item.quantity <= item.alertThreshold) {
            lowStockCount++;
        }
    }

    std::cout << "Resumo do estoque:\n";
    std::cout << "Produtos cadastrados: " << inventory.size() << "\n";
    std::cout << "Unidades em estoque: " << totalUnits << "\n";
    std::cout << "Produtos em alerta: " << lowStockCount << "\n";
    std::cout << "Valor estimado do estoque: " << formatCurrency(totalValue) << "\n";
}

void printInventory(const std::vector<StockItem>& inventory) {
    std::cout << "\nItens do estoque:\n";
    for (const auto& item : inventory) {
        printItem(item);
    }
}

int main(int argc, char* argv[]) {
    std::vector<StockItem> inventory = {
        {"Arroz Tipo 1", "mercearia", 24, 6.90, 10},
        {"Detergente 500ml", "limpeza", 8, 4.80, 6},
        {"Cerveja Pilsen", "bebidas", 42, 3.50, 12},
        {"Sabonete Neutro", "higiene", 14, 2.40, 8},
        {"Macarrão Espaguete", "mercearia", 18, 5.20, 7}
    };

    std::string command;
    std::string parameter;

    if (argc > 1) {
        command = argv[1];
        if (argc > 2) {
            parameter = argv[2];
        }
    }

    std::cout << "=== StokFácil C++: Controle de Estoque ===\n";
    printSummary(inventory);

    if (command == "categoria") {
        std::cout << "\nFiltrando pela categoria: " << parameter << "\n";
        std::vector<StockItem> filtered;
        std::copy_if(inventory.begin(), inventory.end(), std::back_inserter(filtered),
                     [&](const StockItem& item) { return matchesCategory(item, parameter); });
        printInventory(filtered);
        return 0;
    }

    if (command == "buscar") {
        std::cout << "\nBuscando por: " << parameter << "\n";
        std::vector<StockItem> filtered;
        std::copy_if(inventory.begin(), inventory.end(), std::back_inserter(filtered),
                     [&](const StockItem& item) { return matchesSearch(item, parameter); });
        printInventory(filtered);
        return 0;
    }

    printInventory(inventory);
    std::cout << "\nUse: ./stock_manager categoria <nome> ou ./stock_manager buscar <texto>\n";
    return 0;
}
