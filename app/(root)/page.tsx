import ProductList from "@/components/shared/product/product-list";
import {getLatestProducts} from "@/lib/actions/product.actions";

export const metadata = {
  title: 'Home',
};

const Homepage = async () => {
  const latestProducts = await getLatestProducts();
  return <div>
    <ProductList data={latestProducts} title="Newest Arrivals" limit={7}/>
  </div>;
};

export default Homepage;