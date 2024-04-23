interface Segment {
  type: string;
  values: (string | number)[];
}

interface Transaction {
  type?: string; // Optional type for better classification
  records: Segment[];
}

interface Product {
    id: string;
    price: number;
    numberOfSales: number;
    valueOfSales: number; 
}

type Products = Product[];
type Transactions = Transaction[];

export default function parseEvaDtsFile(content: string): Products {
  const products: Products = [];
  const lines = content.split("\n");
  let currentProduct: Product = null!;

  for (let line of lines) {
    if (line.trim() === "") continue; // Skip empty lines

    const parts = line.split("*").map((part) => part.trim());
    const recordType = parts[0];
    const data = parts.slice(1);

    if(recordType == "PA1") {
        currentProduct = {
            id: data[0],
            price: Number(data[1]) / 100,
            valueOfSales: 0,
            numberOfSales: 0,
        };
        products.push(currentProduct);
    }

    if(recordType == "PA2") {
        currentProduct.numberOfSales = Number(data[2]);
        currentProduct.valueOfSales = Number(data[3]) / 100;
    }
  }

  return products;
}