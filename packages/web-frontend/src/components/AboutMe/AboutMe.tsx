
export const AboutMe = () => {
    return (
     <div className="relative isolate px-2  py-2 lg:px-8" id="aboutMe">
        <div
          className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
          aria-hidden="true"
        >
          <div
            className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
          />
        </div>
        <div className="mx-auto lg:max-w-5xl md:max-w-4xl py-32 sm:py-48 lg:py-44  sm:flex-row flex">
            <div className="flex-1">
                pic
            </div>
            <div className="flex-1">
                <h6 className="text-xl sm:text-2xl lg:text-4xl font-mono text-slate-50 mb-5">Hi, I am Steven, or you can call me Ting-Wei.</h6>
                <h6 className="text-base sm:text-xl lg:text-2xl font-mono text-slate-50 mb-2">I am a frontend developer, focus on developer-tool, performance and frontend architecture.</h6>
                <h6 className="text-base sm:text-xl lg:text-2xl font-mono text-slate-50">Also I am a open source contributor focus on TS/JS Tool</h6>
            </div>
        </div>
        <div
          className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu  blur-3xl sm:top-[calc(100%-30rem)]"
          aria-hidden="true"
        >
          <div
            className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[12.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(40%+4rem)]  md:left-[calc(40%+8rem)]  lg:left-[calc(50%+8rem)]  xl:left-[calc(50%+20rem)] sm:w-[44.125rem]"
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
          />
        </div>
      </div>
    )
}