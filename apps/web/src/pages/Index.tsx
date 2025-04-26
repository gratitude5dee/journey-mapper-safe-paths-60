
export function Index() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gradient-to-b from-background to-muted">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl">
          Navigate with <span className="text-primary">Confidence</span>
        </h1>
        <p className="mt-6 text-xl text-muted-foreground">
          Plan safer journeys with real-time safety insights and community-verified routes.
        </p>
        <div className="mt-10 flex justify-center gap-4">
          <button className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-primary/90 transition-colors">
            Get Started
          </button>
          <button className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-primary bg-primary/10 hover:bg-primary/20 transition-colors">
            Learn More
          </button>
        </div>
      </div>
    </div>
  );
}

