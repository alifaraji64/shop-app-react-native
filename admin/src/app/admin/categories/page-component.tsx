'use client'
import { getCategories, imageUploadHandler } from '@/actions/category'
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
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { createCategorySchema, CreateCategorySchema } from './create-category-schema';
import { Category } from '@/utils/types/types';


type props = { categories: Category[] };
const CategoriesPageComponent: React.FC<props> = ({ categories }) => {
  //console.log('categories');
  //console.log(categories);
  const validImageTypes = ['image/png', 'image/jpeg'];
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false)
  const [CurrentCategory, setCurrentCategory] = useState<CreateCategorySchema | null>(null)
  const form = useForm({
    resolver: zodResolver(createCategorySchema),
    defaultValues: { name: 'bang', image: undefined }
  })
  const submitCategoryHandler: SubmitHandler<CreateCategorySchema> =
    async (data) => {
      console.log(data);
      const uniqueId = uuid();
      const fileName = `category/category-${uniqueId}`;
      console.log(data.image[0].type);
      if (!validImageTypes.includes(data.image[0].type))
        return toast.warning('only JPEG and PNG types are valid')
      const file = new File([data.image[0]], fileName);
      const formData = new FormData();
      formData.append('file', file);
      imageUploadHandler(formData)

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
                setCurrentCategory(null);
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
                defaultValues={CurrentCategory} />
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