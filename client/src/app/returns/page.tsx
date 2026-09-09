export default function ReturnsPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl min-h-[60vh]">
      <h1 className="text-3xl font-bold mb-6 text-[#4a2e1b]">Returns & Refunds</h1>
      <div className="prose prose-orange max-w-none text-gray-700 space-y-4 bg-white p-8 rounded-lg shadow-sm border border-gray-100">
        <p>We take pride in the quality of our homemade foods. If you are not entirely satisfied with your purchase, we're here to help.</p>
        
        <h2 className="text-xl font-semibold text-[#d97706] mt-6">Returns</h2>
        <p>Due to the perishable nature of our products, we do not accept returns. However, if your item arrived damaged or spoiled, please contact us within 24 hours of delivery.</p>
        
        <h2 className="text-xl font-semibold text-[#d97706] mt-6">Refunds</h2>
        <p>If your claim is approved, we will initiate a refund to your credit card (or original method of payment). You will receive the credit within a certain amount of days, depending on your card issuer's policies.</p>
        
        <h2 className="text-xl font-semibold text-[#d97706] mt-6">Contact Us</h2>
        <p>If you have any questions on how to resolve an issue with your order, please contact our support team.</p>
      </div>
    </div>
  )
}
