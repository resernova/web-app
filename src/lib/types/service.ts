export type TimeSlot = {
  open: string;
  close: string;
};

export type Availability = {
  [day: string]: {
    isOpen: boolean;
    slots: TimeSlot[];
  };
};

export type ServiceCategory = {
  category_id: string;
  name: string;
  sector_id?: string;
};

export type CreateServiceData = {
  name: string;
  description: string;
  price: number;
  duration: number;
  duration_unit: 'minutes' | 'hours' | 'days';
  category_id: string;
  availability: Availability;
  location_id: string;
};

export const daysOfWeek = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
] as const;

export type DayOfWeek = (typeof daysOfWeek)[number];

export const defaultAvailability: Availability = {
  monday: { isOpen: false, slots: [{ open: '09:00', close: '17:00' }] },
  tuesday: { isOpen: false, slots: [{ open: '09:00', close: '17:00' }] },
  wednesday: { isOpen: false, slots: [{ open: '09:00', close: '17:00' }] },
  thursday: { isOpen: false, slots: [{ open: '09:00', close: '17:00' }] },
  friday: { isOpen: false, slots: [{ open: '09:00', close: '17:00' }] },
  saturday: { isOpen: false, slots: [{ open: '09:00', close: '17:00' }] },
  sunday: { isOpen: false, slots: [{ open: '09:00', close: '17:00' }] },
};
