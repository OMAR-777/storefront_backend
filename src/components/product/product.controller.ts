import { Request, Response } from "express";
import { BadRequestError } from "../../errors/bad-request-error";
import { ICreateProduct, IProduct } from "./product.interfaces";
import { Password } from "../../utils/password";
import Product from "./product.model";
import { NotFoundError } from "../../errors/not-found-error";
import CustomResponse from "../../utils/custom-response";
import { JWT } from "../../utils/jwt";

class ProductController {
  async getProduct(req: Request, res: Response) {
    const product = await Product.findOneById(+req.params.id);
    if (!product) {
      throw new NotFoundError("Product Not Found!");
    }
    CustomResponse.send(res, { product });
  }

  async getProducts(req: Request, res: Response) {
    const products = await Product.findAll();
    CustomResponse.send(res, { products });
  }

  async create(req: Request, res: Response) {
    const { name, price } = req.body;

    const existingProduct = await Product.findOneByName(name);
    if (existingProduct) {
      throw new BadRequestError("There's a product with this name already!");
    }

    const dataObject: ICreateProduct = { name, price };

    const product = await Product.create(dataObject);

    const result = { product };

    return CustomResponse.send(res, result, "Created Successfully", 201);
  }
}

export default new ProductController();
