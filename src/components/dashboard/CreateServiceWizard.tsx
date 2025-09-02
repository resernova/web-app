'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Check, ChevronLeft, ChevronRight, Loader2, Plus, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';

import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { fetchServiceCategories, fetchServiceProviderLocation } from '@/lib/services/categories';
import { DashboardView } from '@/app/dashboard/page';
import { toast } from 'react-toastify';

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
          open: z.string(),
          close: z.string(),
        })
      ),
    })
  ),
});

type FormData = z.infer<typeof serviceSchema>;

const defaultAvailability = {
  monday: { isOpen: false, slots: [{ open: '09:00', close: '17:00' }] },
  tuesday: { isOpen: false, slots: [{ open: '09:00', close: '17:00' }] },
  wednesday: { isOpen: false, slots: [{ open: '09:00', close: '17:00' }] },
  thursday: { isOpen: false, slots: [{ open: '09:00', close: '17:00' }] },
  friday: { isOpen: false, slots: [{ open: '09:00', close: '17:00' }] },
  saturday: { isOpen: false, slots: [{ open: '09:00', close: '17:00' }] },
  sunday: { isOpen: false, slots: [{ open: '09:00', close: '17:00' }] },
};

const step1Fields = ['name', 'description', 'price', 'duration', 'duration_unit', 'category_id'] as const;
const step2Fields = ['location_id'] as const;

