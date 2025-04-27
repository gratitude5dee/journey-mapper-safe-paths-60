
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ArrowDown } from 'lucide-react';

const DirectionsControl: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isFullyExpanded, setIsFullyExpanded] = useState(false);

  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10">
      <div 
        className="relative flex items-center"
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => !isFullyExpanded && setIsExpanded(false)}
      >
        <div 
          className={`flex items-center bg-background/30 backdrop-blur-md rounded-full transition-all duration-300 ease-out cursor-pointer ${isExpanded ? 'pr-4' : 'pr-0'}`}
          onClick={() => {
            setIsFullyExpanded(!isFullyExpanded);
            setIsExpanded(true);
          }}
        >
          <div className="w-10 h-10 rounded-full flex items-center justify-center text-white/70 hover:text-white/90 transition-colors">
            <ArrowDown className="h-5 w-5" />
          </div>
          <span 
            className={`text-white/90 font-semibold whitespace-nowrap overflow-hidden transition-all duration-300 ${
              isExpanded ? 'max-w-[100px] opacity-100' : 'max-w-0 opacity-0'
            }`}
          >
            Directions
          </span>
        </div>
        
        {isFullyExpanded && (
          <Card className="absolute top-12 left-1/2 -translate-x-1/2 w-[400px] bg-background/30 backdrop-blur-md backdrop-saturate-150 border border-white/20 shadow-lg rounded-xl overflow-hidden">
            <CardContent className="p-4 space-y-4">
              <div className="space-y-2">
                <div className="flex items-center space-x-2 bg-white/10 p-2 rounded-lg">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-400 rounded-lg flex items-center justify-center text-white font-bold">
                    A
                  </div>
                  <Input 
                    placeholder="Choose a starting place"
                    className="bg-transparent border-none text-white placeholder:text-white/50"
                  />
                </div>
                
                <div className="flex items-center space-x-2 bg-white/10 p-2 rounded-lg">
                  <div className="flex-shrink-0 w-8 h-8 bg-purple-400 rounded-lg flex items-center justify-center text-white font-bold">
                    B
                  </div>
                  <Input 
                    placeholder="Choose destination"
                    className="bg-transparent border-none text-white placeholder:text-white/50"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                {['Traffic', 'Driving', 'Walking', 'Cycling'].map((mode) => (
                  <Button
                    key={mode}
                    variant="ghost"
                    className="text-white/70 hover:text-white hover:bg-white/10"
                  >
                    {mode}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default DirectionsControl;
