import { z } from 'zod';

export const serviceSchema = z.object({
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

export type FormData = z.infer<typeof serviceSchema>;

export const step1Fields: (keyof FormData)[] = ['name', 'description', 'price', 'duration', 'duration_unit', 'category_id'];
export const step2Fields: (keyof FormData)[] = ['location_id'];

export interface ServiceOption {
  id: string;
  name: string;
  price: number;
  service_id: string;
  created_at: string;
  updated_at: string;
}

export interface EditServiceWizardProps {
  serviceId: string;
  initialData: Partial<FormData>;
  onSuccess?: () => void;
  onCancel?: () => void;
}
