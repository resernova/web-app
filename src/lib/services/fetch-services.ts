import { supabase } from '@/lib/supabase';
import { Database } from '@/types/database.types';

export interface Service {
    availability: any | null
    category_id: string | null
    commission_rate: number | null
    created_at: string | null
    description: string | null
    duration: number
    duration_unit: Database["public"]["Enums"]["duration_unit"] | null
    id: string
    location: string | null
    name: string
    photos: any[] | null
    price: number | null
    provider_id: string | null
    service_name: string | null
    service_type: Database["public"]["Enums"]["service_type"] | null
}

export async function fetchServicesByProvider(providerId: string): Promise<Service[]> {
    console.log("providerId", providerId)
    try {
        const { data, error } = await supabase
            .from('services')
            .select('*')
            .eq('provider_id', providerId)  
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching services:', error);
            throw error;
        }
        return data || [];
    } catch (error) {
        console.error('Failed to fetch services:', error);
        throw error;
    }
}