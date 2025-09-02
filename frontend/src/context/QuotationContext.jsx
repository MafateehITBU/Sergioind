import React, { createContext, useContext, useState, useEffect } from "react";

const QuotationContext = createContext();

export const QuotationProvider = ({ children }) => {
  const [items, setItems] = useState([]);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("quotationItems");
    if (stored) {
      setItems(JSON.parse(stored));
    }
  }, []);

  // Save to localStorage whenever items change
  useEffect(() => {
    localStorage.setItem("quotationItems", JSON.stringify(items));
  }, [items]);

  const addItem = (productId, size, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find(
        (item) => item.product === productId && item.size === size
      );
      if (existing) {
        // Update quantity if exists
        return prev.map((item) =>
          item.product === productId && item.size === size
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product: productId, size, quantity }];
    });
  };

  const removeItem = (productId, size) => {
    setItems((prev) =>
      prev.filter((item) => !(item.product === productId && item.size === size))
    );
  };

  const clearItems = () => {
    setItems([]);
  };

  return (
    <QuotationContext.Provider
      value={{ items, addItem, removeItem, clearItems }}
    >
      {children}
    </QuotationContext.Provider>
  );
};

export const useQuotation = () => useContext(QuotationContext);