import { Request, Response } from 'express';
import { productService } from '../services/product.service';
import { sendSuccess, formatPrice } from '../utils/response.util';

export class ProductController {
	getAllProducts(req: Request, res: Response): void {
		const products = productService.getAllProducts();
		sendSuccess(
			res,
			products.map((p) => ({
				...p,
				priceFormatted: formatPrice(p.price),
			})),
		);
	}
}

export const productController = new ProductController();
