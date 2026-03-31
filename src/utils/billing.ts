export interface Product {
  id: string;
  name: string;
  price: number; // in pounds
}

export const products: Product[] = [
  { id: 'bread', name: 'Bread', price: 1.1 },
  { id: 'milk', name: 'Milk', price: 0.5 },
  { id: 'cheese', name: 'Cheese', price: 0.9 },
  { id: 'soup', name: 'Soup', price: 0.6 },
  { id: 'butter', name: 'Butter', price: 1.2 },
];

export interface OfferDetail {
  id: string;
  description: string;
  saving: number;
}

export interface BillingResult {
  subtotal: number;
  discounts: number;
  finalTotal: number;
  savings: OfferDetail[];
  productSubtotals: Record<string, { quantity: number; total: number }>;
}

export function calculateBill(quantities: Record<string, number>): BillingResult {
  const productSubtotals: Record<string, { quantity: number; total: number }> = {};
  let subtotal = 0;

  for (const product of products) {
    const quantity = quantities[product.id] || 0;
    if (quantity > 0) {
      const total = product.price * quantity;
      productSubtotals[product.id] = { quantity, total };
      subtotal += total;
    }
  }

  const savings: OfferDetail[] = [];

  // Cheese: buy 1 get 1 free
  const cheeseQty = quantities.cheese || 0;
  if (cheeseQty > 1) {
    const freeCheeses = Math.floor(cheeseQty / 2);
    const cheeseSaving = freeCheeses * products.find((p) => p.id === 'cheese')!.price;
    if (cheeseSaving > 0) {
      savings.push({
        id: 'cheese-bogo',
        description: `Cheese BOGO: ${freeCheeses} cheese free`,
        saving: cheeseSaving,
      });
    }
  }

  // Soup -> Bread 50% off (one bread per soup)
  const soupQty = quantities.soup || 0;
  const breadQty = quantities.bread || 0;
  if (soupQty > 0 && breadQty > 0) {
    const offerBread = Math.min(soupQty, breadQty);
    const breadPrice = products.find((p) => p.id === 'bread')!.price;
    const soupBreadSaving = offerBread * breadPrice * 0.5;
    if (soupBreadSaving > 0) {
      savings.push({
        id: 'soup-bread',
        description: `Soup offer: ${offerBread} bread(s) 50% off`,
        saving: soupBreadSaving,
      });
    }
  }

  // Butter 33% discount
  const butterQty = quantities.butter || 0;
  if (butterQty > 0) {
    const butterPrice = products.find((p) => p.id === 'butter')!.price;
    const butterSaving = butterQty * butterPrice * 0.33;
    if (butterSaving > 0) {
      savings.push({
        id: 'butter-discount',
        description: `Butter discounted 33% (${butterQty} unit(s))`,
        saving: butterSaving,
      });
    }
  }

  const totalSavings = savings.reduce((sum, item) => sum + item.saving, 0);
  const finalTotal = Math.max(0, subtotal - totalSavings);

  return {
    subtotal,
    discounts: totalSavings,
    finalTotal,
    savings,
    productSubtotals,
  };
}
