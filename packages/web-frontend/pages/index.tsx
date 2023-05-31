import { HeroSlider } from "@/src/components/HeroSlider";
import { Playground } from "@/src/components/Playground";
import { AboutMe } from "@/src/components/AboutMe";

export default function Home() {
  return (
    <div className="bg-slate-950">
      <HeroSlider />
      <Playground />
      <AboutMe />
    </div>
  )
}
