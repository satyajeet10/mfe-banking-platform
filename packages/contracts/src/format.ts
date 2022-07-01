const inr = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' });
export const formatMoney = (amount: number) => inr.format(amount);
