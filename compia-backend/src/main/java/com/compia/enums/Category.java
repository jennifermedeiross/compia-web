package com.compia.enums;


public enum Category {

    DEEP_LEARNING("Deep Learning"),
    MACHINE_LEARNING("Machine Learning"),
    NLP("NLP"),
    INTELIGENCIA_ARTIFICIAL("Inteligência Artificial"),
    BUNDLES("Bundles");

    private final String label;

    Category(String label) {
        this.label = label;
    }

    public String getLabel() {
        return label;
    }

    public static Category fromLabel(String value) {
        for (Category c : values()) {
            if (c.label.equalsIgnoreCase(value)) {
                return c;
            }

            if (c.name().equalsIgnoreCase(value)) {
                return c;
            }
        }
        throw new IllegalArgumentException("Categoria inválida: " + value);
    }

    public boolean equalsIgnoreCase(String category) {
        if (category == null) return false;

        return label.equalsIgnoreCase(category) ||
                name().equalsIgnoreCase(category);
    }
}