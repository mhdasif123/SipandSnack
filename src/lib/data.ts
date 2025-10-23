export type Employee = { id: string; name: string };
export type Item = { id: string; name: string; price: number };
export type Order = {
  id: string;
  employeeName: string;
  tea: string;
  snack: string;
  amount: number;
  orderDate: string; // ISO string
};

let employees: Employee[] = [
  { id: '1', name: 'Anjali Sharma' },
  { id: '2', name: 'Rohan Gupta' },
  { id: '3', name: 'Priya Singh' },
  { id: '4', name: 'Vikram Mehta' },
  { id: '5', name: 'Sunita Rao' },
];

let teaItems: Item[] = [
  { id: 't1', name: 'Masala Chai', price: 15 },
  { id: 't2', name: 'Green Tea', price: 10 },
  { id: 't3', name: 'Ginger Tea', price: 12 },
  { id: 't4', name: 'Lemon Tea', price: 12 },
  { id: 't5', name: 'Black Coffee', price: 20 },
];

let snackItems: Item[] = [
  { id: 's1', name: 'Samosa', price: 15 },
  { id: 's2', name: 'Biscuits', price: 5 },
  { id: 's3', name: 'Veg Puff', price: 20 },
  { id: 's4', name: 'Fruit Salad', price: 25 },
];

let orders: Order[] = [
    {
        id: 'o1',
        employeeName: 'Anjali Sharma',
        tea: 'Masala Chai',
        snack: 'Samosa',
        amount: 25,
        orderDate: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString(),
    },
    {
        id: 'o2',
        employeeName: 'Rohan Gupta',
        tea: 'Green Tea',
        snack: 'Biscuits',
        amount: 15,
        orderDate: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString(),
    },
    {
        id: 'o3',
        employeeName: 'Priya Singh',
        tea: 'Ginger Tea',
        snack: 'Veg Puff',
        amount: 22,
        orderDate: new Date(new Date().setDate(new Date().getDate() - 7)).toISOString(),
    }
];

// Simulate async data fetching
export const getEmployees = async () => {
    await new Promise(res => setTimeout(res, 50));
    return employees;
}
export const getTeaItems = async () => {
    await new Promise(res => setTimeout(res, 50));
    return teaItems;
}
export const getSnackItems = async () => {
    await new Promise(res => setTimeout(res, 50));
    return snackItems;
}
export const getOrders = async () => {
    await new Promise(res => setTimeout(res, 50));
    return orders;
}

// Simulate data mutation
export const addOrder = async (order: Omit<Order, 'id' | 'orderDate'>) => {
    await new Promise(res => setTimeout(res, 100));
    const newOrder: Order = {
        ...order,
        id: `o${Date.now()}`,
        orderDate: new Date().toISOString(),
    }
    orders = [newOrder, ...orders];
    return newOrder;
}

export const addEmployee = async (name: string) => {
    await new Promise(res => setTimeout(res, 100));
    const newEmployee = { id: `e${Date.now()}`, name };
    employees = [...employees, newEmployee];
    return employees;
}

export const updateEmployee = async (id: string, name: string) => {
    await new Promise(res => setTimeout(res, 100));
    employees = employees.map(e => e.id === id ? { ...e, name } : e);
    return employees;
}

export const deleteEmployee = async (id: string) => {
    await new Promise(res => setTimeout(res, 100));
    employees = employees.filter(e => e.id !== id);
    return employees;
}

export const addItem = async (type: 'tea' | 'snack', item: { name: string, price: number }) => {
    await new Promise(res => setTimeout(res, 100));
    const newItem = { ...item, id: `${type[0]}${Date.now()}` };
    if (type === 'tea') {
        teaItems = [...teaItems, newItem];
        return teaItems;
    } else {
        snackItems = [...snackItems, newItem];
        return snackItems;
    }
}

export const updateItem = async (type: 'tea' | 'snack', id: string, data: { name: string, price: number }) => {
    await new Promise(res => setTimeout(res, 100));
    if (type === 'tea') {
        teaItems = teaItems.map(i => i.id === id ? { ...i, ...data } : i);
        return teaItems;
    } else {
        snackItems = snackItems.map(i => i.id === id ? { ...i, ...data } : i);
        return snackItems;
    }
}

export const deleteItem = async (type: 'tea' | 'snack', id: string) => {
    await new Promise(res => setTimeout(res, 100));
    if (type === 'tea') {
        teaItems = teaItems.filter(i => i.id !== id);
        return teaItems;
    } else {
        snackItems = snackItems.filter(i => i.id !== id);
        return snackItems;
    }
}
