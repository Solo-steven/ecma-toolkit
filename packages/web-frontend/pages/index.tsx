import { SEOHeader } from "@/src/components/SEOHeader";
import { HeroSlider } from "@/src/components/HeroSlider";
import { Playground } from "@/src/components/Playground";
import { AboutMe } from "@/src/components/AboutMe";

export default function Home() {
  return (
    <div>
      <SEOHeader 
        title={"ECMA Toolkit, A toy toolit for JavaScript"} 
        description="ECMA toolkit, a toy toolkit for parse your JavaScript code estree-like AST"
      />
        <div className="bg-slate-950">
          <HeroSlider />
          <Playground />
          <AboutMe />
        </div>
    </div>
  )
}
