import { PRODUCT_DUMMY_URL } from "../../constants/codes";
import { getPercentage } from "../utils";

export const isProductUrlAvailable = (product) =>
  Boolean(product?.url && product.url !== PRODUCT_DUMMY_URL);

export const getProductCurrencySymbol = (product) =>
  product?.currency_symbol ? product.currency_symbol : "&#36;";

export const getProductDiscountPercentage = (product) =>
  product?.price &&
  product?.listprice &&
  +product.listprice > +product.price &&
  getPercentage(product.listprice, product.price);

export const isProductOutOfStock = (product) =>
  String(product?.avlble ?? "").trim() === "0";
