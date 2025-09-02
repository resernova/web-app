'use client';

import { useContext, useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { EditServiceWizard } from '@/components/dashboard/EditServiceWizard/EditServiceWizard';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function EditServicePage() {
  const { id } = useParams();
  const router = useRouter();
  const [service, setService] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

    const { user, profile, provider} = useAuth();

  useEffect(() => {
    const fetchService = async () => {
      try {
        setLoading(true);
        
        // Fetch service data
        const { data: serviceData, error: serviceError } = await supabase
          .from('services')
          .select('*')
          .eq('id', '9d228488-bc4c-4a5a-b554-ebae96623da4')

        if (serviceError) throw serviceError;
        if (!serviceData) throw new Error('Service not found');

        setService(serviceData);
      } catch (err) {
        console.error('Error fetching service:', err);
        setError('Failed to load service data');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchService();
    }
  }, [user]);

  const handleSuccess = () => {
    router.push('/dashboard/services');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-4">
        <div className="bg-red-50 text-red-600 p-4 rounded-lg max-w-md">
          <h2 className="text-xl font-semibold mb-2">Error</h2>
          <p className="mb-4">{error}</p>
          <Button onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
          </Button>
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-4">
        <div className="bg-yellow-50 text-yellow-700 p-4 rounded-lg max-w-md">
          <h2 className="text-xl font-semibold mb-2">Service Not Found</h2>
          <p className="mb-4">The service you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => router.push('/dashboard/services')}>
            Back to Services
          </Button>
        </div>
      </div>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button 
          variant="ghost" 
          className="mb-4"
          onClick={() => router.back()}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Edit Service</h1>
        <p className="text-muted-foreground">Update your service details and options</p>
      </div>
      
      <div className="bg-card rounded-lg border p-6">
        <EditServiceWizard 
          serviceId={id as string}
          initialData={{
            name: service.name,
            description: service.description,
            price: service.price,
            duration: service.duration,
            duration_unit: service.duration_unit,
            category_id: service.category_id,
            location_id: service.location_id,
            availability: service.availability || {}
          }}
          onSuccess={handleSuccess}
        />
      </div>
    </main>
  );
}