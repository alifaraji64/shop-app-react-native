import { getCategories } from '@/actions/category'
import React from 'react'
import ProductPageComponent from './page-component';
import { Category } from '@/utils/types/types';
import { getProductsWithCategories } from '@/actions/product';
export default async function Product() {
  const categories: Category[] = await getCategories();
  const productsWithCategories = await getProductsWithCategories();
  return (
    <>
      <ProductPageComponent
      categories={categories}
      productsWithCategories={productsWithCategories}
      />
    </>
  )
}
