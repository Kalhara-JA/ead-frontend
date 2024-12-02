import React from "react";
import toast from "react-hot-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface Product {
  id: number;
  name: string;
  skuCode: string;
  price: number;
  image: string;
  category: string;
  brand: string;
  description: string;
}

interface ProductDialogProps {
  product: Product;
  quantity: number;
  addToCart: (product: Product) => void;
}

const ProductDialog: React.FC<ProductDialogProps> = ({
  product,
  quantity,
  addToCart,
}) => {
  const handleAddToCart = () => {
        if (quantity > 0) {
      addToCart(product);
      toast.success(`${product.name} added to cart!`, {
        icon: "🛒",
      });
    } else {
      toast.error("Product is out of stock!", {
        icon: "🚫",
      });
    }
  };

  return (
    <Dialog>
      <Card>
        <CardContent className="p-4">
          <DialogTrigger asChild>
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-48 object-cover mb-2 rounded-md"
            />
            <div className="grid grid-cols-2 items-center">
              <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
              {quantity > 0 && (
                <h4 className="text-muted-foreground mb-4 justify-end flex">
                  Available quantity: {quantity}
                </h4>
              )}
            </div>
            <p className="text-sm text-gray-500">
              {product.category} - {product.brand}
            </p>
            <p className="text-base font-bold mb-4">${product.price}</p>
          </DialogTrigger>
          {/* Updated Button */}
          <Button
            onClick={(e) => {
              // Prevent the dialog from opening
              handleAddToCart(); // Call add-to-cart logic
            }}
            className="w-full"
            disabled={quantity <= 0}
          >
            {quantity <= 0 ? "Out of Stock" : "Add to Cart"}
          </Button>
        </CardContent>
      </Card>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{product.name}</DialogTitle>
          <DialogDescription>
            {product.category} - {product.brand}
            <br />
            {product.description}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-48 object-cover mb-4 rounded-md"
          />
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="text-xl font-bold">${product.price}</span>
          </div>
        </div>
        <DialogFooter>
          <Button
            onClick={handleAddToCart}
            className="w-full"
            disabled={quantity <= 0}
          >
            {quantity <= 0 ? "Out of Stock" : "Add to Cart"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDialog;
