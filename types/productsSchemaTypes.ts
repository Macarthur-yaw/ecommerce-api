type ProductSchemaTypes = {
    userId:string,
    title: string;
    price: number;
    imgUrl: string;
    category: string;
    
    description: string;
    discount?: number; 
    size?: string[];
    stock: number; 
    otherImages?: string[]; 
    reviews?: {
      userId: string;
      rating: number; 
      comment: string;
    }[]; 
  };
  export { ProductSchemaTypes };
  
