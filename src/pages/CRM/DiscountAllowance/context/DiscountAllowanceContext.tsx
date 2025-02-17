import { useState, useEffect, SetStateAction } from "react";
import constate from "constate";
import { setParamValues, getPermissions, hasPermission } from '@utils'
import { getSearchOptions, getTableData, getService } from "../services";
import { Form } from 'antd'
import { ISearchField } from "@interfaces/CRM/DiscountAllowance/SearchFieldInterface";
import { ITags } from "@interfaces/TagsInterface";
import { IFranchiseeVendor } from "@interfaces/CRM/DiscountAllowance/FranchiseeVendorInterface";
import { IPerson } from "@interfaces/CRM/PersonInterface";
import { IPriceList } from "@interfaces/CRM/PriceListInterface";
import { IPermission } from "@interfaces/PermissionInterface";
import { IJsonDelete } from "@interfaces/JsonDeleteInterface";
import { IOwner } from "@interfaces/CRM/Person/OwnerInterface";
import { discountAllowanceColumns } from "../utils";

const params = {}

function useDiscountAllowance(){
    const [searchOptions, setSearchOptions] = useState<ISearchField[]>([])
    const [tags, setTags] = useState<ITags[]>([])
    const [tableData, setTableData] = useState<IFranchiseeVendor>()
    const [isFranchisee, setIsFranchisee] = useState<boolean>(false)
    const [ownerId, setOwnerId] = useState<string>()
    const [owner, setOwner] = useState<IOwner>(null)
    const [loadingTableData, setLoadingTableData] = useState<boolean>(true)
    const [loadingSearchOptions, setLoadingSearchOptions] = useState<boolean>(true)
    const [selectedRow, setSelectedRow] = useState<IFranchiseeVendor[]>([])
    const [visibleNewDiscountAllowanceModal, setVisibleNewDiscountAllowanceModal] = useState<boolean>(false)
    const [visibleSetDiscountAllowanceModal, setVisibleSetDiscountAllowanceModal] = useState<boolean>(false)
    const [franchiseeData, setFranchiseeData] = useState<IPerson[]>([])
    const [priceList, setPriceList] = useState<IPriceList[]>([])
    const [formNewDiscountModal] = Form.useForm()
    const [formSetDiscountModal] = Form.useForm()
    const [editData, setEditData] = useState<IFranchiseeVendor | null>(null)
    const [visibleDeleteModal, setVisibleDeleteModal] = useState<boolean>(false)
    const [successDelete, setSuccessDelete] = useState<boolean>(false)
    const [userPermissions, setUserPermissions] = useState<IPermission[] | null>(null)
    const [canEdit, setCanEdit] = useState<boolean>(false)
    const [canAdd, setCanAdd] = useState<boolean>(false)
    const [canView, setCanView] = useState<boolean | null>(null)
    const [canDelete, setCanDelete] = useState<boolean>(false)
    const [canExportExcel, setCanExportExcel] = useState<boolean>(false)
    const [canBurst, setCanBurst] = useState<boolean>(false)
    const [loadingPermissions, setLoadingPermissions] = useState<boolean>(true)
    const [isFranchisor, setIsFranchisor] = useState<boolean>(false)
    const serverColumns = discountAllowanceColumns(isFranchisee)
    const canAddItem = canAdd ? false : canView
    const canEditItem = canEdit ? false : canView
    
    const initializePermissionsAndData  = async () => {
        if (userPermissions?.length > 0) {
          setCanEdit(hasPermission(userPermissions, 'Alter'));
          setCanAdd(hasPermission(userPermissions, 'Include'));
          setCanView(hasPermission(userPermissions, 'Visualize'));
          setCanDelete(hasPermission(userPermissions, 'Exclude'));
          setCanExportExcel(hasPermission(userPermissions, 'ExportExcel'));
          setCanBurst(hasPermission(userPermissions, 'Rajada'));
          
            const ownerResponse = await getService('/api/CRM/Owner', setOwnerId, 'ownerId');
            setOwner(ownerResponse)
            await getSearchOptions(setSearchOptions, setLoadingSearchOptions, ownerResponse?.ownerId);
            const isFranchisor = compareOwnerIds(ownerResponse)
            await getService(`/api/CRM/Person?isFranchisee=true&queryOperator=like&onlyMyOwnerId=${isFranchisor}&getDeletedPerson=false&getPersonDetails=false&isActive=true`, setFranchiseeData, 'person')
            await getService('/api/CRM/PriceList', setPriceList, 'priceList');
          
        } else if (userPermissions?.length === 0) {
          setCanView(false);
        }
      };

    const rowSelection = {
        onChange: (_: any, selectedRow: SetStateAction<IFranchiseeVendor[]>) => {
            setSelectedRow(selectedRow)
        }
    }

    const compareOwnerIds = (owner:IOwner)=> {
        return (owner?.ownerId === owner?.parentOwnerId);
    }

    const startSearch = () => {
        setParamValues(params, searchOptions, tags)
        setSelectedRow([])
        getTableData(
            setTableData, 
            setIsFranchisee,
            ownerId, 
            params, 
            setLoadingTableData
        )
    }

    const jsonDelete: IJsonDelete = {
        ids: selectedRow.map(item => item.id)
    }

    async function setPermissions() {
        const userPerms = await getPermissions('DiscountAllowance')
        setUserPermissions(userPerms[0]?.permissions || [])
        setLoadingPermissions(false)
      }


      useEffect(() => {
        setPermissions()
    },[])

    useEffect(() => {
        if(ownerId){
            startSearch()
        }
    }, [ownerId])

    useEffect(() => {
        if(owner!=null){
            const isFranchisee = compareOwnerIds(owner)
            setIsFranchisor(isFranchisee)
        }
    }, [owner])

    useEffect(() => {
        if(!visibleNewDiscountAllowanceModal){
            formNewDiscountModal.resetFields()
            setEditData(null)
            startSearch()
        }
    },[visibleNewDiscountAllowanceModal])

    useEffect(() => {
        if(!visibleSetDiscountAllowanceModal){
            formSetDiscountModal.resetFields()
            startSearch()
        }
    },[visibleSetDiscountAllowanceModal])

    useEffect(() => {
        if(editData != null){
            formNewDiscountModal.setFieldsValue({
                franchisee: editData.franchiseeId,
                priceList: editData.listaPrecoId ? editData.listaPrecoId : null,
                maxDiscount: editData.percentualDsctoMaximo,
                maxAddition: editData.percentualAcrescimoMaximo,
                status: editData.status,
            })
            setVisibleNewDiscountAllowanceModal(true)
        }
    }, [editData])

    useEffect(() => {
        initializePermissionsAndData ();
      }, [userPermissions])

    return{
        canAddItem,
        canEditItem,
        serverColumns,
        selectedRow, 
        setSelectedRow,
        rowSelection,
        searchOptions,
        tags,
        setTags,
        startSearch,
        loadingTableData,
        loadingSearchOptions,
        tableData,
        isFranchisee,
        visibleNewDiscountAllowanceModal, 
        setVisibleNewDiscountAllowanceModal,
        franchiseeData, 
        setFranchiseeData,
        priceList,
        formNewDiscountModal,
        ownerId,
        editData, 
        setEditData,
        visibleSetDiscountAllowanceModal, 
        setVisibleSetDiscountAllowanceModal,
        formSetDiscountModal,
        visibleDeleteModal, 
        setVisibleDeleteModal,
        successDelete, 
        setSuccessDelete,
        jsonDelete,
        setLoadingTableData,
        canEdit,
        canAdd,
        canView,
        canDelete,
        canExportExcel,
        canBurst,
        loadingPermissions,
        userPermissions,
        isFranchisor
    }
}

const [DiscountAllowanceProvider, useDiscountAllowanceContext] = constate(useDiscountAllowance)

export {DiscountAllowanceProvider, useDiscountAllowanceContext}