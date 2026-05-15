import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Scanner;
import java.util.stream.Collectors;

public class StockManager {
    private final List<StockItem> inventory = new ArrayList<>();

    public StockManager() {
        inventory.add(new StockItem("Arroz Tipo 1", "mercearia", 24, 6.90, 10));
        inventory.add(new StockItem("Detergente 500ml", "limpeza", 8, 4.80, 6));
        inventory.add(new StockItem("Cerveja Pilsen", "bebidas", 42, 3.50, 12));
        inventory.add(new StockItem("Sabonete Neutro", "higiene", 14, 2.40, 8));
        inventory.add(new StockItem("Macarrão Espaguete", "mercearia", 18, 5.20, 7));
    }

    public static void main(String[] args) {
        Locale.setDefault(new Locale("pt", "BR"));
        StockManager manager = new StockManager();
        Scanner scanner = new Scanner(System.in);

        System.out.println("=== StokFácil Java: Controle de Estoque ===");
        manager.printSummary();
        manager.printItems(manager.inventory);

        while (true) {
            System.out.println("\nDigite um comando: [listar] [categoria <nome>] [buscar <texto>] [sair]");
            System.out.print("> ");
            String line = scanner.nextLine().trim();
            if (line.isEmpty()) {
                continue;
            }
            if (line.equalsIgnoreCase("sair")) {
                break;
            }
            if (line.equalsIgnoreCase("listar")) {
                manager.printItems(manager.inventory);
                continue;
            }
            if (line.toLowerCase().startsWith("categoria ")) {
                String category = line.substring(10).trim();
                manager.printItems(manager.filterByCategory(category));
                continue;
            }
            if (line.toLowerCase().startsWith("buscar ")) {
                String query = line.substring(6).trim();
                manager.printItems(manager.search(query));
                continue;
            }
            System.out.println("Comando não reconhecido. Use listar, categoria <nome>, buscar <texto> ou sair.");
        }

        System.out.println("Encerrando StokFácil Java.");
        scanner.close();
    }

    private void printSummary() {
        long totalProducts = inventory.size();
        int totalUnits = inventory.stream().mapToInt(StockItem::getQuantity).sum();
        long lowStockCount = inventory.stream().filter(StockItem::isLowStock).count();
        double totalValue = inventory.stream().mapToDouble(StockItem::getTotalValue).sum();

        System.out.println("Resumo do estoque:");
        System.out.printf("Produtos cadastrados: %d\n", totalProducts);
        System.out.printf("Unidades em estoque: %d\n", totalUnits);
        System.out.printf("Produtos em alerta: %d\n", lowStockCount);
        System.out.printf("Valor estimado do estoque: R$ %.2f\n", totalValue);
    }

    private void printItems(List<StockItem> items) {
        System.out.println("\nItens do estoque:");
        items.forEach(item -> System.out.println(item));
    }

    private List<StockItem> filterByCategory(String category) {
        return inventory.stream()
                .filter(item -> item.getCategory().equalsIgnoreCase(category))
                .collect(Collectors.toList());
    }

    private List<StockItem> search(String query) {
        return inventory.stream()
                .filter(item -> item.getName().toLowerCase().contains(query.toLowerCase()))
                .collect(Collectors.toList());
    }
}
