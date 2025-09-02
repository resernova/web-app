import { ServiceCategory } from '@/lib/types/service';
import { supabase } from '../auth';
import { ProviderLocation } from '../types/serviceProviderLocation';


export async function fetchServiceCategories(): Promise<ServiceCategory[]> {
    try {
        const { data, error } = await supabase
            .from('service_categories')
            .select('category_id, name, sector_id')
            .order('name', { ascending: true });

        if (error) {
            console.error('Error fetching service categories:', error);
            throw error;
        }

        return data || [];
    } catch (error) {
        console.error('Failed to fetch service categories:', error);
        return [];
    }
}

export async function fetchServiceProviderLocation(provider_id: string): Promise<ProviderLocation[]> {
    try {
        const { data, error } = await supabase
            .from('provider_locations')
            .select('*')
            .eq('provider_id', provider_id)
            .order('address', { ascending: true });
        console.log(data)
        if (error) {
            console.error('Error fetching provider locations:', error);
            throw error;
        }

        return data || [];
    } catch (error) {
        console.error('Failed to fetch provider locations:', error);
        return [];
    }
}