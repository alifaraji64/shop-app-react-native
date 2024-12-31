'use client';

import { FC, useState } from 'react';
import { PlusIcon } from 'lucide-react';
import { v4 as uuid } from 'uuid';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { Category, Product, validImageTypes } from '@/utils/types/types';
import {
    createOrUpdateProductSchema,
    CreateOrUpdateProductSchema,
} from '@/app/admin/products/schema';
import { imageUploadHandler } from '@/actions/category';
import {
    createProduct,
    deleteProduct,
    updateProduct,
} from '@/actions/product';
import { ProductForm } from '@/app/admin/products/product-form';
import { ProductTableRow } from '@/app/admin/products/product-table-row';
import { title } from 'process';
import { CreateCategorySchema } from '../categories/schema';
type props = {
    categories: Category[],
    productsWithCategories: Product[]
};
const ProductPageComponent: React.FC<props> =
    ({ categories, productsWithCategories }) => {
        console.log(categories);
        console.log(productsWithCategories);
        const [currentProduct, setcurrentProduct] =
            useState<CreateOrUpdateProductSchema | null>(null)
        const [isProductModalOpen, setisProductModalOpen] = useState(false)
        const [isDeleteModalOpen, setisDeleteModalOpen] = useState(false)
        const form = useForm({
            resolver: zodResolver(createOrUpdateProductSchema),
            defaultValues: {
                title: '',
                price: '',
                maxQuantity: '',
                category: '',
                heroImage: '',
                images: [],
                intent: 'create'
            }
        })
        const router = useRouter();
        const createProductHandler = async (data: CreateOrUpdateProductSchema) => {
            const { category,
                images,
                maxQuantity,
                price,
                title,
                heroImage,
                intent,
                slug } = data;

            const handleImageUpload =
                async (data: File[]): Promise<string> => {
                    const uniqueId = uuid();
                    const fileName = `product/product-${uniqueId}`;
                    if (!validImageTypes.includes(data[0].type))
                        toast.warning('only JPEG and PNG types are valid')
                    const file = new File([data[0]], fileName);
                    const formData = new FormData();
                    formData.append('file', file);
                    return (imageUploadHandler(formData))!
                }
            let heroImageUrl: string;
            let imageUrls: string[];
            if (heroImage) {
                try {
                    heroImageUrl = await handleImageUpload(heroImage)
                } catch (error) {
                    console.log(error);
                    toast.error('error uploading hero image')
                }
            }
            if (images.length) {
                const imagesPromises = Array.from(images).map(file => handleImageUpload([file]))
                try {
                    imageUrls = await Promise.all(imagesPromises)
                } catch (error) {
                    console.log(error);
                    toast.error('error uploading product images')
                }
            }
        }
        return (
            <div>ProductPage</div>
        )
    }

export default ProductPageComponent;
