import { Database } from "./database.types"

export type Service = {
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