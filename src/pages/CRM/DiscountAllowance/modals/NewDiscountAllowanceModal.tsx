import React from "react";
import { Modal } from 'antd'
import NewDiscountAllowanceModalForm from "./NewDiscountAllowanceModalForm";
import { handleSave, handleCancel } from "../utils";
import { useDiscountAllowanceContext } from "../context/DiscountAllowanceContext";
import { ButtonSave } from "../../../../components/ButtonSave/ButtonSave";

export default function NewDiscountAllowanceModal() {
    const {
        visibleNewDiscountAllowanceModal, 
        setVisibleNewDiscountAllowanceModal,
        franchiseeData,
        priceList,
        formNewDiscountModal,
        ownerId,
        editData,
        setEditData,
        setFranchiseeData,
        isFranchisor,
        canAddItem,
    } = useDiscountAllowanceContext()
    const clickSave = (addAnother) => handleSave(formNewDiscountModal, ownerId, setVisibleNewDiscountAllowanceModal, addAnother, editData?.id)
    const clickCancel = () => handleCancel(setVisibleNewDiscountAllowanceModal, setEditData)
    return(
        <Modal 
        title="Nova alçada de desconto e acréscimo"
        open={visibleNewDiscountAllowanceModal}
        onCancel={clickCancel}
        footer={
            <ButtonSave 
                form={formNewDiscountModal} 
                handleModalCancel={() => clickCancel()} 
                handleOk={() => clickSave(false)} 
                handleSaveAdd={() => clickSave(true)} 
                canBeUpdated={true}
                canView={canAddItem}
            />
        }
        >
            <NewDiscountAllowanceModalForm 
                form={formNewDiscountModal}
                franchiseeData={franchiseeData}
                setFranchiseeData={setFranchiseeData}
                priceList={priceList}
                ownerId={ownerId}
                isFranchisor={isFranchisor}
                canView={canAddItem}
            />
        </Modal>
    )
}