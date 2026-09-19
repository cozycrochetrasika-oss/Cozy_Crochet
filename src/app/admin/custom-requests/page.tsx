'use client';

import React from 'react';
import { MessageCircle, CheckCircle, Clock } from 'lucide-react';
import { useCustomRequestsStore, CustomRequest } from '@/store/custom-requests-store';

export default function AdminCustomRequestsPage() {
  const { requests, updateStatus } = useCustomRequestsStore();

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-border">
        <h1 className="font-display font-bold text-2xl text-ink">Bespoke Custom Requests</h1>
        <p className="text-xs text-cocoa/75">
          Live customer inquiries submitted through the custom crochet portal.
        </p>
      </div>

      <div className="space-y-4">
        {requests.map((req) => (
          <div
            key={req.id}
            className="p-6 rounded-2xl bg-cream/30 border border-border/80 shadow-sm space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-display font-bold text-base text-ink">{req.name}</h3>
                  <span className="text-[10px] font-semibold bg-blush/60 text-cocoa px-2 py-0.5 rounded-full">
                    {req.category}
                  </span>
                </div>
                <span className="text-xs text-cocoa/70">
                  {req.phone} • {req.email} • Received on {req.createdAt}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={req.status}
                  onChange={(e) => updateStatus(req.id, e.target.value as CustomRequest['status'])}
                  className="px-2.5 py-1 rounded-lg text-xs font-semibold uppercase tracking-wider border outline-none bg-surface"
                >
                  <option value="submitted">Submitted</option>
                  <option value="under_review">Under Review</option>
                  <option value="quoted">Quoted</option>
                  <option value="accepted">Accepted</option>
                  <option value="declined">Declined</option>
                  <option value="completed">Completed</option>
                </select>
                <span className="font-bold text-xs text-ink bg-surface px-2.5 py-1 rounded-lg border border-border/60">
                  {req.budgetRange}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-xl bg-surface border border-border/50 text-xs text-cocoa/85">
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

            <p className="text-xs text-cocoa/80 italic bg-cream/40 p-3 rounded-xl border border-border/40">
              &ldquo;{req.description}&rdquo;
            </p>

            <div className="flex justify-end gap-3 pt-1">
              <a
                href={`https://wa.me/${req.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                  `Hello ${req.name}! 🧶 This is Cozy_Crochets regarding your bespoke ${req.category} request. We loved your vision and would love to craft this for you!`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 rounded-xl bg-sage text-cocoa text-xs font-semibold flex items-center gap-1.5 shadow-sm hover:bg-sage/90"
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
