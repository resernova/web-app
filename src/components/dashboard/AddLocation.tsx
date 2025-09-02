import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { DashboardView } from "@/app/dashboard/page";
import CardContent from "@mui/material/CardContent";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'react-toastify';

const locationSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    address: z.string().min(1, 'Address is required'),
    city: z.string().min(1, 'City is required'),
    postal_code: z.string(),
    country: z.string().min(1, 'Country is required'),
    phone: z.string().min(1, 'Phone number is required'),
    email: z.string().email('Invalid email address'),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
});

type LocationFormData = z.infer<typeof locationSchema>;

export default function AddLocation(
    { onSuccess, setShowAddLocation }: { onSuccess?: () => void, setShowAddLocation?: (currentView: DashboardView) => void }
) {
    const [isLoading, setIsLoading] = useState(false);
    const supabase = createClientComponentClient();
    const { user, profile, provider, loading } = useAuth();

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm<LocationFormData>({
        resolver: zodResolver(locationSchema),
        defaultValues: {
            name: '',
            address: '',
            city: '',
            postal_code: '',
            country: '',
            phone: '',
            email: '',
        },
    });

    const onSubmit = async (data: LocationFormData) => {
        try {
            setIsLoading(true);

            if (!provider) {
                throw new Error('No active session');

            }

            console.log(provider);
            const { error } = await supabase
                .from('provider_locations')
                .insert([
                    {
                        address: data.address,
                        contact_info: {
                            name: data.name,
                            city: data.city,
                            postal_code: data.postal_code,
                            country: data.country,
                            phone: data.phone,
                            email: data.email,
                        },
                        provider_id: provider.id,
                    }
                ]);

            if (error) throw error;

            toast.success('Location added successfully');

            reset();
            onSuccess?.();
            setShowAddLocation?.('overview');
        } catch (error) {
            console.error('Error adding location:', error);
            toast.error('Failed to add location. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card>
            <form onSubmit={handleSubmit(onSubmit)}>
                <CardHeader>
                    <CardTitle>Add New Location</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="col-span-2">
                            <Label htmlFor="name">Location Name</Label>
                            <Input
                                id="name"
                                placeholder="Main Office"
                                {...register('name')}
                                className={errors.name ? 'border-red-500' : ''}
                            />
                            {errors.name && (
                                <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                            )}
                        </div>

                        <div className="col-span-2">
                            <Label htmlFor="address">Address</Label>
                            <Input
                                id="address"
                                placeholder="123 Main St"
                                {...register('address')}
                                className={errors.address ? 'border-red-500' : ''}
                            />
                            {errors.address && (
                                <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>
                            )}
                        </div>

                        <div>
                            <Label htmlFor="city">City</Label>
                            <Input
                                id="city"
                                placeholder="New York"
                                {...register('city')}
                                className={errors.city ? 'border-red-500' : ''}
                            />
                            {errors.city && (
                                <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>
                            )}
                        </div>

                        <div>
                            <Label htmlFor="postal_code">Postal Code</Label>
                            <Input
                                id="postal_code"
                                placeholder="10001"
                                {...register('postal_code')}
                                className={errors.postal_code ? 'border-red-500' : ''}
                            />
                            {errors.postal_code && (
                                <p className="text-red-500 text-sm mt-1">{errors.postal_code.message}</p>
                            )}
                        </div>

                        <div>
                            <Label htmlFor="country">Country</Label>
                            <Input
                                id="country"
                                placeholder="Maroc"
                                {...register('country')}
                                className={errors.country ? 'border-red-500' : ''}
                            />
                            {errors.country && (
                                <p className="text-red-500 text-sm mt-1">{errors.country.message}</p>
                            )}
                        </div>

                        <div>
                            <Label htmlFor="phone">Phone Number</Label>
                            <Input
                                id="phone"
                                type="tel"
                                placeholder="+212 612345678"
                                {...register('phone')}
                                className={errors.phone ? 'border-red-500' : ''}
                            />
                            {errors.phone && (
                                <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
                            )}
                        </div>

                        <div>
                            <Label htmlFor="email">Email Address</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="contact@example.com"
                                {...register('email')}
                                className={errors.email ? 'border-red-500' : ''}
                            />
                            {errors.email && (
                                <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                            )}
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="flex justify-end gap-2">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowAddLocation?.('overview')}
                        disabled={isLoading}
                    >
                        Cancel
                    </Button>
                    <Button type="submit" disabled={isLoading} onClick={handleSubmit(onSubmit)}>
                        {isLoading ? 'Saving...' : 'Save Location'}
                    </Button>
                </CardFooter>
            </form>
        </Card>
    );
}