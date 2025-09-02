import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { ServiceOption } from './types';

interface ServiceOptionsStepProps {
  serviceOptions: ServiceOption[];
  newOption: { name: string; price: string, time: number };
  onOptionChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onAddOption: () => void;
  onRemoveOption: (id: string) => void;
}

export function ServiceOptionsStep({
  serviceOptions,
  newOption,
  onOptionChange,
  onAddOption,
  onRemoveOption,
}: ServiceOptionsStepProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">Service Options</h2>
      
      <div className="space-y-4">
        <h3 className="font-medium">Add New Option</h3>
        <div className="flex gap-2">
          <div className="flex-1">
            <Input
              name="name"
              placeholder="Option name (e.g., Deluxe, Premium, Basic)"
              value={newOption.name}
              onChange={onOptionChange}
            />
          </div>
          <div className="w-32">
            <Input
              name="price"
              type="number"
              step="0.01"
              placeholder="Price"
              value={newOption.price}
              onChange={onOptionChange}
            />
          </div>
          {/* add here time for the service option */}
          <div className="w-32">
            <Input
              name="time"
              type="number"
              placeholder="Time"
              value={newOption.time}
              onChange={onOptionChange}
            />
          </div>

          <Button 
            type="button" 
            onClick={onAddOption} 
            disabled={!newOption.name || !newOption.price}
            className="self-end"
          >
            Add Option
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="font-medium">Current Options</h3>
        {serviceOptions.length === 0 ? (
          <p className="text-sm text-muted-foreground">No options added yet.</p>
        ) : (
          <div className="border rounded-md divide-y">
            {serviceOptions.map((option) => (
              <div key={option.id} className="flex items-center justify-between p-3">
                <div>
                  <p className="font-medium">{option.name}</p>
                  <p className="text-sm text-muted-foreground">
                    ${parseFloat(option.price as unknown as string).toFixed(2)}
                  </p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => onRemoveOption(option.id)}
                  className="text-red-500 hover:bg-red-50 hover:text-red-600"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
