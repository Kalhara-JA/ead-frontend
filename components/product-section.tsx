import React, { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Input } from "./ui/input";

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
}

interface ProductPageProps {
  products: Product[];
  addToCart: (product: Product) => void;
}

const ProductPage: React.FC<ProductPageProps> = ({ products, addToCart }) => {
  const [searchTerm, setSearchTerm] = useState("");

  // Filter products based on the search term
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main className="flex-1">
      <section className="w-full py-10 md:py-10 lg:py-10">
        <div className="flex justify-end w-full px-4">
          <Input
            placeholder="Filter Products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)} 
            className="max-w-sm w-full sm:w-auto"
          />
        </div>

        <div className="container px-4 md:px-6">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-8">
            Our Products
          </h1>

          {/* Show message if no products match */}
          {filteredProducts.length === 0 ? (
            <p className="text-center text-gray-500">No products found.</p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredProducts.map((product) => (
                <div key={product.id}>
                  <Card>
                    <CardContent className="p-4">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-48 object-cover mb-4 rounded-md"
                      />
                      <h2 className="text-xl font-semibold mb-2">
                        {product.name}
                      </h2>
                      <p className="text-muted-foreground mb-4">
                        ${product.price.toFixed(2)}
                      </p>
                      <Button
                        onClick={() => addToCart(product)}
                        className="w-full"
                      >
                        Add to Cart
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

export default ProductPage;
