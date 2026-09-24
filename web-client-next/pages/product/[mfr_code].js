import dynamic from "next/dynamic";

import { PDPPageSkeleton } from "../../src/components/ProductDetails/ProductDetailsSkeleton";

const ProductDetails = dynamic(
	() => import("../../src/components/ProductDetails/ProductDetails"),
	{
		ssr: false,
		loading: () => <PDPPageSkeleton />,
	}
);

const ProductDetailsPage = (props) => <ProductDetails {...props} />;

export default ProductDetailsPage;

