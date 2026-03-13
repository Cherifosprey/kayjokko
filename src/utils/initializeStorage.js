export const initializeStorage = () => {
  // Check if products exist in localStorage
  const existingProducts = localStorage.getItem('kayjoko_products');

  if (!existingProducts) {
    // Only initialize if key is missing
    const emptyProducts = [];
    localStorage.setItem('kayjoko_products', JSON.stringify(emptyProducts));
    console.log("localStorage initialized: kayjoko_products set to [] (First run)");
  } else {
    console.log("localStorage found: preserving existing products");
  }
};