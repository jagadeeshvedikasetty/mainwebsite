export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl min-h-[60vh]">
      <h1 className="text-3xl font-bold mb-6 text-[#4a2e1b]">About Us</h1>
      <div className="prose prose-orange max-w-none text-gray-700 space-y-4 bg-white p-8 rounded-lg shadow-sm border border-gray-100">
        <p>Welcome to <strong>Janani Home Foods</strong>, where tradition meets taste.</p>
        
        <p>We started with a simple vision: to bring the authentic, comforting flavors of homemade cooking to your doorstep. Every recipe we prepare is crafted with love, using hand-picked ingredients and traditional methods passed down through generations.</p>
        
        <h2 className="text-xl font-semibold text-[#d97706] mt-6">Our Promise</h2>
        <p>No artificial preservatives, no shortcuts. Just pure, wholesome goodness that reminds you of home.</p>
        
        <p className="pt-4 italic">Thank you for choosing Janani Home Foods and supporting traditional culinary arts!</p>
      </div>
    </div>
  )
}
