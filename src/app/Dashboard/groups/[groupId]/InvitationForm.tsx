import { Button } from '@/components/ui/button'
import baseapi from '@/lib/axios';
import React from 'react'

const InvitationForm: React.FC<{ groupId: string }> = ({ groupId }) => {
    const [email, setEmail] = React.useState<string>('');
    const [error, setError] = React.useState<string | null>(null);
    const [message, setMessage] = React.useState<string | null>(null);

    const handleSendInvite = async () =>{
        try {
            const payload = { group: groupId, email };
            const res = await baseapi.post('/api/groups/invite/', payload);
            setMessage('Invitation sent Successfully!!');
            setEmail('');
        } catch (err:any) {
            setMessage('Failed to send Invitaion!!')
            console.log(err)
        }
    }

    return(
        <div>
  <h3 className="text-lg font-semibold mb-2">Invite Members</h3>

  <div className="flex items-center gap-2">
    <input
      type="email"
      placeholder="Enter email..."
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      className="flex-grow border border-gray-300 rounded-md p-2"
    />

    <Button onClick={handleSendInvite} className="shrink-0">
      Send Invite
    </Button>
  </div>

  {message && <p className="mt-2 text-sm text-gray-400">{message}</p>}
</div>

    )
}

export default InvitationForm