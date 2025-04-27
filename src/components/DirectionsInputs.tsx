
import React, { useState, useEffect } from 'react';
import { ArrowUpDown } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

interface DirectionsInputsProps {
  onSetOrigin: (query: string) => void;
  onSetDestination: (query: string) => void;
  onSetProfile: (profile: string) => void;
  onReverse: () => void;
  initialProfile?: string;
  originValue?: string;
  destinationValue?: string;
}

export const DirectionsInputs: React.FC<DirectionsInputsProps> = ({
  onSetOrigin,
  onSetDestination,
  onSetProfile,
  onReverse,
  initialProfile = 'mapbox/driving-traffic',
  originValue,
  destinationValue,
}) => {
  const [origin, setOrigin] = useState(originValue || '');
  const [destination, setDestination] = useState(destinationValue || '');
  const [profile, setProfile] = useState(initialProfile);

  useEffect(() => {
    if (originValue !== undefined) setOrigin(originValue);
  }, [originValue]);

  useEffect(() => {
    if (destinationValue !== undefined) setDestination(destinationValue);
  }, [destinationValue]);

  const handleInputSubmit = (type: 'origin' | 'destination', value: string) => {
    if (type === 'origin') onSetOrigin(value);
    else onSetDestination(value);
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    type: 'origin' | 'destination',
    value: string
  ) => {
    if (e.key === 'Enter') {
      handleInputSubmit(type, value);
    }
  };

  return (
    <Card className="absolute top-4 left-4 z-10 w-[400px] bg-white/95 backdrop-blur-sm">
      <CardContent className="p-4 space-y-4">
        <div className="space-y-3">
          <div className="relative">
            <div className="absolute left-3 top-2.5 flex h-5 w-5 items-center justify-center rounded-sm bg-blue-500 text-white text-sm font-medium">
              A
            </div>
            <Input
              placeholder="Choose a starting place"
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              onBlur={() => handleInputSubmit('origin', origin)}
              onKeyDown={(e) => handleKeyDown(e, 'origin', origin)}
              className="pl-11 h-10 bg-white text-gray-600"
            />
          </div>

          <div className="relative">
            <div className="absolute left-3 top-2.5 flex h-5 w-5 items-center justify-center rounded-sm bg-violet-500 text-white text-sm font-medium">
              B
            </div>
            <Input
              placeholder="Choose destination"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              onBlur={() => handleInputSubmit('destination', destination)}
              onKeyDown={(e) => handleKeyDown(e, 'destination', destination)}
              className="pl-11 h-10 bg-white text-gray-600"
            />
          </div>
        </div>

        <div className="absolute right-4 top-11">
          <Button
            variant="ghost"
            size="icon"
            onClick={onReverse}
            className="h-8 w-8 hover:bg-gray-100"
          >
            <ArrowUpDown className="h-4 w-4" />
          </Button>
        </div>

        <ToggleGroup
          type="single"
          value={profile}
          onValueChange={(value) => {
            if (value) {
              setProfile(value);
              onSetProfile(value);
            }
          }}
          className="justify-start bg-gray-100 p-1 rounded-full"
        >
          <ToggleGroupItem
            value="mapbox/driving-traffic"
            className="rounded-full text-sm px-4 data-[state=on]:bg-white data-[state=on]:text-black"
          >
            Traffic
          </ToggleGroupItem>
          <ToggleGroupItem
            value="mapbox/driving"
            className="rounded-full text-sm px-4 data-[state=on]:bg-white data-[state=on]:text-black"
          >
            Driving
          </ToggleGroupItem>
          <ToggleGroupItem
            value="mapbox/walking"
            className="rounded-full text-sm px-4 data-[state=on]:bg-white data-[state=on]:text-black"
          >
            Walking
          </ToggleGroupItem>
          <ToggleGroupItem
            value="mapbox/cycling"
            className="rounded-full text-sm px-4 data-[state=on]:bg-white data-[state=on]:text-black"
          >
            Cycling
          </ToggleGroupItem>
        </ToggleGroup>
      </CardContent>
    </Card>
  );
};
