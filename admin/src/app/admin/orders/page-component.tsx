'use client'

import { Button } from '@/components/ui/button'
import {
    Select,
    SelectItem,
    SelectContent,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table'
import { OrdersWithProducts } from '@/utils/types/types'
import { format } from 'date-fns'
import React, { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Tables } from '@/utils/supabase/database.types'
import Image from 'next/image'
import { updateOrderStatus } from '@/actions/order'
type props = {
    ordersWithProducts: OrdersWithProducts
}
type OrderedProducts = {
    order_id: number;
    product: Tables<'product'>;
}[];
const STATUS_OPTIONS = ['Pending', 'Shipped', 'InTransit', 'Completed'];

export default function OrdersPageComponent(
    { ordersWithProducts }: props
) {
    const [selectedProducts, setselectedProducts] =
        useState<OrderedProducts>([])

    const openProductsModal = (products: OrderedProducts) => {
        setselectedProducts(products)
    }

    const orderedProducts = ordersWithProducts.flatMap(order =>
        order.order_items.map((item: { product: any }) => ({
            order_id: order.id,
            product: item.product
        }))
    )
    const handleStatusChange = async (orderId: number, status: string) => {
        await updateOrderStatus(orderId,status)
    }
    return (
        <div className='container mx-auto p-6'>
            <h1 className='text-2xl font-bold mb-6'>
                Orders Management DashBoard
            </h1>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Created At</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>User</TableHead>
                        <TableHead>Slug</TableHead>
                        <TableHead>Total Price</TableHead>
                        <TableHead>Products</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {ordersWithProducts.map(order => {
                        return <TableRow>
                            <TableCell>{order.id}</TableCell>
                            <TableCell>
                                {format(new Date(order.created_at), 'MMM dd, yyyy')}
                            </TableCell>
                            <TableCell>
                                <Select
                                    defaultValue={order.status}
                                    onValueChange={(value) => handleStatusChange(order.id, value)}>
                                    <SelectTrigger className='w-[120px]'>
                                        <SelectValue>{order.status}</SelectValue>
                                    </SelectTrigger>
                                    <SelectContent>
                                        {STATUS_OPTIONS.map(option => (
                                            <SelectItem value={option}>{option}</SelectItem>
                                        ))}

                                    </SelectContent>
                                </Select>
                            </TableCell>
                            <TableCell>{order.description || 'no description'}</TableCell>
                            <TableCell>{order.user.email}</TableCell>
                            <TableCell>{order.slug}</TableCell>
                            <TableCell>{order.totalPrice}</TableCell>
                            <TableCell>
                                {order.order_items.length}
                                {order.order_items.length > 1 ? ' items' : ' item'}
                            </TableCell>
                            <TableCell>
                                <Dialog>
                                    <DialogTrigger>
                                        <Button
                                            variant={'outline'}
                                            size={'sm'}
                                            onClick={() => openProductsModal(
                                                orderedProducts.filter(
                                                    product => product.order_id === order.id)
                                            )}>
                                            View Products
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>
                                                Order products:
                                            </DialogTitle>
                                        </DialogHeader>
                                        <div>
                                            {selectedProducts.map(({ product }, index) => (
                                                <div key={index} className='flex items-center mr-2 mb-2 space-x-2'>
                                                    <Image
                                                        className='w-16 h-16 object-cover rounded'
                                                        src={product.heroImage}
                                                        alt={product.title}
                                                        width={64}
                                                        height={64}
                                                    />
                                                    <div className='flex flex-col font-semibold text-sm text-gray-300'>
                                                        <div>{product.title}</div>
                                                        <div>{product.price}</div>
                                                        <div>Available Quantity:{product.maxQty}</div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </DialogContent>
                                </Dialog>
                            </TableCell>
                        </TableRow>
                    })}
                </TableBody>
            </Table>
        </div>
    )
}
