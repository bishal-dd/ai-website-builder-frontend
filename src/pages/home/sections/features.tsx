import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Sparkles, Zap, Palette, Users } from "lucide-react"

const features = [
  {
    icon: Sparkles,
    title: "AI-Powered Generation",
    description:
      "Our advanced AI understands your vision and creates pixel-perfect websites tailored to your needs in seconds.",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description:
      "Go from idea to published website in minutes, not weeks. Deploy instantly with one click to production.",
  },
  {
    icon: Palette,
    title: "Fully Customizable",
    description: "Every element is customizable. Fine-tune colors, layouts, and content to match your brand perfectly.",
  },
  {
    icon: Users,
    title: "User-Friendly",
    description:
      "Intuitive interface designed for everyone. No technical knowledge required to build professional websites.",
  },
]

export function Features() {
  return (
    <section className="border-b border-border">
      <div className="container mx-auto px-4 py-24 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 text-center mb-16">
          <h2 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl text-balance">
            Everything you need to build amazing websites
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
            Powerful features that make website creation effortless and enjoyable
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <Card
                key={feature.title}
                className="group transition-all hover:border-accent/50 hover:shadow-lg hover:shadow-accent/5"
              >
                <CardHeader>
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10 text-accent transition-colors group-hover:bg-accent/20">
                    <Icon className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
