'use server'

import { getCategories } from "@/actions/category";
import CategoriesPageComponent from "./page-component";

export default async function Categories() {
    const categories = await getCategories()
    // console.log('categories');
    // console.log(categories);
    return (
        <>
            <CategoriesPageComponent categories={categories}></CategoriesPageComponent>
        </>
    )
}
