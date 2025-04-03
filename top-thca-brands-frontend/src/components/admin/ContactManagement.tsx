import { useState, useEffect } from 'react';
import { 
  getContacts, 
  updateContactStatus, 
  deleteContact 
} from '@/api/contactService';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Trash2, Eye, MessageSquare } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';

interface Contact {
  _id: string;
  name: string;
  email: string;
  brandName: string;
  website?: string;
  message: string;
  status: 'pending' | 'reviewed' | 'approved' | 'rejected';
  adminNotes?: string;
  createdAt: string;
}

const ContactManagement = () => {
  const { toast } = useToast();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewOpen, setViewOpen] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [currentContact, setCurrentContact] = useState<Contact | null>(null);
  const [statusData, setStatusData] = useState({
    status: 'pending' as Contact['status'],
    adminNotes: ''
  });
  
  // Fetch contacts on mount
  useEffect(() => {
    fetchContacts();
  }, []);
  
  const fetchContacts = async () => {
    try {
      setLoading(true);
      const data = await getContacts();
      setContacts(data);
    } catch (error) {
      console.error('Error fetching contacts:', error);
      toast({
        title: "Error",
        description: "Failed to load contact submissions.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const viewContact = (contact: Contact) => {
    setCurrentContact(contact);
    setStatusData({
      status: contact.status,
      adminNotes: contact.adminNotes || ''
    });
    setViewOpen(true);
  };
  
  const confirmDelete = (contact: Contact) => {
    setCurrentContact(contact);
    setConfirmDeleteOpen(true);
  };
  
  const handleDelete = async () => {
    if (!currentContact) return;
    
    try {
      await deleteContact(currentContact._id);
      toast({
        title: "Success",
        description: "Contact submission deleted successfully.",
      });
      fetchContacts();
    } catch (error) {
      console.error('Error deleting contact:', error);
      toast({
        title: "Error",
        description: "Failed to delete contact submission.",
        variant: "destructive",
      });
    } finally {
      setConfirmDeleteOpen(false);
      setCurrentContact(null);
    }
  };
  
  const handleStatusChange = (status: Contact['status']) => {
    setStatusData(prev => ({ ...prev, status }));
  };
  
  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setStatusData(prev => ({ ...prev, adminNotes: e.target.value }));
  };
  
  const handleUpdateStatus = async () => {
    if (!currentContact) return;
    
    try {
      await updateContactStatus(currentContact._id, statusData);
      toast({
        title: "Success",
        description: "Contact status updated successfully.",
      });
      fetchContacts();
      setViewOpen(false);
    } catch (error) {
      console.error('Error updating contact status:', error);
      toast({
        title: "Error",
        description: "Failed to update contact status.",
        variant: "destructive",
      });
    }
  };
  
  const getStatusBadgeClass = (status: Contact['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'reviewed':
        return 'bg-blue-100 text-blue-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Helper to safely format dates
  const formatDate = (dateString: string) => {
    try {
      // Check if dateString is valid
      const timestamp = Date.parse(dateString);
      if (isNaN(timestamp)) {
        return 'Invalid date';
      }
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch (error) {
      console.error('Error formatting date:', dateString, error);
      return 'Invalid date';
    }
  };
  
  // Helper for detail view date formatting with time
  const formatDateTime = (dateString: string) => {
    try {
      // Check if dateString is valid
      const timestamp = Date.parse(dateString);
      if (isNaN(timestamp)) {
        return 'Invalid date';
      }
      return format(new Date(dateString), 'MMM d, yyyy, h:mm a');
    } catch (error) {
      console.error('Error formatting date time:', dateString, error);
      return 'Invalid date';
    }
  };
  
  if (loading) {
    return <div className="flex justify-center p-8">Loading contact submissions...</div>;
  }
  
  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-gray-800">Total Submissions: {contacts.length}</h3>
      </div>
      
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Brand</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {contacts.map(contact => (
              <tr key={contact._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {formatDate(contact.createdAt)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{contact.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{contact.brandName}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {contact.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(contact.status)}`}>
                    {contact.status.charAt(0).toUpperCase() + contact.status.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => viewContact(contact)} className="border-gray-300 hover:bg-gray-100 hover:text-gray-900 text-gray-700">
                      <Eye size={16} className="mr-1" />
                      <span>View</span>
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => confirmDelete(contact)}>
                      <Trash2 size={16} className="mr-1" />
                      <span>Delete</span>
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
            
            {contacts.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                  No contact submissions found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* View/Edit Contact Dialog */}
      {currentContact && (
        <Dialog open={viewOpen} onOpenChange={setViewOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader className="pb-2">
              <DialogTitle className="text-lg font-semibold">Contact Submission</DialogTitle>
              <DialogDescription className="text-xs">
                Submitted on {currentContact.createdAt && formatDateTime(currentContact.createdAt)}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-xs font-medium text-gray-700">Name</Label>
                <div className="text-sm font-medium text-gray-900 p-2 bg-gray-50 rounded border border-gray-200">
                  {currentContact.name}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label className="text-xs font-medium text-gray-700">Email</Label>
                <div className="text-sm font-medium text-gray-900 p-2 bg-gray-50 rounded border border-gray-200">
                  {currentContact.email}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label className="text-xs font-medium text-gray-700">Brand Name</Label>
                <div className="text-sm font-medium text-gray-900 p-2 bg-gray-50 rounded border border-gray-200">
                  {currentContact.brandName}
                </div>
              </div>
              
              {currentContact.website && (
                <div className="space-y-2">
                  <Label className="text-xs font-medium text-gray-700">Website</Label>
                  <div className="text-sm font-medium p-2 bg-gray-50 rounded border border-gray-200">
                    <a 
                      href={currentContact.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {currentContact.website}
                    </a>
                  </div>
                </div>
              )}
              
              <div className="space-y-2">
                <Label className="text-xs font-medium text-gray-700 flex items-center gap-1">
                  <MessageSquare size={12} className="text-gray-700" />
                  Message
                </Label>
                <div className="text-sm bg-gray-50 p-3 rounded border border-gray-200 text-gray-900 whitespace-pre-wrap max-h-[150px] overflow-y-auto">
                  {currentContact.message}
                </div>
              </div>
            </div>
            
            <div className="border-t border-gray-200 mt-4 pt-4">
              <h4 className="text-sm font-medium text-gray-900 mb-3">Update Status</h4>
              
              <div className="space-y-3">
                <div className="space-y-1">
                  <Label htmlFor="status" className="text-xs font-medium text-gray-700">Status</Label>
                  <Select
                    value={statusData.status}
                    onValueChange={handleStatusChange}
                  >
                    <SelectTrigger className="h-8 text-xs bg-white border-gray-300">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="reviewed">Reviewed</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-1">
                  <Label htmlFor="adminNotes" className="text-xs font-medium text-gray-700">Admin Notes</Label>
                  <Textarea
                    id="adminNotes"
                    value={statusData.adminNotes}
                    onChange={handleNotesChange}
                    placeholder="Add notes about this submission..."
                    className="min-h-[80px] text-xs bg-white border-gray-300"
                  />
                </div>
              </div>
            </div>
            
            <DialogFooter className="gap-2 mt-3 pt-2 border-t border-gray-200">
              <Button variant="outline" size="sm" onClick={() => setViewOpen(false)} className="h-8 text-xs border-gray-300">
                Close
              </Button>
              <Button size="sm" onClick={handleUpdateStatus} className="h-8 text-xs bg-thca-red hover:bg-thca-red/90 text-white">
                Update Status
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={confirmDeleteOpen} onOpenChange={setConfirmDeleteOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-gray-900">Confirm Delete</DialogTitle>
            <DialogDescription className="text-sm text-gray-700">
              Are you sure you want to delete this contact submission? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 mt-4">
            <Button variant="outline" size="sm" onClick={() => setConfirmDeleteOpen(false)} className="border-gray-300">
              Cancel
            </Button>
            <Button variant="destructive" size="sm" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ContactManagement; 