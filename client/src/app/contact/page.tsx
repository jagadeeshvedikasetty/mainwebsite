export default function ContactPage() {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '60px 20px', minHeight: '60vh' }}>
      <h1 className="font-traditional" style={{ fontSize: '2.5rem', marginBottom: '20px', color: 'var(--heading-color)' }}>Contact Us</h1>
      
      <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', lineHeight: '1.8', color: '#444' }}>
        <p style={{ marginBottom: '20px', fontSize: '1.1rem' }}>
          We would love to hear from you! Whether you have a question about our traditional recipes, bulk orders, or your recent purchase, our team is ready to help.
        </p>
        
        <h2 style={{ fontSize: '1.5rem', marginTop: '30px', marginBottom: '15px', color: 'var(--primary-color)' }}>Get in Touch</h2>
        
        <div style={{ marginBottom: '15px' }}>
          <strong>Email:</strong> <br/>
          <a href="mailto:contact@jananihomefoods.com" style={{ color: '#d97706', textDecoration: 'none' }}>contact@jananihomefoods.com</a>
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <strong>Phone:</strong> <br/>
          +91 98765 43210 <br/>
          <span style={{ fontSize: '0.9rem', color: '#888' }}>(Monday - Saturday, 9:00 AM to 6:00 PM IST)</span>
        </div>
        
        <h2 style={{ fontSize: '1.5rem', marginTop: '30px', marginBottom: '15px', color: 'var(--primary-color)' }}>Our Kitchen</h2>
        <p>
          Janani Home Foods<br/>
          123 Traditional Street<br/>
          Hyderabad, Telangana 500001<br/>
          India
        </p>
      </div>
    </div>
  )
}
