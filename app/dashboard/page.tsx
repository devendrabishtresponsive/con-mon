'use client';

import { useEffect, useState } from 'react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface GA4Event {
  eventName: string;
  eventCount: string;
  totalUsers: string;
  activeUsers: string;
  engagementRate: string;
  userEngagementDuration: string;
  screenPageViews: string;
  sessions: string;
  bounceRate: string;
}

// interface EventInDatabase {
//   _id: string;
//   propertyId: string;
//   userId: string;
//   accountId: string;
//   eventNames: [string];
// }

interface EventFromDB {
  _id: string;
  userId: string;
  accountId: string;
  propertyId: string;
  eventNames: string[];
}

export default function Dashboard() {
  const [hoveredEvent, setHoveredEvent] = useState<string | null>(null);
  
  const [events, setEvents] = useState<GA4Event[]>([]);
  
  const [savedEvents, setSavedEvents] = useState<EventFromDB[]>([]);
  
  useEffect(() => {
    
    const fetchSavedEventsFromDatabase = async () => {
      try {
        const responseFromDb = await fetch(`/api/database/events`);
        const eventDocuments = await responseFromDb.json();
        console.log("eventDocuments");
        console.log(eventDocuments);
        
        // setEventDocument(eventDocument || null);
        
        setSavedEvents(eventDocuments || []);
      } catch (err: any) {
        // setError(err.message);
      }
    };
    fetchSavedEventsFromDatabase();
    
    
    // const fetchEvents = async () => {
    //   try {
    //     const res = await fetch(`/api/mongodb/events`);
    //     const data = await res.json();
    
    //     if (!res.ok) throw new Error(data.error || 'fetchEvents failed');
    //     setEvents(data);
    //   } catch (err: any) {
    //     setError(err.message);
    //   }
    // };
    
    // fetchEvents();
    
    // const fetchSavedEvents = async () => {
    //   try {
    //       const res = await fetch(`/api/database/events`);
    //       const data = await res.json();
    
    //       if (!res.ok) throw new Error(data.error || 'fetchEvents failed');
    
    //       const events = data;
    //       console.log(events);
    //       const eventNames: Set<string> = new Set(events.eventNames ?? []);
    //       console.log(eventNames);
    //       setSavedEvents(eventNames);
    //   } catch (err: any) {
    //       console.error(err);
    //       // setError(err.message);
    //   }
    // };
    // fetchSavedEvents();
    
  }, []);
  
  const eventDetails = {
    purchase: {
      observation: "Purchase events dropped 22% vs last week",
      possibleCause: "Drop detected after GTM update — tracking may be misconfigured",
      recommendedAction: "Ask engineering to check GTM container for Purchase event"
    },
    formSignup: {
      observation: "Form signup events increased 12% vs last week",
      possibleCause: "Increase likely from recent marketing campaign launch",
      recommendedAction: "Continue monitoring campaign performance"
    },
    pdfDownload: {
      observation: "PDF download events decreased 8% vs last week",
      possibleCause: "Decrease likely from recent content changes or link placement",
      recommendedAction: "Check download links and placement on key pages"
    }
  };
  
  return (
    <div 
    className="min-h-screen"
    style={{
      backgroundColor: '#FBF9F7',
      backgroundImage: `
          linear-gradient(white 1px, transparent 1px),
          linear-gradient(90deg, white 1px, transparent 1px)
        `,
      backgroundSize: '80px 80px'
    }}
    >
    {/* Conversion Health Module - NEW VERSION */}
    <div className="bg-[#FAD33B] p-6 mb-8">
    <div className="max-w-7xl mx-auto">
    <h2 className="text-2xl font-bold text-gray-900 mb-2">Conversion Health</h2>
    <p className="text-gray-700 mb-6">Daily automated monitoring of your conversions, GTM, and site changes.</p>
    
    {/* Health Status Content */}
    <div className="w-full">
    <div className="p-6">
    
    {/* Event Cards Grid */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
    
    <ul>
    {savedEvents.map((event) => (
        <li key={event._id} style={{border: '1px solid #ccc', margin: '1rem 0', padding: '1rem'}}>
            <p><strong>userId: </strong> {event.userId}</p>
            <p><strong>accountId: </strong> {event.accountId}</p>
            <p><strong>propertyId: </strong> {event.propertyId}</p>
            <p><strong>eventNames: </strong> {event.eventNames.toString()}</p>
            <ul>
            {event.eventNames.map((eventName) => (
                <li key={eventName} style={{border: '1px solid #ccc', margin: '1rem 0', padding: '1rem'}}>
                    <p><strong>eventName: </strong> {eventName}</p>
                </li>
            ))}
            </ul>
        </li>
    ))}
    </ul>

    {/* Purchase Events - Critical Issue Card */}
    <div className="bg-white border-2 border-red-300 rounded-lg p-4 flex flex-col h-full">
    <div className="flex justify-between items-center mb-2">
    <span className="text-lg text-black font-bold">Purchase Event</span>
    <span className="text-sm text-red-600 font-semibold">-22% vs 7-day avg</span>
    </div>
    
    <div className="text-2xl font-bold text-gray-900 mb-2">1,247</div>
    <div className="text-xs text-gray-500 mb-3">conversions (7 days)</div>
    
    <div className="flex items-center justify-between mb-3">
    <span className="text-sm text-gray-600">🟢 High Confidence</span>
    <div 
    onMouseEnter={() => setHoveredEvent('purchase')}
    onMouseLeave={() => setHoveredEvent(null)}
    className="text-blue-600 hover:text-blue-800 cursor-pointer relative"
    title="View details"
    >
    ℹ️
    </div>
    </div>
    
    <div className="text-sm text-gray-700 mb-3 flex-grow">
    Likely caused by GTM update
    </div>
    
    <div className="flex justify-between items-center pt-2 border-t border-red-200 mt-auto">
    <span className="text-xs text-gray-600">Action needed:</span>
    <span className="text-sm font-medium text-red-700">🔧 Engineering Fix</span>
    </div>
    </div>
    
    {/* Form Signups - Healthy Card */}
    <div className="bg-white border border-green-100 rounded-lg p-4 flex flex-col h-full">
    <div className="flex justify-between items-center mb-2">
    <span className="text-lg text-black font-bold">Form Signup</span>
    <span className="text-sm text-green-600 font-semibold">+12% vs 7-day avg</span>
    </div>
    
    <div className="text-2xl font-bold text-gray-900 mb-2">3,891</div>
    <div className="text-xs text-gray-500 mb-3">conversions (7 days)</div>
    
    <div className="flex items-center justify-between mb-3">
    <span className="text-sm text-gray-600">🟢 High Confidence</span>
    <div 
    onMouseEnter={() => setHoveredEvent('formSignup')}
    onMouseLeave={() => setHoveredEvent(null)}
    className="text-blue-600 hover:text-blue-800 cursor-pointer relative"
    title="View details"
    >
    ℹ️
    </div>
    </div>
    
    <div className="text-sm text-gray-700 mb-3 flex-grow">
    Likely from recent campaign
    </div>
    
    <div className="flex justify-between items-center pt-2 border-t border-green-200 mt-auto">
    <span className="text-xs text-gray-600">Status:</span>
    <span className="text-sm font-medium text-green-700">✅ Healthy</span>
    </div>
    </div>
    
    {/* PDF Downloads - Warning Card */}
    <div className="bg-white border-2 border-orange-300 rounded-lg p-4 flex flex-col h-full">
    <div className="flex justify-between items-center mb-2">
    <span className="text-lg text-black font-bold">PDF Download</span>
    <span className="text-sm text-orange-600 font-semibold">-8% vs 7-day avg</span>
    </div>
    
    <div className="text-2xl font-bold text-gray-900 mb-2">892</div>
    <div className="text-xs text-gray-500 mb-3">conversions (7 days)</div>
    
    <div className="flex items-center justify-between mb-3">
    <span className="text-sm text-gray-600">🟡 Medium Confidence</span>
    <div 
    onMouseEnter={() => setHoveredEvent('pdfDownload')}
    onMouseLeave={() => setHoveredEvent(null)}
    className="text-blue-600 hover:text-blue-800 cursor-pointer relative"
    title="View details"
    >
    ℹ️
    </div>
    </div>
    
    <div className="text-sm text-gray-700 mb-3 flex-grow">
    Likely from content changes
    </div>
    
    <div className="flex justify-between items-center pt-2 border-t border-orange-200 mt-auto">
    <span className="text-xs text-gray-600">Action needed:</span>
    <span className="text-sm font-medium text-orange-700">🔍 Analytics Review</span>
    </div>
    </div>
    </div>
    
    {/* Key Takeaways */}
    <div className="bg-gray-50 p-3 rounded-lg mb-6">
    <h4 className="text-sm font-semibold text-black mb-2">Key Takeaways:</h4>
    <ul className="text-sm text-black space-y-1">
    <li>• Purchase event down 22% - needs engineering review</li>
    <li>• PDF download down 8% - minor content issue</li>
    <li>• Form signup up 12% - campaign performing well</li>
    </ul>
    </div>
    
    {/* Action Row */}
    <div className="flex justify-center pt-4">
    <Button variant="outline" size="sm" className="bg-gray-100 hover:bg-gray-200 text-black border-gray-300">
    <span className="mr-2">🔧</span>
    Request a review
    </Button>
    </div>
    </div>
    </div>
    </div>
    </div>
    
    <div className="p-6">
    <div className="max-w-7xl mx-auto">
    
    {/* Daily System Check Results Section */}
    <div className="bg-white p-6 rounded-lg mb-8">
    <div className="mb-4">
    <h2 className="text-xl font-bold text-gray-900">Daily System Check Results</h2>
    </div>
    
    {/* Most Recent Result - Always Visible */}
    <div className="mb-4">
    <div className="flex items-start gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
    <span className="text-lg">⚠️</span>
    <div className="flex-1">
    <div className="flex items-center gap-2 mb-1">
    <span className="text-sm font-medium text-gray-900">Sep 16, 5:55 PM</span>
    <span className="text-sm font-semibold text-yellow-700">Warning</span>
    </div>
    <p className="text-sm text-gray-700">Purchase events dropped (-22%), PDF downloads slightly down (-8%).</p>
    </div>
    </div>
    </div>
    
    <details className="group">
    <summary className="cursor-pointer flex items-center justify-between mb-4">
    <span className="text-sm text-gray-500 group-open:hidden">View all results</span>
    <span className="text-sm text-gray-500 hidden group-open:block">Click to collapse</span>
    </summary>
    
    <div className="mt-4 space-y-3">
    {/* Alert Entry 2 - Healthy */}
    <div className="flex items-start gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
    <span className="text-lg">✅</span>
    <div className="flex-1">
    <div className="flex items-center gap-2 mb-1">
    <span className="text-sm font-medium text-gray-900">Sep 15, 10:20 AM</span>
    <span className="text-sm font-semibold text-green-700">Healthy</span>
    </div>
    <p className="text-sm text-gray-700">All events within normal range.</p>
    </div>
    </div>
    
    {/* Alert Entry 3 - Critical */}
    <div className="flex items-start gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
    <span className="text-lg">🚨</span>
    <div className="flex-1">
    <div className="flex items-center gap-2 mb-1">
    <span className="text-sm font-medium text-gray-900">Sep 14, 8:45 PM</span>
    <span className="text-sm font-semibold text-red-700">Critical</span>
    </div>
    <p className="text-sm text-gray-700">Multiple events down more than 25%, no conversions recorded for 6 hrs.</p>
    </div>
    </div>
    
    {/* Alert Entry 4 - Warning */}
    <div className="flex items-start gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
    <span className="text-lg">⚠️</span>
    <div className="flex-1">
    <div className="flex items-center gap-2 mb-1">
    <span className="text-sm font-medium text-gray-900">Sep 14, 9:10 AM</span>
    <span className="text-sm font-semibold text-yellow-700">Warning</span>
    </div>
    <p className="text-sm text-gray-700">Form signups decreased (-15%).</p>
    </div>
    </div>
    
    {/* Alert Entry 5 - Healthy */}
    <div className="flex items-start gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
    <span className="text-lg">✅</span>
    <div className="flex-1">
    <div className="flex items-center gap-2 mb-1">
    <span className="text-sm font-medium text-gray-900">Sep 13, 7:00 PM</span>
    <span className="text-sm font-semibold text-green-700">Healthy</span>
    </div>
    <p className="text-sm text-gray-700">All systems stable.</p>
    </div>
    </div>
    </div>
    </details>
    </div>
    
    {/* Change Log */}
    <div className="mt-6">
    <Card>
    <CardHeader>
    <CardTitle>Change Log</CardTitle>
    <CardDescription>
    Stay in the loop — we track changes in GA4, GTM, and your site so you know what might be driving fluctuations.
    </CardDescription>
    </CardHeader>
    <CardContent>
    <div className="space-y-4">
    {/* Timeline Entry 1 - GA4 */}
    <div className="flex items-start space-x-4 p-3 bg-gray-50 rounded-lg">
    <div className="flex flex-col items-center">
    <div className="w-3 h-3 bg-green-500 rounded-full border-2 border-white shadow-sm"></div>
    <div className="w-px h-8 bg-gray-300 mt-2"></div>
    </div>
    <div className="flex-1">
    <div className="flex items-center gap-2 mb-1">
    <Badge className="bg-green-100 text-green-800 border-green-200">GA4</Badge>
    <span className="text-xs text-gray-500">Sep 16, 3:45 PM</span>
    </div>
    <p className="text-sm font-medium text-gray-900">New conversion goal "Newsletter Signup" added</p>
    <p className="text-xs text-gray-600">Goal configured to track form submissions on /newsletter page</p>
    </div>
    </div>
    
    {/* Timeline Entry 2 - GTM */}
    <div className="flex items-start space-x-4 p-3 bg-gray-50 rounded-lg">
    <div className="flex flex-col items-center">
    <div className="w-3 h-3 bg-blue-500 rounded-full border-2 border-white shadow-sm"></div>
    <div className="w-px h-8 bg-gray-300 mt-2"></div>
    </div>
    <div className="flex-1">
    <div className="flex items-center gap-2 mb-1">
    <Badge className="bg-blue-100 text-blue-800 border-blue-200">GTM</Badge>
    <span className="text-xs text-gray-500">Sep 16, 2:30 PM</span>
    </div>
    <p className="text-sm font-medium text-gray-900">Container updated - Purchase event tracking modified</p>
    <p className="text-xs text-gray-600">Enhanced ecommerce tracking added to checkout flow</p>
    </div>
    </div>
    
    {/* Timeline Entry 3 - Website */}
    <div className="flex items-start space-x-4 p-3 bg-gray-50 rounded-lg">
    <div className="flex flex-col items-center">
    <div className="w-3 h-3 bg-orange-500 rounded-full border-2 border-white shadow-sm"></div>
    <div className="w-px h-8 bg-gray-300 mt-2"></div>
    </div>
    <div className="flex-1">
    <div className="flex items-center gap-2 mb-1">
    <Badge className="bg-orange-100 text-orange-800 border-orange-200">Website</Badge>
    <span className="text-xs text-gray-500">Sep 15, 11:20 AM</span>
    </div>
    <p className="text-sm font-medium text-gray-900">Product page layout updated</p>
    <p className="text-xs text-gray-600">New CTA button placement may affect conversion tracking</p>
    </div>
    </div>
    
    {/* Timeline Entry 4 - GA4 */}
    <div className="flex items-start space-x-4 p-3 bg-gray-50 rounded-lg">
    <div className="flex flex-col items-center">
    <div className="w-3 h-3 bg-green-500 rounded-full border-2 border-white shadow-sm"></div>
    <div className="w-px h-8 bg-gray-300 mt-2"></div>
    </div>
    <div className="flex-1">
    <div className="flex items-center gap-2 mb-1">
    <Badge className="bg-green-100 text-green-800 border-green-200">GA4</Badge>
    <span className="text-xs text-gray-500">Sep 15, 9:15 AM</span>
    </div>
    <p className="text-sm font-medium text-gray-900">Data retention settings changed</p>
    <p className="text-xs text-gray-600">Extended retention period from 14 to 26 months</p>
    </div>
    </div>
    
    {/* Timeline Entry 5 - GTM */}
    <div className="flex items-start space-x-4 p-3 bg-gray-50 rounded-lg">
    <div className="flex flex-col items-center">
    <div className="w-3 h-3 bg-blue-500 rounded-full border-2 border-white shadow-sm"></div>
    </div>
    <div className="flex-1">
    <div className="flex items-center gap-2 mb-1">
    <Badge className="bg-blue-100 text-blue-800 border-blue-200">GTM</Badge>
    <span className="text-xs text-gray-500">Sep 14, 4:00 PM</span>
    </div>
    <p className="text-sm font-medium text-gray-900">New tag deployed for PDF download tracking</p>
    <p className="text-xs text-gray-600">Added event tracking for whitepaper downloads</p>
    </div>
    </div>
    </div>
    </CardContent>
    </Card>
    </div>
    </div>
    </div>
    
    {/* Event Details Hover Modal */}
    {hoveredEvent && (
      <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 pointer-events-none">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-2xl border border-gray-200 pointer-events-auto">
      <div className="mb-4">
      <h3 className="text-lg font-bold text-gray-900">
      {hoveredEvent === 'purchase' && 'Purchase Event Details'}
      {hoveredEvent === 'formSignup' && 'Form Signup Details'}
      {hoveredEvent === 'pdfDownload' && 'PDF Download Details'}
      </h3>
      </div>
      
      <div className="space-y-4">
      <div>
      <h4 className="text-sm font-semibold text-gray-900 mb-1">Observation:</h4>
      <p className="text-sm text-gray-700">{eventDetails[hoveredEvent as keyof typeof eventDetails].observation}</p>
      </div>
      
      <div>
      <h4 className="text-sm font-semibold text-gray-900 mb-1">Possible Cause:</h4>
      <p className="text-sm text-gray-700">{eventDetails[hoveredEvent as keyof typeof eventDetails].possibleCause}</p>
      </div>
      
      <div>
      <h4 className="text-sm font-semibold text-gray-900 mb-1">Recommended Action:</h4>
      <p className="text-sm text-gray-700">{eventDetails[hoveredEvent as keyof typeof eventDetails].recommendedAction}</p>
      </div>
      </div>
      </div>
      </div>
    )}
    </div>
  );
}