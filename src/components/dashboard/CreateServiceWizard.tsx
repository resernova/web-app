'use client';

import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Plus, X, Check, Clock, Calendar, MapPin, Tag, Info, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { daysOfWeek, defaultAvailability } from '@/lib/types/service';
import { fetchServiceCategories, fetchServiceProviderLocation } from '@/lib/services/categories';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Checkbox } from '../ui/checkbox';

// Schema remains the same
const serviceSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  price: z.number().min(0, 'Price must be a positive number'),
  duration: z.number().min(1, 'Duration must be at least 1'),
  duration_unit: z.enum(['minutes', 'hours', 'days']),
  category_id: z.string().min(1, 'Please select a category'),
  location_id: z.string().min(1, 'Please select a location'),
  availability: z.record(
    z.string(),
    z.object({
      isOpen: z.boolean(),
      slots: z.array(
        z.object({
          open: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)'),
          close: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)'),
        })
      ),
    })
  ),
});

type FormData = z.infer<typeof serviceSchema>;

// Define fields for each step for targeted validation
const step1Fields: (keyof FormData)[] = ['name', 'description', 'price', 'duration', 'duration_unit', 'category_id'];
const step2Fields: (keyof FormData)[] = ['location_id'];

export function CreateServiceWizard({ onSuccess }: { onSuccess?: () => void }) {
  const [step, setStep] = useState(1);
  const [categories, setCategories] = useState<{ category_id: string; name: string }[]>([]);
  const [locations, setLocations] = useState<{ location_id: string; address: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClient();
  const { user, profile, provider, loading } = useAuth();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    trigger, // <-- Get the trigger function
  } = useForm<FormData>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      availability: defaultAvailability,
      duration: 1,
      duration_unit: 'hours',
      price: 0,
    },
    // Set mode to 'onTouched' to avoid showing errors too early
    mode: 'onTouched',
  });

  // This hook is not needed in the CreateServiceWizard
  // if (loading) return <div>Loading...</div>;

  useEffect(() => {
    const loadData = async () => {
      if (!provider?.id) return; // Don't fetch if provider ID is not available
      try {
        const categoriesData = await fetchServiceCategories();
        setCategories(categoriesData);

        const locationsData = await fetchServiceProviderLocation(provider.id);
        setLocations(locationsData);
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };

    if (!loading) { // Only load data once auth context is resolved
      loadData();
    }
  }, [provider?.id, loading]);

  // The actual submission logic, called only when the final form is valid.
  const processSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      if (!provider) throw new Error('Service provider not found');

      const { location_id, ...serviceData } = data;
      const selectedLocation = locations.find((loc) => loc.location_id === location_id);

      const { data: insertedData, error } = await supabase.from('services').insert([{
        ...serviceData,
        location: selectedLocation?.address,
        provider_id: provider.id,
      }]).select();

      if (error) throw error;

      console.log('Service created successfully:', insertedData);
      onSuccess?.();

    } catch (error) {
      console.error('Error creating service:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const nextStep = async () => {
    const fieldsToValidate = step === 1 ? step1Fields : step2Fields;
    const isValid = await trigger(fieldsToValidate, { shouldFocus: true });

    if (isValid) {
      setStep((prev) => Math.min(prev + 1, 3));
    }
  };

  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  if (loading) return <div>Loading initial data...</div>

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Create New Service</CardTitle>
        <CardDescription>Step {step} of 3: {step === 1 ? 'Basic Information' : step === 2 ? 'Location' : 'Availability'}</CardDescription>
      </CardHeader>
      <CardContent>
        {/* The form now calls processSubmit on final validation */}
        <form onSubmit={(e) => e.preventDefault()}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && step < 3) e.preventDefault();
          }}>
          <div className="space-y-6">
            {step === 1 && (
              <div className="space-y-4 animate-in fade-in-0 duration-300">
                <h3 className="text-lg font-medium">Basic Information</h3>
                <div className="space-y-2">
                  <Label htmlFor="name">Service Name</Label>
                  <Input
                    id="name"
                    placeholder="e.g., Professional Cleaning"
                    {...register('name')}
                  />
                  {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your service in detail..."
                    className="min-h-[100px]"
                    {...register('description')}
                  />
                  {errors.description && <p className="text-sm text-red-500">{errors.description.message}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">Price ($)</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      {...register('price', { valueAsNumber: true })}
                    />
                    {errors.price && <p className="text-sm text-red-500">{errors.price.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label>Duration</Label>
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        min="1"
                        {...register('duration', { valueAsNumber: true })}
                        className="w-20"
                      />
                      <Controller
                        name="duration_unit"
                        control={control}
                        render={({ field }) => (
                          <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger className="w-[180px]">
                              <SelectValue placeholder="Select unit" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="minutes">Minutes</SelectItem>
                              <SelectItem value="hours">Hours</SelectItem>
                              <SelectItem value="days">Days</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </div>
                    {errors.duration && <p className="text-sm text-red-500">{errors.duration.message}</p>}
                    {errors.duration_unit && <p className="text-sm text-red-500">{errors.duration_unit.message}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Controller
                    name="category_id"
                    control={control}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category.category_id} value={category.category_id}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.category_id && <p className="text-sm text-red-500">{errors.category_id.message}</p>}
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4 animate-in fade-in-0 duration-300">
                <h3 className="text-lg font-medium">Location</h3>
                <div className="space-y-2">
                  <Label htmlFor="location">Service Location</Label>
                  <Controller
                    name="location_id"
                    control={control}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a location" />
                        </SelectTrigger>
                        <SelectContent>
                          {locations.map((location) => (
                            <SelectItem key={location.location_id} value={location.location_id}>
                              {location.address}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.location_id && <p className="text-sm text-red-500">{errors.location_id.message}</p>}
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4 animate-in fade-in-0 duration-300">
                <h3 className="text-lg font-medium">Availability</h3>
                <p className="text-sm text-muted-foreground">
                  Set your weekly availability for this service. This will be the default schedule.
                </p>

                {/* --- The availability logic remains the same --- */}
                {/* No changes needed here */}
                <div className="space-y-2">
                  {daysOfWeek.map((day) => (
                    <div key={day} className="p-4 border rounded-md">
                      <div className="flex items-center justify-between">
                        <Label htmlFor={`isOpen-${day}`} className="capitalize font-medium flex-1 cursor-pointer">
                          {day}
                        </Label>
                        <Controller
                          name={`availability.${day}.isOpen`}
                          control={control}
                          render={({ field }) => (
                            <div className='flex items-center space-x-2'>
                              <span>Closed</span>
                              <Checkbox
                                id={`isOpen-${day}`}
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                className="data-[state=checked]:bg-green-500"
                              />
                              <span>Open</span>
                            </div>
                          )}
                        />
                      </div>
                      {watch(`availability.${day}.isOpen`) && (
                        <div className="mt-4 space-y-2">
                          {watch(`availability.${day}.slots`).map((_, slotIndex) => (
                            <div key={slotIndex} className="flex items-center gap-2">
                              <Input type="time" {...register(`availability.${day}.slots.${slotIndex}.open`)} className="w-32" />
                              <span>to</span>
                              <Input type="time" {...register(`availability.${day}.slots.${slotIndex}.close`)} className="w-32" />
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                  const slots = watch(`availability.${day}.slots`);
                                  setValue(`availability.${day}.slots`, slots.filter((_, i) => i !== slotIndex));
                                }}
                              >
                                <X className="h-4 w-4 text-red-500" />
                              </Button>
                            </div>
                          ))}
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const slots = watch(`availability.${day}.slots`);
                              setValue(`availability.${day}.slots`, [...slots, { open: '09:00', close: '17:00' }]);
                            }}
                          >
                            <Plus className="mr-2 h-4 w-4" /> Add slot
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

              </div>
            )}

            <div className="flex justify-between pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                disabled={step === 1}
              >
                <ChevronLeft className="mr-2 h-4 w-4" /> Previous
              </Button>

              {step < 3 ? (
                <Button type="button" onClick={nextStep}>
                  Next <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button
                  type="button" // <- important: not submit
                  onClick={handleSubmit(processSubmit)} // call RHF submit here
                  disabled={isLoading}
                >
                  {isLoading ? 'Creating...' : 'Create Service'}
                </Button>
              )}

            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}