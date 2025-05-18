// components/FeatureCard.jsx
export default function FeatureCard({ icon, title, description, color }) {
  return (
    <div className={`p-8 rounded-3xl text-white bg-gradient-to-br ${color} shadow-lg`}>
      {/* icône professionnelle */}
      <div className="text-4xl mb-6">{icon}</div>

      <h3 className="font-playfair text-2xl font-bold mb-2">{title}</h3>
      <p className="font-inter leading-relaxed">{description}</p>
    </div>
  )
}
