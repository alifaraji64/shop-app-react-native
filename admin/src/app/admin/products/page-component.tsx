import { Category } from '@/utils/types/types';
import React from 'react'
type props = { categories: Category[] };
export const ProductPageComponent: React.FC<props> =
    ({ categories }) => {
        return (
            <div>ProductPage</div>
        )
    }
