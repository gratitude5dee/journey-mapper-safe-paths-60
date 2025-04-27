
import React, { useState, useEffect } from 'react';
import { ArrowUpDown, LocateFixed } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';

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
  initialProfile,
  originValue,
  destinationValue,
}) => {
  const [origin, setOrigin] = useState(originValue || '');
  const [destination, setDestination] = useState(destinationValue || '');
  const [profile, setProfile] = useState(initialProfile || 'mapbox/driving-traffic');

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
    <Card className="absolute top-4 left-4 z-10 w-80 shadow-lg">
      <CardContent className="p-4 space-y-4">
        <div className="space-y-4">
          <div className="relative">
            <Label 
              htmlFor="origin" 
              className="absolute -left-8 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-blue-500 text-white"
            >
              A
            </Label>
            <Input
              id="origin"
              placeholder="Choose starting point"
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              onBlur={() => handleInputSubmit('origin', origin)}
              onKeyDown={(e) => handleKeyDown(e, 'origin', origin)}
              className="pl-2"
            />
          </div>

          <div className="flex justify-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={onReverse}
              className="h-8 w-8"
            >
              <ArrowUpDown className="h-4 w-4" />
            </Button>
          </div>

          <div className="relative">
            <Label 
              htmlFor="destination" 
              className="absolute -left-8 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white"
            >
              B
            </Label>
            <Input
              id="destination"
              placeholder="Choose destination"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              onBlur={() => handleInputSubmit('destination', destination)}
              onKeyDown={(e) => handleKeyDown(e, 'destination', destination)}
              className="pl-2"
            />
          </div>
        </div>

        <Separator />

        <RadioGroup
          value={profile}
          onValueChange={(value) => {
            setProfile(value);
            onSetProfile(value);
          }}
          className="flex gap-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="mapbox/driving-traffic" id="traffic" />
            <Label htmlFor="traffic">Traffic</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="mapbox/driving" id="driving" />
            <Label htmlFor="driving">Driving</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="mapbox/walking" id="walking" />
            <Label htmlFor="walking">Walking</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="mapbox/cycling" id="cycling" />
            <Label htmlFor="cycling">Cycling</Label>
          </div>
        </RadioGroup>
      </CardContent>
    </Card>
  );
};
