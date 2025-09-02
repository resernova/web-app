import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { UseFormRegister, FieldErrors, Control, useWatch } from 'react-hook-form';
import { FormData } from './types';

interface ServiceInfoStepProps {
  register: UseFormRegister<FormData>;
  errors: FieldErrors<FormData>;
  control: Control<FormData>;
  categories: { category_id: string; name: string }[];
}

export function ServiceInfoStep({ register, errors, control, categories }: ServiceInfoStepProps) {
  const durationUnit = useWatch({ control, name: 'duration_unit' });
  
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Service Information</h2>
      <div>
        <Label htmlFor="name">Service Name</Label>
        <Input
          id="name"
          placeholder="e.g., Haircut, Massage, Consultation"
          {...register('name')}
          className={errors.name ? 'border-red-500' : ''}
        />
        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Describe your service in detail"
          {...register('description')}
          className={errors.description ? 'border-red-500' : ''}
          rows={4}
        />
        {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="price">Price ($)</Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            placeholder="0.00"
            {...register('price', { valueAsNumber: true })}
            className={errors.price ? 'border-red-500' : ''}
          />
          {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>}
        </div>

        <div className="flex gap-2">
          <div className="flex-1">
            <Label htmlFor="duration">Duration</Label>
            <Input
              id="duration"
              type="number"
              min="1"
              {...register('duration', { valueAsNumber: true })}
              className={errors.duration ? 'border-red-500' : ''}
            />
            {errors.duration && <p className="text-red-500 text-sm mt-1">{errors.duration.message}</p>}
          </div>
          <div className="w-32">
            <Label htmlFor="duration_unit">Unit</Label>
            <select
              id="duration_unit"
              {...register('duration_unit')}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="minutes">Minutes</option>
              <option value="hours">Hours</option>
              <option value="days">Days</option>
            </select>
            {durationUnit === 'minutes' && (
              <p className="text-xs text-muted-foreground mt-1">e.g., 30 minutes</p>
            )}
            {durationUnit === 'hours' && (
              <p className="text-xs text-muted-foreground mt-1">e.g., 1.5 hours</p>
            )}
            {durationUnit === 'days' && (
              <p className="text-xs text-muted-foreground mt-1">e.g., 2 days</p>
            )}
          </div>
        </div>
      </div>

      <div>
        <Label htmlFor="category_id">Category</Label>
        <select
          id="category_id"
          {...register('category_id')}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <option value="">Select a category</option>
          {categories.map((category) => (
            <option key={category.category_id} value={category.category_id}>
              {category.name}
            </option>
          ))}
        </select>
        {errors.category_id && <p className="text-red-500 text-sm mt-1">{errors.category_id.message}</p>}
      </div>
    </div>
  );
}
