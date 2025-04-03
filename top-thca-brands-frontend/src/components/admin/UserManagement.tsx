import { useState, useEffect } from 'react';
import { 
  getUsers, 
  createUser, 
  updateUser, 
  deleteUser 
} from '@/api/adminService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { Trash2, Edit, Plus, Shield } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getCurrentUserFromStorage } from '@/api/authService';

interface User {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'editor';
}

const UserManagement = () => {
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'editor' as 'admin' | 'editor'
  });
  
  // Get current user to prevent self-deletion
  const currentLoggedInUser = getCurrentUserFromStorage();
  
  // Fetch users on mount
  useEffect(() => {
    fetchUsers();
  }, []);
  
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await getUsers();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: "Error",
        description: "Failed to load users.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleRoleChange = (role: 'admin' | 'editor') => {
    setFormData(prev => ({ ...prev, role }));
  };
  
  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      role: 'editor'
    });
    setCurrentUser(null);
  };
  
  const openCreateForm = () => {
    resetForm();
    setFormOpen(true);
  };
  
  const openEditForm = (user: User) => {
    setCurrentUser(user);
    
    // Populate form with user data (exclude password)
    setFormData({
      name: user.name,
      email: user.email,
      password: '', // Don't fill in password field for edit
      role: user.role
    });
    
    setFormOpen(true);
  };
  
  const confirmDelete = (user: User) => {
    setCurrentUser(user);
    setConfirmDeleteOpen(true);
  };
  
  const handleDelete = async () => {
    if (!currentUser) return;
    
    try {
      await deleteUser(currentUser._id);
      toast({
        title: "Success",
        description: `${currentUser.name} has been deleted.`,
      });
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      toast({
        title: "Error",
        description: "Failed to delete user.",
        variant: "destructive",
      });
    } finally {
      setConfirmDeleteOpen(false);
      setCurrentUser(null);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (currentUser) {
        // For updates, only include password if it's provided
        const userData = { ...formData };
        if (!userData.password) {
          delete userData.password;
        }
        
        // Update existing user
        await updateUser(currentUser._id, userData);
        toast({
          title: "Success",
          description: `${formData.name} has been updated.`,
        });
      } else {
        // Create new user
        if (!formData.password) {
          toast({
            title: "Error",
            description: "Password is required for new users.",
            variant: "destructive",
          });
          return;
        }
        
        await createUser(formData);
        toast({
          title: "Success",
          description: `${formData.name} has been created.`,
        });
      }
      
      // Refresh users list
      fetchUsers();
      setFormOpen(false);
      resetForm();
    } catch (error: any) {
      console.error('Error saving user:', error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to save user.",
        variant: "destructive",
      });
    }
  };
  
  if (loading) {
    return <div className="flex justify-center p-8">Loading users...</div>;
  }
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium">Total Users: {users.length}</h3>
        <Button onClick={openCreateForm} className="flex items-center gap-2">
          <Plus size={16} /> Add User
        </Button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map(user => (
              <tr key={user._id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{user.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{user.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {user.role === 'admin' && <Shield size={12} className="mr-1" />}
                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => openEditForm(user)}>
                      <Edit size={16} />
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      onClick={() => confirmDelete(user)}
                      disabled={currentLoggedInUser?.id === user._id} // Prevent self-deletion
                      title={currentLoggedInUser?.id === user._id ? "Cannot delete your own account" : "Delete user"}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
            
            {users.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                  No users found. Add your first user to get started!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* User Form Dialog */}
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{currentUser ? 'Edit User' : 'Add New User'}</DialogTitle>
            <DialogDescription>
              {currentUser 
                ? 'Update the details for this user.' 
                : 'Fill in the details to add a new user.'}
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input 
                id="name" 
                name="name" 
                value={formData.name} 
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input 
                id="email" 
                name="email" 
                type="email"
                value={formData.email} 
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">
                {currentUser ? 'Password (leave blank to keep current)' : 'Password *'}
              </Label>
              <Input 
                id="password" 
                name="password" 
                type="password"
                value={formData.password} 
                onChange={handleInputChange}
                required={!currentUser}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="role">Role *</Label>
              <Select
                value={formData.role}
                onValueChange={(value) => handleRoleChange(value as 'admin' | 'editor')}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="editor">Editor</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <DialogFooter>
              <Button type="button" variant="secondary" onClick={() => setFormOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {currentUser ? 'Save Changes' : 'Create User'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={confirmDeleteOpen} onOpenChange={setConfirmDeleteOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {currentUser?.name}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter>
            <Button variant="secondary" onClick={() => setConfirmDeleteOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserManagement; 