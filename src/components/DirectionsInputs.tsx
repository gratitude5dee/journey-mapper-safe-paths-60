
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { ArrowLeftRight, Search } from 'lucide-react';

interface DirectionsInputsProps {
  onSetOrigin: (query: string) => void;
  onSetDestination: (query: string) => void;
  onSetProfile: (profile: string) => void;
  onReverse: () => void;
}

export const DirectionsInputs: React.FC<DirectionsInputsProps> = ({
  onSetOrigin,
  onSetDestination,
  onSetProfile,
  onReverse
}) => {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [profile, setProfile] = useState('mapbox/driving-traffic');

  const handleOriginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOrigin(e.target.value);
  };

  const handleDestinationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDestination(e.target.value);
  };

  const handleSubmitOrigin = (e: React.FormEvent) => {
    e.preventDefault();
    if (origin.trim()) {
      onSetOrigin(origin);
    }
  };

  const handleSubmitDestination = (e: React.FormEvent) => {
    e.preventDefault();
    if (destination.trim()) {
      onSetDestination(destination);
    }
  };

  const handleProfileChange = (value: string) => {
    setProfile(value);
    onSetProfile(value);
  };

  const handleReverse = () => {
    const tempOrigin = origin;
    setOrigin(destination);
    setDestination(tempOrigin);
    onReverse();
  };

  return (
    <Card className="absolute top-4 left-4 z-10 w-[400px] bg-white/95 backdrop-blur-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Directions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmitOrigin} className="flex gap-2">
          <Input
            placeholder="Starting point..."
            value={origin}
            onChange={handleOriginChange}
            className="flex-1"
          />
          <Button type="submit" size="sm" variant="outline">
            <Search className="h-4 w-4" />
          </Button>
        </form>

        <form onSubmit={handleSubmitDestination} className="flex gap-2">
          <Input
            placeholder="Destination..."
            value={destination}
            onChange={handleDestinationChange}
            className="flex-1"
          />
          <Button type="submit" size="sm" variant="outline">
            <Search className="h-4 w-4" />
          </Button>
        </form>

        <div className="flex items-center gap-2">
          <Select value={profile} onValueChange={handleProfileChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Travel mode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="mapbox/driving-traffic">Driving (Traffic)</SelectItem>
              <SelectItem value="mapbox/driving">Driving</SelectItem>
              <SelectItem value="mapbox/walking">Walking</SelectItem>
              <SelectItem value="mapbox/cycling">Cycling</SelectItem>
            </SelectContent>
          </Select>
          
          <Button 
            type="button" 
            variant="outline" 
            size="icon" 
            className="ml-auto"
            onClick={handleReverse}
          >
            <ArrowLeftRight className="h-4 w-4" />
            <span className="sr-only">Reverse direction</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
