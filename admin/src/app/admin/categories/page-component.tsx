'use client'
import { createCategory, deleteCategory, getCategories, imageUploadHandler, updateCategory } from '@/actions/category'
import { Database } from '@/utils/supabase/database.types'
import { createClient } from '@/utils/supabase/server'
import React, { useState } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form';
import { PlusCircle } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { v4 as uuid } from 'uuid';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { CategoryTableRow } from '@/components/custom/category';
import { CategoryForm } from '@/app/admin/categories/category-form';
import { redirect, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { createCategorySchema, CreateCategorySchema } from './create-category-schema';
import { Category } from '@/utils/types/types';


type props = { categories: Category[] };
const CategoriesPageComponent: React.FC<props> = ({ categories }) => {
  const router = useRouter();
  const validImageTypes = ['image/png', 'image/jpeg'];
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false)
  const [currentCategory, setCurrentCategory] = useState<CreateCategorySchema | null>(null)
  const form = useForm({
    resolver: zodResolver(createCategorySchema),
    defaultValues: { name: '', image: undefined }
  })

  const handleImageUpload = async (data: CreateCategorySchema): Promise<string | undefined> => {
    const uniqueId = uuid();
    const fileName = `category/category-${uniqueId}`;
    console.log(data.image[0].type);
    if (!validImageTypes.includes(data.image[0].type))
      toast.warning('only JPEG and PNG types are valid')
    const file = new File([data.image[0]], fileName);
    const formData = new FormData();
    formData.append('file', file);
    return (imageUploadHandler(formData))!
  }
  const submitCategoryHandler: SubmitHandler<CreateCategorySchema> =
    async (data) => {
      setCurrentCategory(data)
      console.log('data');
      console.log(data);

      console.log('current category');
      console.log(currentCategory);


      switch (data.intent) {
        case 'create': {
          const imageUrl = await handleImageUpload(data)
          if (!imageUrl) return;
          await createCategory({ imageUrl, name: data.name });
          form.reset();
          router.refresh();
          setIsCategoryModalOpen(false);
          toast.success('Category created successfully');
          break;
        }
        case 'update': {
          const imageUrl = await handleImageUpload(data)
          if (!imageUrl) return;
          await updateCategory({
            imageUrl,
            name: data.name,
            slug: data.slug!,
            intent: 'update'
          });
          form.reset();
          router.refresh();
          setIsCategoryModalOpen(false);
          toast.success('Category updated successfully');
          break;
        }
        default: console.log('Invalid intent');

      }
    }

  const handleDelete = async ({ id }: { id: number }) => {
    await deleteCategory({ id });
    router.refresh();
    toast.success('category deleted successfully')
  }

  return (
    <main className='grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8'>
      <div className='flex items-center my-10'>
        <div className='ml-auto flex items-center gap-2'>
          <Dialog
            open={isCategoryModalOpen}
            onOpenChange={() => setIsCategoryModalOpen(!isCategoryModalOpen)}>
            <DialogTrigger asChild>
              <Button size={'sm'} className='h-8 gap-1' onClick={() => {
                setCurrentCategory({
                  name: '',
                  // @ts-ignore
                  image: new File([], ''),
                  intent: 'create',
                  slug: '',
                });
                setIsCategoryModalOpen(true)
              }}>
                <PlusCircle className='h-3.5 w-3.5' />
                <span className='sr-only sm:not-sr-only sm:whitespace-normal'>
                  Add Category
                </span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogTitle>Create Category</DialogTitle>
              <CategoryForm
                form={form}
                onSubmit={submitCategoryHandler}
                defaultValues={currentCategory} />
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <Card>
        <CardHeader className='overflow-x-auto'>
          <CardTitle>Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <Table className='min-w-[600px]'>
            <TableHeader>
              <TableRow>
                <TableHead className='w-[100px] sm:table-cell'>
                  <span className='sr-only'>Image</span>
                </TableHead>
                <TableHead>Name</TableHead>
                <TableHead className='md:table-cell'>
                  Created At
                </TableHead>
                <TableHead className='md:table-cell'>
                  Products
                </TableHead>
                <TableHead className='md:table-cell'>
                  <span className='sr-only'>Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map(category =>
                <CategoryTableRow
                deleteCategoryHandler={handleDelete}
                  key={category.id}
                  setCurrentCategory={setCurrentCategory}
                  category={category}
                  setIsCreateCategoryModalOpen={setIsCategoryModalOpen}
                />
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </main>
  )
}
export default CategoriesPageComponent;