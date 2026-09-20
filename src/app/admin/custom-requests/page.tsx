'use client';

import React, { useState, useEffect } from 'react';
import { MessageCircle, CheckCircle, Clock, RefreshCw } from 'lucide-react';
import { useCustomRequestsStore, CustomRequest } from '@/store/custom-requests-store';

export default function AdminCustomRequestsPage() {
  const { requests: storeRequests, updateStatus: storeUpdateStatus } = useCustomRequestsStore();
  const [requests, setRequests] = useState<CustomRequest[]>(storeRequests);
  const [loading, setLoading] = useState(true);

  const fetchCustomRequests = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/custom-requests', {
        headers: { 'Cache-Control': 'no-store' },
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.requests) && data.requests.length > 0) {
          const mapped: CustomRequest[] = data.requests.map((r: any) => ({
            id: r.id,
            name: r.customerName || 'Bespoke Patron',
            email: r.email || '',
            phone: r.phone || '',
            category: r.itemType || 'Custom Crochet',
            colors: r.colorPreferences || 'Artisan Choice',
            size: 'Bespoke Dimensions',
            quantity: 1,
            desiredDate: 'Flexible',
            budgetRange: r.budgetPaise ? `₹${(r.budgetPaise / 100).toLocaleString('en-IN')}` : 'Bespoke Quote',
            description: r.description || '',
            contactMethod: 'WhatsApp',
            status: r.status || 'submitted',
            createdAt: new Date(r.createdAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            }),
          }));
          setRequests(mapped);
          return;
        }
      }
      setRequests(storeRequests);
    } catch (err) {
      console.error('[AdminCustomRequests] Error fetching custom requests from server:', err);
      setRequests(storeRequests);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomRequests();
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: CustomRequest['status']) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
    );
    storeUpdateStatus(id, newStatus);

    try {
      await fetch('/api/custom-requests', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
          status: newStatus,
        }),
      });
    } catch (err) {
      console.error('[AdminCustomRequests] Error updating request status:', err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-pink-100">
        <div>
          <h1 className="font-display font-bold text-2xl text-ink">Bespoke Custom Requests</h1>
          <p className="text-xs text-text-secondary">
            Live customer inquiries submitted through the custom crochet portal.
          </p>
        </div>
        <button
          type="button"
          onClick={fetchCustomRequests}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-pink-200 text-xs font-semibold text-pink-700 hover:bg-pink-50 transition-colors w-fit"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Requests</span>
        </button>
      </div>

      <div className="space-y-4">
        {requests.map((req) => (
          <div
            key={req.id}
            className="p-6 rounded-3xl bg-white border border-pink-100 shadow-2xs space-y-4 hover:border-pink-200 transition-colors"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-display font-bold text-base text-ink">{req.name}</h3>
                  <span className="text-[10px] font-semibold bg-pink-50 text-pink-700 border border-pink-200 px-2 py-0.5 rounded-full">
                    {req.category}
                  </span>
                </div>
                <span className="text-xs text-text-secondary">
                  {req.phone} • {req.email} • Received on {req.createdAt}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={req.status}
                  onChange={(e) => handleUpdateStatus(req.id, e.target.value as CustomRequest['status'])}
                  className="px-2.5 py-1 rounded-xl text-xs font-semibold uppercase tracking-wider border border-pink-200 bg-pink-50/30 text-ink outline-none"
                >
                  <option value="submitted">Submitted</option>
                  <option value="under_review">Under Review</option>
                  <option value="quoted">Quoted</option>
                  <option value="accepted">Accepted</option>
                  <option value="declined">Declined</option>
                  <option value="completed">Completed</option>
                </select>
                <span className="font-bold text-xs text-ink bg-pink-50/50 px-2.5 py-1 rounded-xl border border-pink-200">
                  {req.budgetRange}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-pink-50/30 border border-pink-100 text-xs text-text-secondary">
              <div>
                <strong className="block text-ink">Palette:</strong>
                <span>{req.colors}</span>
              </div>
              <div>
                <strong className="block text-ink">Size & Qty:</strong>
                <span>{req.size} (Qty: {req.quantity})</span>
              </div>
              <div>
                <strong className="block text-ink">Target Date & Channel:</strong>
                <span>{req.desiredDate} via {req.contactMethod}</span>
              </div>
            </div>

            <p className="text-xs text-text-secondary italic bg-pink-50/20 p-3.5 rounded-2xl border border-pink-100">
              &ldquo;{req.description}&rdquo;
            </p>

            <div className="flex justify-end gap-3 pt-1">
              <a
                href={`https://wa.me/${req.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                  `Hello ${req.name}! 🧶 This is Cozy_Crochets regarding your bespoke ${req.category} request. We loved your vision and would love to craft this for you!`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 rounded-xl bg-pink-600 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs hover:bg-pink-700 transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Chat on WhatsApp</span>
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
