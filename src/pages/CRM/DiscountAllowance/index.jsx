/**
 * breadcrumb: Alçada de desconto e acréscimo
 */

import React from "react"
import { DiscountAllowanceProvider } from "./context/DiscountAllowanceContext"
import Content from "./content"

function DiscountAllowance(){
    return (
        <DiscountAllowanceProvider>
        <Content />
        </DiscountAllowanceProvider>
    )
}

export default DiscountAllowance