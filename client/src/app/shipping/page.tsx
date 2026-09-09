export default function ShippingPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl min-h-[60vh]">
      <h1 className="text-3xl font-bold mb-6 text-[#4a2e1b]">Shipping Policy</h1>
      <div className="prose prose-orange max-w-none text-gray-700 space-y-4 bg-white p-8 rounded-lg shadow-sm border border-gray-100">
        <p>At Janani Home Foods, we strive to deliver your authentic homemade foods fresh and fast.</p>
        
        <h2 className="text-xl font-semibold text-[#d97706] mt-6">Processing Time</h2>
        <p>All orders are freshly prepared and processed within 1-2 business days. Orders are not shipped or delivered on weekends or holidays.</p>
        
        <h2 className="text-xl font-semibold text-[#d97706] mt-6">Shipping Rates & Delivery Estimates</h2>
        <p>Shipping charges for your order will be calculated and displayed at checkout. Standard delivery typically takes 3-5 business days.</p>
        
        <h2 className="text-xl font-semibold text-[#d97706] mt-6">Order Tracking</h2>
        <p>You will receive a shipment confirmation email containing your tracking number(s) once your order has shipped.</p>
      </div>
    </div>
  )
}
