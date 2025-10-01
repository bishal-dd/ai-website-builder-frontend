import { Card, CardContent } from "@/components/ui/card"
import { Star } from "lucide-react"

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Founder, TechStart",
    content:
      "Sencill helped us launch our website in under an hour. The AI understood exactly what we needed and delivered a stunning result.",
    avatar: "/professional-woman-avatar.png",
  },
  {
    name: "Marcus Rodriguez",
    role: "Creative Director, DesignCo",
    content:
      "As a designer, I'm impressed by the quality of output. Sencill creates websites that look hand-crafted, not template-based.",
    avatar: "/professional-man-avatar.png",
  },
  {
    name: "Emily Watson",
    role: "CEO, GrowthLabs",
    content:
      "The speed and customization options are unmatched. We've built multiple landing pages for different campaigns effortlessly.",
    avatar: "/professional-woman-avatar-2.png",
  },
]

export function Testimonials() {
  return (
    <section className="py-24 px-4 bg-muted/30">
      <div className="container mx-auto max-w-6xl">
        {/* Section header */}
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-balance text-4xl font-bold tracking-tight md:text-5xl">
            Trusted by creators worldwide
          </h2>
          <p className="mx-auto max-w-2xl text-pretty text-lg text-muted-foreground">
            Join thousands of businesses building their web presence with Sencill
          </p>
        </div>

        {/* Testimonials grid */}
        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="border-border/50 bg-card">
              <CardContent className="p-6">
                {/* Star rating */}
                <div className="mb-4 flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-accent text-accent" />
                  ))}
                </div>

                {/* Testimonial content */}
                <p className="mb-6 text-sm leading-relaxed text-foreground">"{testimonial.content}"</p>

                {/* Author info */}
                <div className="flex items-center gap-3">
                  <div>
                    <div className="font-semibold text-foreground">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
