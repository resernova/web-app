'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Edit, Trash2, Clock, MapPin } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { fetchServicesByProvider } from '@/lib/services/fetch-services';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import Skeleton from '@mui/material/Skeleton';
import { Service } from '@/types';

export default function ServicesPage() {
  const router = useRouter();
  const { provider } = useAuth();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadServices = async () => {
      if (provider?.id) {
        setLoading(true);
        try {
          const data = await fetchServicesByProvider(provider.id);
          setServices(data);
        } catch (error) {
          console.error('Error loading services:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    loadServices();
  }, [provider?.id]);

  const handleEdit = (serviceId: string) => {
    router.push(`/dashboard/services/edit/${serviceId}`);
  };

  const handleDelete = async (serviceId: string) => {
    // Implement delete functionality
    try {
      // await deleteService(serviceId);
      setServices(services.filter((service: any) => service?.id !== serviceId));
      toast.success('Service deleted successfully');
    } catch (error) {
      toast.error('Failed to delete service');
    }
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-9 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <div className="p-6 space-y-4">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-1/2" />
                <div className="flex items-center justify-between pt-4">
                  <Skeleton className="h-4 w-16" />
                  <div className="flex space-x-2">
                    <Skeleton className="h-9 w-9 rounded-md" />
                    <Skeleton className="h-9 w-9 rounded-md" />
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center">
        <div className="text-red-500 mb-4">Error loading services. Please try again.</div>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Services</h1>
          <p className="text-gray-600 mt-1">Manage your offered services and pricing</p>
        </div>
        <Button
          onClick={() => router.push('/dashboard/services/new')}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus className="mr-2 h-4 w-4" /> Add New Service
        </Button>
      </div>

      {services.length === 0 ? (
        <Card className="text-center p-12">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="bg-blue-100 p-4 rounded-full">
              <Plus className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-medium">No services yet</h3>
            <p className="text-gray-500 max-w-md">Get started by adding your first service to showcase what you offer.</p>
            <Button
              onClick={() => router.push('/dashboard/services/new')}
              className="mt-4 bg-blue-600 hover:bg-blue-700 text-white"
            >
              Create Service
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service : any) => (
            <Card key={service.id} className="overflow-hidden transition-shadow hover:shadow-md">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg text-gray-900">{service.title}</CardTitle>
                    <CardDescription className="mt-1">{service.category}</CardDescription>
                  </div>
                  <div className="text-2xl font-bold text-blue-600">${service.price}</div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm line-clamp-3">{service.description}</p>
                <div className="mt-4 space-y-2 text-sm">
                  <div className="flex items-center text-gray-500">
                    <Clock className="h-4 w-4 mr-2" />
                    <span>{service.duration} minutes</span>
                  </div>
                  {service.location && (
                    <div className="flex items-center text-gray-500">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span className="truncate">{service.location}</span>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex justify-end space-x-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(service.id)}
                  className="text-gray-700 hover:bg-gray-100"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(service.id)}
                  className="text-red-600 hover:bg-red-50 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}