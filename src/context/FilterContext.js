import { createContext, useContext, useReducer } from "react";

import { filterReducer } from "../reducers/filterReducers";

const filterInitialState = {
    productList: [],
    mainCategory: null,
    subCategory: null,
    filterCategory: null,
    color: null,
    material: null,
    designer: null,    
    plusSize: null,
    occasion: null,
    sortBy: null,
    newIn: false,
    readyToShip: null,
    onSale: false,
    cstmFit: false
}


const FilterContext = createContext(filterInitialState);

export const FilterProvider = ({children}) => {
    const [state, dispatch] = useReducer(filterReducer, filterInitialState);    


    //productlist

    function initialProductList(products) {
        dispatch({
            type: "PRODUCT_LIST",
            payload: {
                products: products
            }
        })
    }


    //main category

    function setMainCategory(mainCategory) {
        dispatch({
            type: "MAIN_CATEGORY",
            payload: {
                mainCategory: mainCategory
            }
        })
    }

    function filterMainCategory(products) {
        return state.mainCategory
            ? products.filter(product => product.product_category.toLowerCase().trim() === state.mainCategory.toLowerCase().trim()) : products;
    }


    //sub category

    function setSubCategory(mainCategory, subCategory) {
        dispatch({
            type: "SUB_CATEGORY",
            payload: {
                mainCategory: mainCategory,
                subCategory: subCategory
            }
        })
    }

    function filterSubCategory(products) {
        return (state.mainCategory && state.subCategory)
            ? products.filter(product => (
                product.product_category.toLowerCase().trim() === state.mainCategory.toLowerCase().trim()
            ) && (
                product.product_sub_category.toLowerCase().trim() === state.subCategory.toLowerCase().trim()
            )) : products;
    }


    //filter category

    function setFilterCategory(mainCategory, subCategory, filterCategory) {
        dispatch({
            type: "FILTER_CATEGORY",
            payload: {
                mainCategory: mainCategory,
                subCategory: subCategory,
                filterCategory: filterCategory
            }
        })
    }

    function filterFilterCategory(products) {
        return (state.mainCategory && state.subCategory && state.filterCategory)
            ? products.filter(product => (
                product.product_category?.toLowerCase().trim() === state.mainCategory.toLowerCase().trim()
            ) && (
                product.product_sub_category?.toLowerCase().trim() === state.subCategory.toLowerCase().trim()
            ) && (
                product.filter_categories?.toLowerCase().trim() === state.filterCategory.toLowerCase().trim()
            )) : products;
    }


    //color

    function setColor(color) {
        dispatch({
            type: "COLOR",
            payload: {
                color: color
            }
        })
    }

    function filterColor(products) {
        return state.color ? products.filter(product => product.color === state.color) : products;
    }    


    //material

    function setMaterial(material) {
        dispatch({
            type: "MATERIAL",
            payload: {
                material: material
            }
        })
    }

    function filterMaterial(products) {
        return state.material ? products.filter(product => product.fabric?.toLowerCase().trim() === state.material?.toLowerCase().trim()) : products;
    }
    


    //designer

    function setDesigner(designer) {
        dispatch({
            type: "DESIGNER",
            payload: {
                designer: designer
            }
        })
    }

    function filterDesigner(products) {
        return state.designer ? products.filter(product => product.designer === state.designer) : products;
    }    


    //plus size

    function setPlusSize(plusSize) {
        dispatch({
            type: "PLUS_SIZE",
            payload: {
                plusSize: plusSize
            }
        })
    }

    console.log(state.plusSize);

    function filterPlusSize(products) {
        if (!state.plusSize) return products;

        return products.filter(product => {
            const sizes = product.product_plus_size;

            if (Array.isArray(sizes)) {
                return sizes.includes(state.plusSize);
            }

            if (typeof sizes === "string") {
                return sizes.split(",").map(s => s.trim().toLowerCase()).includes(state.plusSize.toLowerCase());
            }

            return false;
        });
    }



    //occasion

    function setOccasion(occasion) {
        dispatch({
            type: "OCCASION",
            payload: {
                occasion: occasion
            }
        })
    }

    function filterOccasion(products) {
        return state.occasion ? products.filter(product => product.occasion === state.occasion) : products;
    }
    

    //sortby

    function setSortBy(sortBy) {
        dispatch({
            type: "SORT_BY",
            payload: {
                sortBy: sortBy
            }
        })
    }

    function filterSortBy(products) {
        if (state.sortBy === "LOW_TO_HIGH") {
            return products.sort((a, b) => a.selling_price - b.selling_price);
        } else if (state.sortBy === "HIGH_TO_LOW") {
            return products.sort((a, b) => b.selling_price - a.selling_price);
        } else if (state.sortBy === "NEW_ARRIVALS") {
            return products.filter(product => product.new_arrival === "1" || product?.new_arrival === true);
        } else if (state.sortBy === "DISCOUNT_LOW_TO_HIGH") {
            return products.sort((a, b) => a.discount - b.discount);
        } else {
            return products;
        }
    }


    //new arrival

    function setNewArrival(value) {
        dispatch({
            type: "NEW_ARRIVAL",
            payload: {
                newIn: value
            }
        })
    }

    function filterNewArrival(products) {
        return state.newIn ? products.filter(product => product.new_arrival === "1" || product?.new_arrival === true) : products;
    }


    //ready to ship

    function setReadyToShip(value) {
        dispatch({
            type: "READY_TO_SHIP",
            payload: {
                readyToShip: value
            }
        })
    }

    function filterReadyToShip(products) {
        return state.readyToShip ? products.filter(product => (product?.rts_quantity * 1) > 0) : products;
    }


    // custom fit

    function setCstmFit(value) {
        dispatch({
            type: "CSTM_FIT",
            payload: {
            cstmFit: value,
            },
        });
    }

    function filterCstmFit(products) {
        return state.cstmFit ? products.filter(product => product?.custom_fit?.toString().trim().toLowerCase() === "yes") : products;
    }


    //on sale

    function setOnSale(value) {
        dispatch({
            type: "ON_SALE",
            payload: {
                onSale: value
            }
        })
    }

    function filterOnSale(products) {
        return state.onSale ? products.filter(product => product?.discount >= 17) : products;
    }


    //reset
    
    function resetFilter() {
        dispatch({
            type: "REST_FILTER"
        })
    }


    const filteredProducts = filterReadyToShip(filterNewArrival(filterOnSale(filterCstmFit(filterSortBy(filterOccasion(filterPlusSize(filterDesigner(filterMaterial(filterColor(filterFilterCategory(filterSubCategory(filterMainCategory(state.productList)))))))))))));



    const value = {
        products: filteredProducts,
        onSale: state.onSale,
        newIn: state.newIn,
        readyToShip: state.readyToShip,
        cstmFit: state.cstmFit,
        initialProductList,
        setMainCategory,
        setSubCategory,
        setFilterCategory,
        setColor,
        setMaterial,
        setDesigner,
        setPlusSize,
        setOccasion,
        setSortBy,
        setNewArrival,
        setReadyToShip,
        setCstmFit,
        setOnSale,
        resetFilter
    }

    return (
        <FilterContext.Provider value={value}>
            {children}
        </FilterContext.Provider>
    )
}

export const useFilter = () => {
    const context = useContext(FilterContext);

    return context;
}