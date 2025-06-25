export class CreateOrderDto {
  products: {
    productId: string;
    quantity: number;
    price: number; // price tại thời điểm đặt hàng
  }[];
}
