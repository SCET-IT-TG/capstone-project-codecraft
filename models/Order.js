import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  products: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
      quantity: { type: Number, required: true },
    },
  ],
  totalAmount: { type: Number, required: true },
  shippingAddress: { type: String, required: true },
  paymentStatus: { type: String, default: 'Pending' },
  orderStatus: { type: String, default: 'Processing' },
  createdAt: { type: Date, default: Date.now },
});

const Order = mongoose.model('Order', orderSchema);
export default Order;