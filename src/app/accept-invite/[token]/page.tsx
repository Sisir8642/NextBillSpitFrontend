'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import baseapi from '@/lib/axios';

export default function AcceptInvitePage() {
  const { token } = useParams();
  const router = useRouter();
  const [status, setStatus] = useState('Processing your invitation...');

  useEffect(() => {
  if (!token) return;

  baseapi.get(`/api/groups/accept-invite/${token}/`)
    .then(res => {
      setStatus(res.data.message || 'Invitation accepted!');
      if (res.data.group_id) {
        setTimeout(() => router.push(`/Dashboard/groups/${res.data.group_id}`), 2000);
      }
    })
    .catch(err => {
      if (err.response?.status === 401) {
        router.push(`/login?next=/accept-invite/${token}`);
      } else {
        setStatus(err.response?.data?.error || 'Failed to accept invitation.');
      }
    });
}, [token, router]);


  return (
    <div className="flex items-center justify-center min-h-screen">
      <p>{status}</p>
    </div>
  );
}
