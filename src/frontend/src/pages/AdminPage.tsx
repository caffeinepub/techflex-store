import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "@tanstack/react-router";
import { LogIn, Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { Category, Product } from "../backend.d";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useAllProducts,
  useCategories,
  useCreateCategory,
  useCreateProduct,
  useDeleteCategory,
  useDeleteProduct,
  useIsAdmin,
  useUpdateCategory,
  useUpdateProduct,
} from "../hooks/useQueries";

const EMPTY_PRODUCT: Omit<Product, "price" | "discountedPrice"> & {
  price: string;
  discountedPrice: string;
} = {
  id: "",
  name: "",
  description: "",
  imageUrl: "",
  category: "",
  inStock: true,
  price: "",
  discountedPrice: "",
};

const EMPTY_CATEGORY: Category = { id: "", name: "", imageUrl: "" };

export default function AdminPage() {
  const { identity, login, loginStatus } = useInternetIdentity();
  const navigate = useNavigate();
  const { data: isAdmin, isLoading: adminLoading } = useIsAdmin();
  const { data: products, isLoading: prodLoading } = useAllProducts();
  const { data: categories, isLoading: catLoading } = useCategories();

  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();

  const [productForm, setProductForm] = useState({ ...EMPTY_PRODUCT });
  const [categoryForm, setCategoryForm] = useState<Category>({
    ...EMPTY_CATEGORY,
  });
  const [editingProduct, setEditingProduct] = useState<string | null>(null);
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [productDialogOpen, setProductDialogOpen] = useState(false);
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);

  if (!identity) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-bold mb-4">Admin Login Required</h2>
        <p className="text-muted-foreground mb-6">
          Please login to access the admin panel.
        </p>
        <Button
          onClick={login}
          disabled={loginStatus === "logging-in"}
          data-ocid="admin.primary_button"
        >
          <LogIn className="w-4 h-4 mr-2" />
          {loginStatus === "logging-in" ? "Logging in..." : "Login"}
        </Button>
      </div>
    );
  }

  if (adminLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Skeleton className="h-64" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div
        className="max-w-md mx-auto px-4 py-16 text-center"
        data-ocid="admin.error_state"
      >
        <h2 className="text-xl font-bold mb-2">Access Denied</h2>
        <p className="text-muted-foreground mb-6">
          You don't have admin privileges.
        </p>
        <Button
          onClick={() => navigate({ to: "/" })}
          data-ocid="admin.secondary_button"
        >
          Go Home
        </Button>
      </div>
    );
  }

  const handleSaveProduct = async () => {
    try {
      const p: Product = {
        ...productForm,
        price: BigInt(productForm.price || "0"),
        discountedPrice: BigInt(productForm.discountedPrice || "0"),
      };
      if (editingProduct) {
        await updateProduct.mutateAsync(p);
        toast.success("Product updated");
      } else {
        await createProduct.mutateAsync(p);
        toast.success("Product created");
      }
      setProductForm({ ...EMPTY_PRODUCT });
      setEditingProduct(null);
      setProductDialogOpen(false);
    } catch {
      toast.error("Failed to save product");
    }
  };

  const handleEditProduct = (p: Product) => {
    setProductForm({
      ...p,
      price: String(p.price),
      discountedPrice: String(p.discountedPrice),
    });
    setEditingProduct(p.id);
    setProductDialogOpen(true);
  };

  const handleDeleteProduct = async (id: string) => {
    await deleteProduct.mutateAsync(id);
    toast.success("Product deleted");
  };

  const handleSaveCategory = async () => {
    try {
      if (editingCategory) {
        await updateCategory.mutateAsync(categoryForm);
        toast.success("Category updated");
      } else {
        await createCategory.mutateAsync(categoryForm);
        toast.success("Category created");
      }
      setCategoryForm({ ...EMPTY_CATEGORY });
      setEditingCategory(null);
      setCategoryDialogOpen(false);
    } catch {
      toast.error("Failed to save category");
    }
  };

  const handleEditCategory = (c: Category) => {
    setCategoryForm(c);
    setEditingCategory(c.id);
    setCategoryDialogOpen(true);
  };

  const handleDeleteCategory = async (id: string) => {
    await deleteCategory.mutateAsync(id);
    toast.success("Category deleted");
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 pb-24 sm:pb-8">
      <h1 className="text-2xl font-bold mb-6">Admin Panel</h1>

      <Tabs defaultValue="products" data-ocid="admin.tab">
        <TabsList className="mb-6">
          <TabsTrigger value="products" data-ocid="admin.tab">
            Products
          </TabsTrigger>
          <TabsTrigger value="categories" data-ocid="admin.tab">
            Categories
          </TabsTrigger>
        </TabsList>

        {/* Products Tab */}
        <TabsContent value="products">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold">
              Products ({products?.length ?? 0})
            </h2>
            <Dialog
              open={productDialogOpen}
              onOpenChange={setProductDialogOpen}
            >
              <DialogTrigger asChild>
                <Button
                  size="sm"
                  data-ocid="admin.open_modal_button"
                  onClick={() => {
                    setProductForm({ ...EMPTY_PRODUCT });
                    setEditingProduct(null);
                  }}
                >
                  <Plus className="w-4 h-4 mr-1" /> Add Product
                </Button>
              </DialogTrigger>
              <DialogContent data-ocid="admin.dialog">
                <DialogHeader>
                  <DialogTitle>
                    {editingProduct ? "Edit Product" : "Add Product"}
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-3">
                  <div>
                    <Label>ID</Label>
                    <Input
                      value={productForm.id}
                      onChange={(e) =>
                        setProductForm((p) => ({ ...p, id: e.target.value }))
                      }
                      data-ocid="admin.input"
                    />
                  </div>
                  <div>
                    <Label>Name</Label>
                    <Input
                      value={productForm.name}
                      onChange={(e) =>
                        setProductForm((p) => ({ ...p, name: e.target.value }))
                      }
                      data-ocid="admin.input"
                    />
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Textarea
                      value={productForm.description}
                      onChange={(e) =>
                        setProductForm((p) => ({
                          ...p,
                          description: e.target.value,
                        }))
                      }
                      data-ocid="admin.textarea"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>Price (₹)</Label>
                      <Input
                        type="number"
                        value={productForm.price}
                        onChange={(e) =>
                          setProductForm((p) => ({
                            ...p,
                            price: e.target.value,
                          }))
                        }
                        data-ocid="admin.input"
                      />
                    </div>
                    <div>
                      <Label>Discounted Price (₹)</Label>
                      <Input
                        type="number"
                        value={productForm.discountedPrice}
                        onChange={(e) =>
                          setProductForm((p) => ({
                            ...p,
                            discountedPrice: e.target.value,
                          }))
                        }
                        data-ocid="admin.input"
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Category</Label>
                    <Input
                      value={productForm.category}
                      onChange={(e) =>
                        setProductForm((p) => ({
                          ...p,
                          category: e.target.value,
                        }))
                      }
                      data-ocid="admin.input"
                    />
                  </div>
                  <div>
                    <Label>Image URL</Label>
                    <Input
                      value={productForm.imageUrl}
                      onChange={(e) =>
                        setProductForm((p) => ({
                          ...p,
                          imageUrl: e.target.value,
                        }))
                      }
                      data-ocid="admin.input"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={handleSaveProduct}
                      disabled={
                        createProduct.isPending || updateProduct.isPending
                      }
                      data-ocid="admin.save_button"
                    >
                      Save
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setProductDialogOpen(false)}
                      data-ocid="admin.cancel_button"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {prodLoading ? (
            <Skeleton className="h-64" />
          ) : (
            <div className="border border-border rounded-xl overflow-hidden">
              <Table data-ocid="admin.table">
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(products ?? []).map((p, i) => (
                    <TableRow key={p.id} data-ocid={`admin.row.${i + 1}`}>
                      <TableCell className="font-medium">{p.name}</TableCell>
                      <TableCell>{p.category}</TableCell>
                      <TableCell>
                        ₹{Number(p.discountedPrice).toLocaleString("en-IN")}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={p.inStock ? "secondary" : "destructive"}
                        >
                          {p.inStock ? "In Stock" : "Out"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditProduct(p)}
                            data-ocid={`admin.edit_button.${i + 1}`}
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteProduct(p.id)}
                            data-ocid={`admin.delete_button.${i + 1}`}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>

        {/* Categories Tab */}
        <TabsContent value="categories">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold">
              Categories ({categories?.length ?? 0})
            </h2>
            <Dialog
              open={categoryDialogOpen}
              onOpenChange={setCategoryDialogOpen}
            >
              <DialogTrigger asChild>
                <Button
                  size="sm"
                  data-ocid="admin.open_modal_button"
                  onClick={() => {
                    setCategoryForm({ ...EMPTY_CATEGORY });
                    setEditingCategory(null);
                  }}
                >
                  <Plus className="w-4 h-4 mr-1" /> Add Category
                </Button>
              </DialogTrigger>
              <DialogContent data-ocid="admin.dialog">
                <DialogHeader>
                  <DialogTitle>
                    {editingCategory ? "Edit Category" : "Add Category"}
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-3">
                  <div>
                    <Label>ID</Label>
                    <Input
                      value={categoryForm.id}
                      onChange={(e) =>
                        setCategoryForm((c) => ({ ...c, id: e.target.value }))
                      }
                      data-ocid="admin.input"
                    />
                  </div>
                  <div>
                    <Label>Name</Label>
                    <Input
                      value={categoryForm.name}
                      onChange={(e) =>
                        setCategoryForm((c) => ({ ...c, name: e.target.value }))
                      }
                      data-ocid="admin.input"
                    />
                  </div>
                  <div>
                    <Label>Image URL</Label>
                    <Input
                      value={categoryForm.imageUrl}
                      onChange={(e) =>
                        setCategoryForm((c) => ({
                          ...c,
                          imageUrl: e.target.value,
                        }))
                      }
                      data-ocid="admin.input"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={handleSaveCategory}
                      disabled={
                        createCategory.isPending || updateCategory.isPending
                      }
                      data-ocid="admin.save_button"
                    >
                      Save
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setCategoryDialogOpen(false)}
                      data-ocid="admin.cancel_button"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {catLoading ? (
            <Skeleton className="h-64" />
          ) : (
            <div className="border border-border rounded-xl overflow-hidden">
              <Table data-ocid="admin.table">
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(categories ?? []).map((c, i) => (
                    <TableRow key={c.id} data-ocid={`admin.row.${i + 1}`}>
                      <TableCell>{c.id}</TableCell>
                      <TableCell className="font-medium">{c.name}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditCategory(c)}
                            data-ocid={`admin.edit_button.${i + 1}`}
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteCategory(c.id)}
                            data-ocid={`admin.delete_button.${i + 1}`}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
