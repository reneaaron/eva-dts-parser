interface Product {
    id: string;
    price: number;
    numberOfSales: number;
    valueOfSales: number; 
}

interface PaymentMethod {
  title: string;
  valueOfSales: number;
  numberOfSales: number;
}

type Products = Product[];
type PaymentMethods = PaymentMethod[];
export type ParseResult = {
  products: Products;
  paymentMethods: PaymentMethods;
  currencyNumber: number;
  date: string;
};

export default function parseEvaDtsFile(content: string): ParseResult {
  let currencyNumber = 978; // EUR
  const products: Products = [];
  const paymentMethods: PaymentMethods = [];
  const lines = content.split("\n");
  let currentProduct: Product = null!;
  let date = "";

  for (let line of lines) {
    if (line.trim() === "") continue; // Skip empty lines

    const parts = line.split("*").map((part) => part.trim());
    const recordType = parts[0];
    const data = parts.slice(1);

    if(recordType === "ID4") {
      currencyNumber = Number(data[1].substring(1));
    }

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

    if(recordType == "CA2") {
      paymentMethods.push({
        title: "Barzahlung",
        numberOfSales: Number(data[3]),
        valueOfSales: Number(data[2]) / 100,
      });
    }

    if (recordType == "DA2") {
      paymentMethods.push({
        title: "Kartenzahlung",
        numberOfSales: Number(data[3]),
        valueOfSales: Number(data[2]) / 100,
      });
    }

    if(recordType == "EA3") {
      date = `${data[1]} ${data[2]}`;
    }
  }

  return {
    products,
    paymentMethods,
    currencyNumber,
    date
  };
}