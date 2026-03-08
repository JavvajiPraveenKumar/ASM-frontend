import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ProductService } from "@/services/product.service";

const emptyForm = {
  partCode: "",
  partName: "",
  categoryId: 0,
  supplierId: 0,
  vehicleBrand: "",
  vehicleModel: "",
  vehicleType: "",
  engineCc: "",
  partType: "",
  position: "",
  material: "",
  costPrice: 0,
  sellingPrice: 0,
  mrp: 0,
  gstPercentage: 0,
  currentStock: 0,
  minStockLevel: 5,
  unit: "",
  isActive: true,
  description: "",
  hsnCode: ""
};

const sections = [
  {
    title: "Basic Information",
    fields: [
      { name: "partName", label: "Part Name", placeholder: "Example: Front Brake Pad Set", type: "text" },
      { name: "partCode", label: "Part Code", placeholder: "Example: BP-FR-001", type: "text" },
      { name: "categoryId", label: "Category Id", placeholder: "Example: 1 (Brakes category)", type: "number" },
      { name: "supplierId", label: "Supplier Id", placeholder: "Example: 2 (Bosch Supplier)", type: "number" }
    ]
  },
  {
    title: "Vehicle Details",
    fields: [
      { name: "vehicleBrand", label: "Vehicle Brand", placeholder: "Example: Honda", type: "text" },
      { name: "vehicleModel", label: "Vehicle Model", placeholder: "Example: CB Shine", type: "text" },
      { name: "vehicleType", label: "Vehicle Type", placeholder: "Example: Bike / Car", type: "text" },
      { name: "engineCc", label: "Engine CC", placeholder: "Example: 125cc", type: "text" },
      { name: "partType", label: "Part Type", placeholder: "Example: Genuine / Aftermarket", type: "text" },
      { name: "position", label: "Position", placeholder: "Example: Front / Rear", type: "text" },
      { name: "material", label: "Material", placeholder: "Example: Ceramic / Steel", type: "text" }
    ]
  },
  {
    title: "Pricing",
    fields: [
      { name: "costPrice", label: "Cost Price", placeholder: "Example: 250", type: "number" },
      { name: "sellingPrice", label: "Selling Price", placeholder: "Example: 300", type: "number" },
      { name: "mrp", label: "MRP", placeholder: "Example: 350", type: "number" },
      { name: "gstPercentage", label: "GST %", placeholder: "Example: 18", type: "number" }
    ]
  },
  {
    title: "Inventory",
    fields: [
      { name: "currentStock", label: "Current Stock", placeholder: "Example: 50", type: "number" },
      { name: "minStockLevel", label: "Min Stock Level", placeholder: "Example: 10", type: "number" },
      { name: "unit", label: "Unit", placeholder: "Example: Piece / Box", type: "text" },
      { name: "hsnCode", label: "HSN Code", placeholder: "Example: 87083000", type: "text" }
    ]
  },
  {
    title: "Additional Information",
    fields: [
      { name: "description", label: "Description", placeholder: "Example: High quality brake pads suitable for Honda CB Shine", type: "text" }
    ]
  }
];

export default function ProductForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();

  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const set = (key: string, value: string | number | boolean) =>
    setForm(prev => ({ ...prev, [key]: value }));

  useEffect(() => {
    if (id) {
      const fetchProduct = async () => {
        setIsLoading(true);
        try {
          const data = await ProductService.getProductById(id);
          if (data) {
            setForm({
              ...emptyForm,
              ...data,
            });
          }
        } catch (error) {
          toast({
            title: "Error",
            description: "Failed to fetch product details",
            variant: "destructive"
          });
          navigate("/products");
        } finally {
          setIsLoading(false);
        }
      };
      fetchProduct();
    }
  }, [id, navigate, toast]);

  const validate = () => {
    const e: Record<string, string> = {};

    if (!form.partName.trim()) e.partName = "Part name is required";
    if (!form.partCode.trim()) e.partCode = "Part code is required";
    if (form.sellingPrice <= 0) e.sellingPrice = "Selling price must be greater than 0";
    if (form.currentStock < 0) e.currentStock = "Stock cannot be negative";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setIsSubmitting(true);

    try {
      if (id) {
        await ProductService.updateProduct(id, form);

        toast({
          title: "Product updated",
          description: `${form.partName} updated successfully`
        });
      } else {
        await ProductService.createProduct(form as any);

        toast({
          title: "Product added",
          description: `${form.partName} added successfully`
        });
      }

      navigate("/products");

    } catch (error) {

      toast({
        title: "Error",
        description: `Failed to ${id ? "update" : "create"} product ${error}`,
        variant: "destructive"
      });

    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">

      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate("/products")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>

        <h2 className="page-header">{id ? "Edit Spare Part" : "Add New Spare Part"}</h2>
      </div>

      <form onSubmit={handleSubmit} className="bg-card rounded-lg border shadow-sm p-6 space-y-8">

        {isLoading ? (
          <div className="flex justify-center py-8"><p className="text-muted-foreground">Loading product details...</p></div>
        ) : sections.map((section) => (

          <div key={section.title} className="space-y-4">

            <h3 className="text-lg font-semibold">{section.title}</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              {section.fields.map((field) => (

                <div key={field.name} className={field.name === "description" ? "md:col-span-2" : ""}>

                  <Label>{field.label}</Label>

                  <Input
                    type={field.type}
                    placeholder={field.placeholder}
                    value={form[field.name as keyof typeof form] || ""}
                    onChange={(e) =>
                      set(
                        field.name,
                        field.type === "number"
                          ? Number(e.target.value)
                          : e.target.value
                      )
                    }
                  />

                  {errors[field.name] && (
                    <p className="text-sm text-destructive">{errors[field.name]}</p>
                  )}

                </div>

              ))}

            </div>

          </div>

        ))}

        <div className="flex gap-3 pt-2">

          <Button type="submit" disabled={isSubmitting || isLoading}>
            {id
              ? (isSubmitting ? "Updating..." : "Update Product")
              : (isSubmitting ? "Adding..." : "Add Product")}
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/products")}
            disabled={isSubmitting}
          >
            Cancel
          </Button>

        </div>

      </form>

    </div>
  );
}