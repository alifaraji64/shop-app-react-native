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
    createProductSchemaServer,
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
        const form = useForm<CreateOrUpdateProductSchema>({
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
        const createUpdateProductHandler =
            async (data: CreateOrUpdateProductSchema) => {
                const { category,
                    images,
                    maxQuantity,
                    price,
                    title,
                    heroImage,
                    intent,
                    slug
                } = data;

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
                let heroImageUrl: string = '';
                let imageUrls: string[] = [];
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

                switch (intent) {

                    case 'create':
                        if (imageUrls.length && heroImageUrl) {
                            await createProduct({
                                category: Number(category),
                                heroImage: heroImageUrl,
                                images: imageUrls,
                                maxQuantity: Number(maxQuantity),
                                price: Number(price),
                                title
                            })
                            form.reset();
                            router.refresh();
                            setisProductModalOpen(false)
                            toast.success('product created successfully')
                        }

                    case 'update':
                        if (imageUrls.length && heroImageUrl) {
                            await updateProduct({
                                category: Number(category),
                                heroImage: heroImageUrl,
                                imagesUrl: imageUrls,
                                maxQuantity: Number(maxQuantity),
                                price: Number(price),
                                title,
                                slug
                            })
                            form.reset();
                            router.refresh();
                            setisProductModalOpen(false)
                            toast.success('product updated successfully')
                        }
                    default: break
                }
            }
        const handleDelete = async (id: number) => {
            await deleteProduct(id);
            router.refresh();
            setisDeleteModalOpen(false)
            toast.success('product deleted successfully')
            setcurrentProduct(null)
        }
        return <main className='grid flex-1 items-start gap-4 sm:px-6 sm:py-0'>
            <div className="conatiner mx-auto p-4">
                <div className='flex justify-between items-center mb-4'>
                    <h1 className='text-2xl font-bold mr-8'>Products Management</h1>
                    <Button onClick={() => {
                        setcurrentProduct(null)
                        setisProductModalOpen(true)
                    }}>
                        <PlusIcon className='mr-2 h-4 w-4' /> Add Product
                    </Button>
                </div>
                <Table className='min-w-[700px]'>
                    <TableHeader className='flex justify-evenly'>
                        <TableRow>
                            <TableHead className='md:table-cell'>
                                Title
                            </TableHead>
                        </TableRow>
                        <TableRow>
                            <TableHead className='md:table-cell'>
                                Category
                            </TableHead>

                        </TableRow>
                        <TableRow>
                            <TableHead className='md:table-cell'>
                                Price
                            </TableHead>

                        </TableRow>
                        <TableRow>
                            <TableHead className='md:table-cell'>
                                Max Quantity
                            </TableHead>

                        </TableRow>
                        <TableRow>
                            <TableHead className='md:table-cell'>
                                Hero Image
                            </TableHead>

                        </TableRow>
                        <TableRow>
                            <TableHead className='md:table-cell'>
                                Product
                                Images
                            </TableHead>
                        </TableRow>
                        <TableRow>
                            <TableHead className='md:table-cell'>
                                Actions
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {productsWithCategories.map(p => {
                            return <ProductTableRow
                                product={p}
                                setCurrentProduct={setcurrentProduct}
                                setIsDeleteModalOpen={setisDeleteModalOpen}
                                setIsProductModalOpen={setisProductModalOpen}
                                key={p.id}
                            />
                        })}
                    </TableBody>
                </Table>
                <ProductForm
                    form={form}
                    categories={categories}
                    onSubmit={createUpdateProductHandler}
                    defaultValues={currentProduct}
                    isProductModalOpen={isProductModalOpen}
                    setIsProductModalOpen={setisProductModalOpen}
                ></ProductForm>
                <Dialog open={isDeleteModalOpen}
                    onOpenChange={setisDeleteModalOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>
                                Delete Product
                            </DialogTitle>
                        </DialogHeader>
                        <h2>
                            Are you sure you wanna delete {currentProduct?.title}
                        </h2>
                        <DialogFooter>
                            <Button variant='destructive' onClick={() => handleDelete(currentProduct?.id!)}>Delete</Button>
                            <Button onClick={() => setisDeleteModalOpen(false)}>Cancel</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </main>

    }

export default ProductPageComponent;
