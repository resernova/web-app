'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { CreateServiceWizard } from '../../../../components/dashboard/CreateServiceWizard';

export default function NewServicePage() {
  const router = useRouter();
  const { user, profile, provider } = useAuth();

  const handleSuccess = () => {
    router.push('/dashboard/services');
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleCancel}
          className="mr-2"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">Create New Service</h1>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <CreateServiceWizard 
          onSuccess={handleSuccess}
          setShowCreateService={() => router.push('/dashboard/services')}
        />
      </div>
    </div>
  );
}
