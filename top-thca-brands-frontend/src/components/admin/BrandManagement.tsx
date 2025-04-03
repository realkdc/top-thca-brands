import { useState, useEffect } from 'react';
import { 
  getBrands, 
  createBrand, 
  updateBrand, 
  deleteBrand 
} from '@/api/brandService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { Trash2, Edit, Plus } from 'lucide-react';

interface Brand {
  _id: string;
  name: string;
  image: string;
  category: string;
  rating: number;
  description: string;
  featured?: boolean;
  slug: string;
  website?: string;
  productTypes?: string[];
  location?: string;
}

const BRAND_CATEGORIES = ['Flower', 'Concentrate', 'Edibles', 'Vape', 'Other'];

const BrandManagement = () => {
  const { toast } = useToast();
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [currentBrand, setCurrentBrand] = useState<Brand | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    category: BRAND_CATEGORIES[0],
    rating: 0,
    description: '',
    featured: false,
    website: '',
    productTypes: '',
    location: '',
    image: null as File | null
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  // Fetch brands on mount
  useEffect(() => {
    fetchBrands();
  }, []);
  
  const fetchBrands = async () => {
    try {
      setLoading(true);
      const data = await getBrands();
      setBrands(data);
    } catch (error) {
      console.error('Error fetching brands:', error);
      toast({
        title: "Error",
        description: "Failed to load brands.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({ ...prev, image: file }));
    
    // Create a preview URL for the image
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    } else {
      setImagePreview(null);
    }
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSwitchChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, featured: checked }));
  };
  
  const resetForm = () => {
    setFormData({
      name: '',
      category: BRAND_CATEGORIES[0],
      rating: 0,
      description: '',
      featured: false,
      website: '',
      productTypes: '',
      location: '',
      image: null
    });
    setImagePreview(null);
    setCurrentBrand(null);
  };
  
  const openCreateForm = () => {
    resetForm();
    setFormOpen(true);
  };
  
  const openEditForm = (brand: Brand) => {
    setCurrentBrand(brand);
    
    // Populate form with brand data
    setFormData({
      name: brand.name,
      category: brand.category,
      rating: brand.rating,
      description: brand.description,
      featured: brand.featured || false,
      website: brand.website || '',
      productTypes: brand.productTypes?.join(', ') || '',
      location: brand.location || '',
      image: null
    });
    
    // Set image preview if brand has image
    const imageUrl = brand.image.startsWith('http') 
      ? brand.image 
      : `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${brand.image}`;
    setImagePreview(imageUrl);
    
    setFormOpen(true);
  };
  
  const confirmDelete = (brand: Brand) => {
    setCurrentBrand(brand);
    setConfirmDeleteOpen(true);
  };
  
  const handleDelete = async () => {
    if (!currentBrand) return;
    
    try {
      await deleteBrand(currentBrand._id);
      toast({
        title: "Success",
        description: `${currentBrand.name} has been deleted.`,
      });
      fetchBrands();
    } catch (error) {
      console.error('Error deleting brand:', error);
      toast({
        title: "Error",
        description: "Failed to delete brand.",
        variant: "destructive",
      });
    } finally {
      setConfirmDeleteOpen(false);
      setCurrentBrand(null);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Convert productTypes string to array
      const productTypesArray = formData.productTypes
        ? formData.productTypes.split(',').map(type => type.trim())
        : [];
      
      const brandData = {
        ...formData,
        productTypes: productTypesArray
      };
      
      if (currentBrand) {
        // Update existing brand
        await updateBrand(currentBrand._id, brandData);
        toast({
          title: "Success",
          description: `${formData.name} has been updated.`,
        });
      } else {
        // Create new brand
        if (!formData.image) {
          toast({
            title: "Error",
            description: "Please upload an image for the brand.",
            variant: "destructive",
          });
          return;
        }
        
        await createBrand(brandData);
        toast({
          title: "Success",
          description: `${formData.name} has been created.`,
        });
      }
      
      // Refresh brands list
      fetchBrands();
      setFormOpen(false);
      resetForm();
    } catch (error) {
      console.error('Error saving brand:', error);
      toast({
        title: "Error",
        description: "Failed to save brand.",
        variant: "destructive",
      });
    }
  };
  
  if (loading) {
    return <div className="flex justify-center p-8">Loading brands...</div>;
  }
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium">Total Brands: {brands.length}</h3>
        <Button onClick={openCreateForm} className="flex items-center gap-2">
          <Plus size={16} /> Add Brand
        </Button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Featured</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {brands.map(brand => (
              <tr key={brand._id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="w-12 h-12 bg-gray-100 rounded overflow-hidden">
                    <img 
                      src={brand.image.startsWith('http') 
                        ? brand.image 
                        : `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${brand.image}`} 
                      alt={brand.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{brand.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                    {brand.category}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {brand.rating.toFixed(1)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {brand.featured ? 'Yes' : 'No'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => openEditForm(brand)}>
                      <Edit size={16} />
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => confirmDelete(brand)}>
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
            
            {brands.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                  No brands found. Add your first brand to get started!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Brand Form Dialog */}
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{currentBrand ? 'Edit Brand' : 'Add New Brand'}</DialogTitle>
            <DialogDescription>
              {currentBrand 
                ? 'Update the details for this brand.' 
                : 'Fill in the details to add a new brand.'}
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Brand Name *</Label>
                <Input 
                  id="name" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => handleSelectChange('category', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {BRAND_CATEGORIES.map(category => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="rating">Rating (0-5) *</Label>
                <Input 
                  id="rating" 
                  name="rating" 
                  type="number" 
                  step="0.1"
                  min="0"
                  max="5"
                  value={formData.rating} 
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="website">Website URL</Label>
                <Input 
                  id="website" 
                  name="website" 
                  value={formData.website} 
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="productTypes">Product Types (comma-separated)</Label>
                <Input 
                  id="productTypes" 
                  name="productTypes" 
                  value={formData.productTypes} 
                  onChange={handleInputChange}
                  placeholder="e.g. Flower, Pre-rolls, Cartridges"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input 
                  id="location" 
                  name="location" 
                  value={formData.location} 
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2 col-span-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea 
                  id="description" 
                  name="description" 
                  value={formData.description} 
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="space-y-2 col-span-2">
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="featured" 
                    checked={formData.featured}
                    onCheckedChange={handleSwitchChange}
                  />
                  <Label htmlFor="featured">Featured Brand</Label>
                </div>
              </div>
              
              <div className="space-y-2 col-span-2">
                <Label htmlFor="image">
                  {currentBrand ? 'Brand Image (leave empty to keep current)' : 'Brand Image *'}
                </Label>
                <Input 
                  id="image" 
                  name="image" 
                  type="file" 
                  accept="image/*"
                  onChange={handleFileChange}
                />
                
                {imagePreview && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-500 mb-1">Preview:</p>
                    <div className="w-32 h-32 bg-gray-100 rounded overflow-hidden">
                      <img 
                        src={imagePreview} 
                        alt="Preview" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <DialogFooter>
              <Button type="button" variant="secondary" onClick={() => setFormOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {currentBrand ? 'Save Changes' : 'Create Brand'}
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
              Are you sure you want to delete {currentBrand?.name}? This action cannot be undone.
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

export default BrandManagement; 