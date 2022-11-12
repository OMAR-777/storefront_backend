import Common from '../../utils/common';
import { ICreateProduct, IProduct } from './product.interfaces';

class Product {
  static tableName = 'products';

  static async findOneById(id: number): Promise<IProduct | null>{
    const rows = await Common.dbFetch(Product.tableName, { id });
    if(rows?.length){
      const product = rows[0] as IProduct;
      return product;
    }else{
      return null;
    }
  }

  static async findAll(): Promise<IProduct[]>{
    const rows = await Common.dbFetch(
      Product.tableName,
      null,
      [
        'id',
        'name',
        'price',
        'created_at',
      ],
    );
    return rows as IProduct[];
  }

  static async create(product: ICreateProduct): Promise<IProduct | null>{
    const insertQuery = await Common.dbInsertion(Product.tableName, product);
    if(insertQuery && insertQuery.inserted){
      const newProduct = insertQuery.data[0] as IProduct;
      return newProduct;
    }else{
      return null;
    }
  }
}

export default Product;