import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UseFormRegister, FieldErrors, Control, useWatch, useFormContext } from 'react-hook-form';
import { FormData } from './types';
import { daysOfWeek } from '@/lib/types/service';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface LocationStepProps {
  register: UseFormRegister<FormData>;
  errors: FieldErrors<FormData>;
  control: Control<FormData>;
  locations: { location_id: string; address: string }[];
}

export function LocationStep({ register, errors, control, locations }: LocationStepProps) {
  const { setValue, getValues } = useFormContext<FormData>();
  const availability = useWatch({ control, name: 'availability' }) || {};

  const updateAvailability = (day: string, updates: any) => {
    const current = { 
      ...(availability[day] || { isOpen: false, slots: [{ open: '09:00', close: '17:00' }] }), 
      ...updates 
    };
    
    setValue('availability', {
      ...availability,
      [day]: current
    } as any, { shouldValidate: true });
    
    return current;
  };

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">Service Location</h2>
      
      <div>
        <Label htmlFor="location_id">Location</Label>
        <select
          id="location_id"
          {...register('location_id')}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <option value="">Select a location</option>
          {locations.map((location) => (
            <option key={location.location_id} value={location.location_id}>
              {location.address}
            </option>
          ))}
        </select>
        {errors.location_id && <p className="text-red-500 text-sm mt-1">{errors.location_id.message}</p>}
      </div>

      <div className="space-y-4 pt-4">
        <h3 className="font-medium">Availability</h3>
        {daysOfWeek.map((day) => (
          <div key={day} className="flex items-start space-x-4">
            <div className="w-24 pt  -1">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={availability?.[day]?.isOpen || false}
                  onChange={(e) => {
                    updateAvailability(day, { isOpen: e.target.checked });
                  }}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <span className="capitalize">{day}</span>
              </label>
            </div>
            
            {(availability?.[day]?.isOpen || false) && (
              <div className="flex-1 space-y-2">
                {availability?.[day]?.slots?.map((slot: any, slotIndex: number) => (
                  <div key={slotIndex} className="flex items-center space-x-2">
                    <input
                      type="time"
                      value={slot.open}
                      onChange={(e) => {
                        const currentAvailability = getValues('availability') || {};
                        const dayAvailability = currentAvailability[day] || { isOpen: true, slots: [] };
                        const newSlots = [...(dayAvailability.slots || [])];
                        newSlots[slotIndex] = { ...newSlots[slotIndex], open: e.target.value };
                        
                        setValue('availability', {
                          ...currentAvailability,
                          [day]: {
                            ...dayAvailability,
                            slots: newSlots
                          }
                        } as any, { shouldValidate: true });
                      }}
                      className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    />
                    <span>to</span>
                    <input
                      type="time"
                      value={slot.close}
                      onChange={(e) => {
                        const currentAvailability = getValues('availability') || {};
                        const dayAvailability = currentAvailability[day] || { isOpen: true, slots: [] };
                        const newSlots = [...(dayAvailability.slots || [])];
                        newSlots[slotIndex] = { ...newSlots[slotIndex], close: e.target.value };
                        
                        setValue('availability', {
                          ...currentAvailability,
                          [day]: {
                            ...dayAvailability,
                            slots: newSlots
                          }
                        } as any, { shouldValidate: true });
                      }}
                      className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const currentAvailability = getValues('availability') || {};
                        const dayAvailability = currentAvailability[day] || { isOpen: true, slots: [] };
                        const newSlots = (dayAvailability.slots || []).filter((_: any, i: number) => i !== slotIndex);
                        
                        setValue('availability', {
                          ...currentAvailability,
                          [day]: {
                            ...dayAvailability,
                            slots: newSlots
                          }
                        } as any, { shouldValidate: true });
                      }}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    const currentAvailability = getValues('availability') || {};
                    const dayAvailability = currentAvailability[day] || { isOpen: true, slots: [] };
                    const newSlots = [...(dayAvailability.slots || []), { open: '09:00', close: '17:00' }];
                    
                    setValue('availability', {
                      ...currentAvailability,
                      [day]: {
                        ...dayAvailability,
                        slots: newSlots
                      }
                    } as any, { shouldValidate: true });
                  }}
                  className="text-sm text-primary hover:underline"
                >
                  + Add time slot
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
