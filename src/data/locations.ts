export interface ServiceLocation {
  id: string;
  name: string;
  type: "hospital" | "police" | "passport" | "municipality" | "csc" | "bank" | "rto";
  address: string;
  phone: string;
  distance: string;
  lat: number; // custom map grid coords (0 to 100)
  lng: number; // custom map grid coords (0 to 100)
  workingHours: string;
}

export const serviceLocations: ServiceLocation[] = [
  {
    id: "loc-1",
    name: "Civil Hospital & Trauma Center",
    type: "hospital",
    address: "Circular Road, Near Bus Stand, Sector 12",
    phone: "+91 11 2345 6789",
    distance: "1.2 km",
    lat: 35,
    lng: 45,
    workingHours: "24/7"
  },
  {
    id: "loc-2",
    name: "Sector-5 Police Station",
    type: "police",
    address: "Police Lines, Sector 5, City Center",
    phone: "+91 11 2345 0100",
    distance: "0.8 km",
    lat: 42,
    lng: 38,
    workingHours: "24/7"
  },
  {
    id: "loc-3",
    name: "Passport Seva Kendra (PSK)",
    type: "passport",
    address: "Shubham Tower, Ground Floor, Sector 16",
    phone: "1800-258-1800",
    distance: "3.5 km",
    lat: 20,
    lng: 60,
    workingHours: "09:00 AM - 05:00 PM (Mon-Fri)"
  },
  {
    id: "loc-4",
    name: "Municipal Corporation Office",
    type: "municipality",
    address: "Town Hall, Ambedkar Chowk",
    phone: "+91 11 2345 9912",
    distance: "2.1 km",
    lat: 55,
    lng: 50,
    workingHours: "10:00 AM - 05:00 PM (Mon-Sat)"
  },
  {
    id: "loc-5",
    name: "Common Service Center (CSC) - Digital Seva",
    type: "csc",
    address: "Shop 14, Gandhi Market, Block A",
    phone: "+91 98765 43210",
    distance: "0.5 km",
    lat: 48,
    lng: 42,
    workingHours: "09:00 AM - 07:00 PM (Mon-Sat)"
  },
  {
    id: "loc-6",
    name: "State Bank of India (SBI) - Main Branch",
    type: "bank",
    address: "12, Parliament Street, Sector 1",
    phone: "+91 11 2233 4455",
    distance: "1.5 km",
    lat: 65,
    lng: 30,
    workingHours: "10:00 AM - 04:00 PM (Mon-Sat, 2nd/4th Sat Off)"
  },
  {
    id: "loc-7",
    name: "Regional Transport Office (RTO)",
    type: "rto",
    address: "Transport Nagar, Bypass Road",
    phone: "+91 11 2345 1234",
    distance: "5.2 km",
    lat: 78,
    lng: 70,
    workingHours: "09:30 AM - 05:00 PM (Mon-Sat)"
  },
  {
    id: "loc-8",
    name: "Sanjay Gandhi Memorial Hospital",
    type: "hospital",
    address: "Mangolpuri Outer Ring Road, Sector 2",
    phone: "+91 11 2792 2530",
    distance: "4.1 km",
    lat: 15,
    lng: 25,
    workingHours: "24/7"
  },
  {
    id: "loc-9",
    name: "CSC e-Mitra Kendra",
    type: "csc",
    address: "G-4, Shiv Mandir Lane, Sector 8",
    phone: "+91 99887 76655",
    distance: "1.7 km",
    lat: 30,
    lng: 33,
    workingHours: "08:00 AM - 08:00 PM (Everyday)"
  }
];
