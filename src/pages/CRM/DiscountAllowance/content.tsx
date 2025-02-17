import React, { useEffect } from "react"
import DiscountAllowanceTable from "./components/DiscountAllowanceTable"
import DiscountAllowanceHeader from "./components/DiscountAllowanceHeader"
import NewDiscountAllowanceModal from "./modals/NewDiscountAllowanceModal"
import SetDiscountAllowanceModal from "./modals/SetDiscountAllowanceModal"
import { useDiscountAllowanceContext } from "./context/DiscountAllowanceContext"
import { Spin } from 'antd'
import { NoVisualize } from "@utils"

function Content(){
    const {
        loadingPermissions,
        canView,
        userPermissions
    } = useDiscountAllowanceContext()
    return (
        <div className="container">
            <Spin spinning={loadingPermissions}>
                {canView && 
                    <>
                        <DiscountAllowanceHeader></DiscountAllowanceHeader>
                        <DiscountAllowanceTable></DiscountAllowanceTable>
                        <NewDiscountAllowanceModal></NewDiscountAllowanceModal>
                        <SetDiscountAllowanceModal></SetDiscountAllowanceModal>
                    </>  
                }
                {canView === false && 
                    <NoVisualize userPermissions={userPermissions} />
                }
            </Spin>
        </div>
    )
}

export default Content