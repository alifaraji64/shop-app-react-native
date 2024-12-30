import { getCategories } from '@/actions/category'
import React from 'react'
import ProductPageComponent from './page-component';
import { Category } from '@/utils/types/types';
export default async function Product() {
  const categories: Category[] = await getCategories();
  return (
    <>
      <ProductPageComponent categories={categories} />
    </>
  )
}
