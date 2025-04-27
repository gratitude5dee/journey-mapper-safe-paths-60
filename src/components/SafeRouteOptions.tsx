
import { Shield } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface RouteOption {
  id: string;
  safetyScore: number;
  duration: number;
  distance: number;
  description: string;
  via: string;
}

interface SafeRouteOptionsProps {
  options: RouteOption[];
  onSelectRoute: (route: RouteOption) => void;
}

const getSafetyLabel = (score: number) => {
  if (score >= 8) return 'Safest Route';
  if (score >= 6) return 'Balanced Route';
  return 'Direct Route';
};

const getSafetyDescription = (score: number) => {
  if (score >= 8) return 'Recommended safest option, avoids high-incident areas';
  if (score >= 6) return 'Balanced option with moderate safety';
  return 'Most direct, passes through areas with higher reported incidents';
};

export const SafeRouteOptions = ({ options, onSelectRoute }: SafeRouteOptionsProps) => {
  return (
    <Card className="fixed bottom-0 left-0 right-0 rounded-t-xl border-t shadow-lg md:bottom-8 md:left-1/2 md:right-auto md:w-96 md:-translate-x-1/2 md:rounded-xl">
      <CardContent className="grid gap-4 p-6">
        {options.map((option) => (
          <Button
            key={option.id}
            variant={option.safetyScore >= 8 ? "default" : "outline"}
            size="lg"
            className="w-full"
            onClick={() => onSelectRoute(option)}
          >
            <div className="flex w-full items-center gap-2">
              <Shield className={option.safetyScore >= 8 ? "text-green-500" : "text-yellow-500"} />
              <div className="flex w-full flex-col items-start text-left">
                <div className="flex w-full justify-between">
                  <span>{getSafetyLabel(option.safetyScore)}</span>
                  <span>{Math.round(option.duration)} min</span>
                </div>
                <span className="text-sm text-muted-foreground">via {option.via}</span>
              </div>
            </div>
          </Button>
        ))}
      </CardContent>
    </Card>
  );
};
