'use client';

import { useState, useEffect } from 'react';
import { useForm, useWatch, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { fetchServiceCategories, fetchServiceProviderLocation } from '@/lib/services/categories';
import { ServiceInfoStep } from './ServiceInfoStep';
import { LocationStep } from './LocationStep';
import { ServiceOptionsStep } from './ServiceOptionsStep';
import { serviceSchema, FormData, ServiceOption, EditServiceWizardProps } from './types';

export function EditServiceWizard({ serviceId, initialData, onSuccess, onCancel }: EditServiceWizardProps) {
  const [step, setStep] = useState(1);
  const [categories, setCategories] = useState<{ category_id: string; name: string }[]>([]);
  const [locations, setLocations] = useState<{ location_id: string; address: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [serviceOptions, setServiceOptions] = useState<ServiceOption[]>([]);
  const [newOption, setNewOption] = useState({ name: '', price: '', time: 0 });
  const supabase = createClient();
  const { provider } = useAuth();

  // Initialize form methods with default values
  const formMethods = useForm<FormData>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      ...initialData,
      price: initialData.price || 0,
      duration: initialData.duration || 1,
      duration_unit: initialData.duration_unit || 'hours',
      availability: initialData.availability || {},
    },
    mode: 'onTouched',
  });

  const { register, control, handleSubmit, formState: { errors }, trigger, setValue } = formMethods;

  // Watch form values
  const formValues = useWatch({ control });

  useEffect(() => {
    const loadData = async () => {
      if (!provider?.id) return;
      
      try {
        const [categoriesData, locationsData] = await Promise.all([
          fetchServiceCategories(),
          fetchServiceProviderLocation(provider.id)
        ]);
        
        setCategories(categoriesData);
        setLocations(locationsData);

        // Load service options
        const { data: options, error } = await supabase
          .from('service_options')
          .select('*')
          .eq('service_id', serviceId);

        if (!error && options) {
          setServiceOptions(options);
        }
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };

    loadData();
  }, [provider?.id, serviceId]);

  const processSubmit = async (data: FormData) => {
    if (!provider?.id) return;
    
    setIsLoading(true);
    try {
      // Update service
      const { error: updateError } = await supabase
        .from('services')
        .update({
          name: data.name,
          description: data.description,
          price: data.price,
          duration: data.duration,
          duration_unit: data.duration_unit,
          category_id: data.category_id,
          location_id: data.location_id,
          availability: data.availability,
          updated_at: new Date().toISOString(),
        })
        .eq('id', serviceId);

      if (updateError) throw updateError;
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Error updating service:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewOption(prev => ({ ...prev, [name]: value }));
  };

  const handleAddOption = async () => {
    if (!newOption.name || !newOption.price) return;
    
    try {
      const { data, error } = await supabase
        .from('service_options')
        .insert([
          { 
            service_id: serviceId,
            name: newOption.name,
            price: parseFloat(newOption.price),
          }
        ])
        .select();

      if (error) throw error;
      
      if (data?.[0]) {
        setServiceOptions([...serviceOptions, data[0]]);
        setNewOption({ name: '', price: '', time: 0 });
      }
    } catch (error) {
      console.error('Error adding service option:', error);
    }
  };

  const handleRemoveOption = async (optionId: string) => {
    try {
      const { error } = await supabase
        .from('service_options')
        .delete()
        .eq('id', optionId);

      if (error) throw error;
      
      setServiceOptions(serviceOptions.filter(option => option.id !== optionId));
    } catch (error) {
      console.error('Error removing service option:', error);
    }
  };

  const nextStep = async () => {
    let isValid = true;
    
    if (step === 1) {
      isValid = await trigger([
        'name',
        'description',
        'price',
        'duration',
        'duration_unit',
        'category_id'
      ]);
    } else if (step === 2) {
      isValid = await trigger(['location_id']);
    }

    if (isValid) {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <ServiceInfoStep
            register={register}
            errors={errors}
            control={control}
            categories={categories}
          />
        );
      case 2:
        return (
          <LocationStep
            register={register}
            errors={errors}
            control={control}
            locations={locations}
          />
        );
      case 3:
        return (
          <ServiceOptionsStep
            serviceOptions={serviceOptions}
            newOption={newOption}
            onOptionChange={handleOptionChange}
            onAddOption={handleAddOption}
            onRemoveOption={handleRemoveOption}
          />
        );
      default:
        return null;
    }
  };

  // Update form values when initialData changes
  useEffect(() => {
    if (initialData) {
      Object.entries(initialData).forEach(([key, value]) => {
        setValue(key as keyof FormData, value as any);
      });
    }
  }, [initialData, setValue]);

  return (
    <FormProvider {...formMethods}>
      <div className="space-y-6">
        <form onSubmit={formMethods.handleSubmit(processSubmit)} className="space-y-6">
        {/* Step indicators */}
        <div className="flex justify-between mb-6">
          {[1, 2, 3].map((stepNum) => (
            <div key={stepNum} className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step === stepNum
                    ? 'bg-primary text-primary-foreground'
                    : step > stepNum
                    ? 'bg-green-500 text-white'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {step > stepNum ? <Check size={16} /> : stepNum}
              </div>
              <span className="text-xs mt-1">
                {stepNum === 1 ? 'Service Info' : stepNum === 2 ? 'Location' : 'Options'}
              </span>
            </div>
          ))}
        </div>

        {/* Current step content */}
        {renderStep()}

        {/* Navigation buttons */}
        <div className="flex justify-between pt-6">
          <div>
            {step > 1 && (
              <Button type="button" variant="outline" onClick={prevStep}>
                <ChevronLeft className="mr-2 h-4 w-4" /> Back
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            {step < 3 ? (
              <Button type="button" onClick={nextStep}>
                Next <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Saving...' : 'Save Changes'}
              </Button>
            )}
          </div>
        </div>
        </form>
      </div>
    </FormProvider>
  );
}
