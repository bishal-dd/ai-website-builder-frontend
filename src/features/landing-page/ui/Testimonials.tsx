import { Card, CardContent } from '@/components/ui/card'
import { Star } from 'lucide-react'

const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'Owner, Paradise Travel Agency',
    content:
      'Sencill AI transformed our online presence in just one afternoon. We went from no website to a stunning, professional site that our clients love.',
    rating: 5,
  },
  {
    name: 'Michael Chen',
    role: 'Manager, Oceanview Hotel',
    content:
      'The best investment we made this year. Our bookings increased by 40% after launching our new website. The AI understood exactly what we needed.',
    rating: 5,
  },
  {
    name: 'Emma Rodriguez',
    role: 'Founder, Adventure Tours',
    content:
      'I was skeptical at first, but Sencill AI exceeded all expectations. The website looks like it was designed by a professional agency, but at a fraction of the cost.',
    rating: 5,
  },
]

export function Testimonials() {
  return (
    <section className="py-20 md:py-32 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center mb-16">
          <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl lg:text-5xl mb-4">
            Loved by Business Owners Worldwide
          </h2>
          <p className="text-pretty text-lg text-muted-foreground leading-relaxed">
            Join thousands of satisfied customers who transformed their online presence with Sencill
            AI.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3 mx-auto max-w-6xl">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="border-border bg-card">
              <CardContent className="pt-6">
                <div className="mb-4 flex gap-1">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-primary text-primary" />
                  ))}
                </div>
                <p className="mb-6 text-pretty leading-relaxed text-card-foreground">
                  &quot;{testimonial.content}&quot;
                </p>
                <div>
                  <p className="font-semibold text-card-foreground">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
