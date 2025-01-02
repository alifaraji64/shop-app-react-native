import { Dispatch, SetStateAction } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import Image from 'next/image';

import { Button } from '@/components/ui/button';
import { TableRow, TableCell } from '@/components/ui/table';
import { Product } from '@/utils/types/types';
import { CreateOrUpdateProductSchema } from '@/app/admin/products/schema';

type Props = {
  product: Product;
  setIsProductModalOpen: Dispatch<SetStateAction<boolean>>;
  setCurrentProduct: Dispatch<
    SetStateAction<CreateOrUpdateProductSchema | null>
  >;
  setIsDeleteModalOpen: Dispatch<SetStateAction<boolean>>;
};

export const ProductTableRow = ({
  product,
  setIsProductModalOpen,
  setCurrentProduct,
  setIsDeleteModalOpen,
}: Props) => {
  const handleEditClick = (product: CreateOrUpdateProductSchema) => {
    setCurrentProduct({
      title: product.title,
      category: product.category,
      price: product.price,
      maxQuantity: product.maxQuantity,
      heroImage: product.heroImage,
      images: product.images,
      slug: product.slug,
      intent: 'update',
    });
    setIsProductModalOpen(true);
  };


  return (
    <TableRow key={product.id} className='min-w-[700px] flex justify-between'>
      <TableCell>{product.title}</TableCell>
      <TableCell>{product.category.name}</TableCell>
      <TableCell>{product.price}</TableCell>
      <TableCell>{product.maxQty}</TableCell>
      <TableCell>
        {product.heroImage && (
          <Image
            width={40}
            height={40}
            src={product.heroImage}
            alt='Hero'
            className='w-10 h-10 object-cover '
          />
        )}
      </TableCell>
      <TableCell>
        {product.imagesUrl.map((url, index) => (
          <Image
            width={40}
            height={40}
            key={index}
            src={url}
            alt={`Product ${index + 1}`}
            className='w-10 h-10 object-cover inline-block mr-1 mx-auto'
          />
        ))}
      </TableCell>
      <TableCell>
        <Button
          variant='ghost'
          size='icon'
          onClick={() =>
            handleEditClick({
              title: product.title,
              category: product.category.id.toString(),
              price: product.price?.toString() ?? '',
              maxQuantity: product.maxQty.toString(),
              images: [],
              slug: product.slug,
              intent: 'update',
            })
          }
        >
          <Pencil className='h-4 w-4' />
        </Button>
        <Button
          variant='ghost'
          size='icon'
          onClick={() => {
            setCurrentProduct({
              title: product.title,
              category: product.category.id.toString(),
              price: product.price?.toString() ?? '',
              maxQuantity: product.maxQty.toString(),
              images: [],
              slug: product.slug,
              intent: 'update',
              id: product.id
            })
            setIsDeleteModalOpen(true)
          }
          }
        >
          <Trash2
            className='h-4 w-4'
            onClick={() => setIsDeleteModalOpen(true)}
          />
        </Button>
      </TableCell>
    </TableRow>
  );
};