export function CreateServiceWizard({ onSuccess, setShowCreateService }: { onSuccess?: () => void, setShowCreateService?: (currentView: DashboardView) => void }) {
  const [step, setStep] = useState<'1' | '2' | '3'>('1');
  const [categories, setCategories] = useState<{ category_id: string; name: string }[]>([]);
  const [locations, setLocations] = useState<{ location_id: string; address: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
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
    mode: 'onTouched',
  });



  useEffect(() => {
    const loadData = async () => {
      if (!provider?.id) return;
      try {
        const categoriesData = await fetchServiceCategories();
        setCategories(categoriesData);

        const locationsData = await fetchServiceProviderLocation(provider.id);
        setLocations(locationsData);
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };

    if (!loading) {
      loadData();
    }
  }, [provider?.id, loading]);

  // The actual submission logic, called only when the final form is valid.
  const processSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      if (!provider) throw new Error('Service provider not found');

      const { location_id, ...serviceData } = data;
      const selectedLocation = locations.find((loc) => loc.location_id === location_id);

      const { data: insertedData, error } = await supabase
        .from('services')
        .insert([{
          ...serviceData,
          location: selectedLocation?.address,
          provider_id: provider.id,
        }])
        .select()
        .single();

      if (error) throw error;

      toast.success('Success! Service created successfully');

      onSuccess?.();
    } catch (error) {
      console.error('Error creating service:', error);
      setError(error instanceof Error ? error.message : 'Failed to create service');
      toast.error('Error, Failed to create service. Please try again.');
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = async () => {
    const fieldsToValidate = step === '1' ? step1Fields : step2Fields;
    const isValid = await trigger(fieldsToValidate, { shouldFocus: true });

    if (isValid) {
      setStep((prev) => (Number(prev) + 1).toString() as '1' | '2' | '3');
    }
  };

  const prevStep = () => setStep((prev) => (Number(prev) - 1).toString() as '1' | '2' | '3');

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-2 text-sm font-medium">Loading service data...</span>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto">
      <Card className="border-0 shadow-sm">
        <CardHeader className="border-b">
          <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
            <div>
              <h3 className="text-xl font-semibold text-gray-900">Create New Service</h3>
              <p className="text-sm text-muted-foreground">
                Step {step} of 3: {step === '1' ? 'Basic Information' : step === '2' ? 'Location' : 'Availability'}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                type="button"
                variant="ghost"
                className="text-sm"
                onClick={() => setShowCreateService?.('overview')}
                disabled={isLoading || isSubmitting}
              >
                Cancel
              </Button>
            </div>
          </div>

          {/* Progress Steps */}
          <div className="pt-4">
            <div className="flex items-center">
              {[1, 2, 3].map((stepNum) => (
                <div key={stepNum} className="flex items-center">
                  <div
                    className={cn(
                      'flex items-center justify-center w-8 h-8 rounded-full',
                      Number(step) >= stepNum
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-600',
                      'text-sm font-medium'
                    )}
                  >
                    {Number(step) > stepNum ? <Check className="h-4 w-4" /> : stepNum}
                  </div>
                  {stepNum < 3 && (
                    <div className={cn(
                      'h-0.5 w-12 mx-1',
                      Number(step) > stepNum ? 'bg-blue-600' : 'bg-gray-200'
                    )} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <form
            onSubmit={handleSubmit(processSubmit)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && Number(step) < 3) e.preventDefault();
            }}
            className="space-y-6"
          >
            <div className="space-y-8">
              {step === '1' && (
                <div>
                  <div className="mb-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-1">Service Details</h3>
                    <p className="text-sm text-gray-500">Provide basic information about your service</p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Service Name
                      </Label>
                      <Input
                        id="name"
                        {...register('name')}
                        placeholder="e.g., Professional Photography"
                        className={errors.name ? 'border-red-500' : ''}
                      />
                      {errors.name && (
                        <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                      </Label>
                      <Textarea
                        id="description"
                        {...register('description')}
                        placeholder="Describe your service in detail"
                        rows={4}
                        className={errors.description ? 'border-red-500' : ''}
                      />
                      {errors.description && (
                        <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                          Price ($)
                        </Label>
                        <Input
                          id="price"
                          type="number"
                          {...register('price', { valueAsNumber: true })}
                          placeholder="0.00"
                          step="0.01"
                          min="0"
                          className={errors.price ? 'border-red-500' : ''}
                        />
                        {errors.price && (
                          <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">
                            Duration
                          </Label>
                          <Input
                            id="duration"
                            type="number"
                            {...register('duration', { valueAsNumber: true })}
                            placeholder="1"
                            min="1"
                            className={errors.duration ? 'border-red-500' : ''}
                          />
                        </div>
                        <div>
                          <Label htmlFor="duration_unit" className="block text-sm font-medium text-gray-700 mb-1">
                            Unit
                          </Label>
                          <Select
                            onValueChange={(value) => setValue('duration_unit', value as 'minutes' | 'hours' | 'days')}
                            value={watch('duration_unit')}
                          >
                            <SelectTrigger className={errors.duration_unit ? 'border-red-500' : ''}>
                              <SelectValue placeholder="Select unit" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="minutes">Minutes</SelectItem>
                              <SelectItem value="hours">Hours</SelectItem>
                              <SelectItem value="days">Days</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="category_id" className="block text-sm font-medium text-gray-700 mb-1">
                        Category
                      </Label>
                      <Select
                        onValueChange={(value) => setValue('category_id', value)}
                        value={watch('category_id')}
                      >
                        <SelectTrigger className={errors.category_id ? 'border-red-500' : ''}>
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
                      {errors.category_id && (
                        <p className="mt-1 text-sm text-red-600">{errors.category_id.message}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {step === '2' && (
                <div>
                  <div className="mb-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-1">Location</h3>
                    <p className="text-sm text-gray-500">Where will this service be provided?</p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="location_id" className="block text-sm font-medium text-gray-700 mb-1">
                        Select Location
                      </Label>
                      <Select
                        onValueChange={(value) => setValue('location_id', value)}
                        value={watch('location_id')}
                      >
                        <SelectTrigger className={errors.location_id ? 'border-red-500' : ''}>
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
                      {errors.location_id && (
                        <p className="mt-1 text-sm text-red-600">{errors.location_id.message}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {step === '3' && (
                <div>
                  <div className="mb-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-1">Availability</h3>
                    <p className="text-sm text-gray-500">When is this service available?</p>
                  </div>

                  <div className="space-y-6">
                    {Object.entries(defaultAvailability).map(([day, dayData]) => (
                      <div key={day} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id={`${day}-enabled`}
                              checked={watch(`availability.${day}.isOpen`)}
                              onCheckedChange={(checked) => {
                                setValue(`availability.${day}.isOpen`, checked as boolean);
                              }}
                            />
                            <Label htmlFor={`${day}-enabled`} className="capitalize">
                              {day}
                            </Label>
                          </div>
                        </div>

                        {watch(`availability.${day}.isOpen`) && (
                          <div className="ml-8 space-y-2">
                            {watch(`availability.${day}.slots`).map((slot, index) => (
                              <div key={index} className="flex items-center space-x-2">
                                <Input
                                  type="time"
                                  {...register(`availability.${day}.slots.${index}.open` as const)}
                                  className="w-32"
                                />
                                <span>to</span>
                                <Input
                                  type="time"
                                  {...register(`availability.${day}.slots.${index}.close` as const)}
                                  className="w-32"
                                />
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => {
                                    const slots = watch(`availability.${day}.slots`);
                                    setValue(
                                      `availability.${day}.slots`,
                                      slots.filter((_, i) => i !== index)
                                    );
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
                              className="mt-2"
                              onClick={() => {
                                const slots = watch(`availability.${day}.slots`);
                                setValue(`availability.${day}.slots`, [
                                  ...slots,
                                  { open: '09:00', close: '17:00' },
                                ]);
                              }}
                            >
                              <Plus className="mr-2 h-4 w-4" /> Add time slot
                            </Button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="pt-6 mt-8 border-t border-gray-200">
              <div className="flex justify-between">
                <div>
                  {Number(step) > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={prevStep}
                      disabled={isLoading || isSubmitting}
                      className="flex items-center gap-2"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Back
                    </Button>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  {Number(step) < 3 ? (
                    <Button
                      type="button"
                      onClick={nextStep}
                      disabled={isLoading || isSubmitting}
                      className="flex items-center gap-2"
                    >
                      Next
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      disabled={isLoading || isSubmitting}
                      className="flex items-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Creating...
                        </>
                      ) : (
                        <>
                          <Check className="h-4 w-4" />
                          Create Service
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}