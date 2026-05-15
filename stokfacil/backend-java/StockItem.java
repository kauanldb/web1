public class StockItem {
    private final String name;
    private final String category;
    private final int quantity;
    private final double price;
    private final int alertThreshold;

    public StockItem(String name, String category, int quantity, double price, int alertThreshold) {
        this.name = name;
        this.category = category;
        this.quantity = quantity;
        this.price = price;
        this.alertThreshold = alertThreshold;
    }

    public String getName() {
        return name;
    }

    public String getCategory() {
        return category;
    }

    public int getQuantity() {
        return quantity;
    }

    public double getPrice() {
        return price;
    }

    public int getAlertThreshold() {
        return alertThreshold;
    }

    public boolean isLowStock() {
        return quantity <= alertThreshold;
    }

    public double getTotalValue() {
        return quantity * price;
    }

    @Override
    public String toString() {
        return String.format("%s | %s | Qtde: %d | Preço: R$ %.2f | Alerta: %d",
                name, category, quantity, price, alertThreshold);
    }
}
