import PropTypes from 'prop-types'
import React, { Fragment } from 'react'
import { titles } from './productData'
import ProductsAndServicesFooter from './ProductsAndServicesFooter'

const ProductsAndServicesTotalizer = ({
  dataSource,
  proposalType,
  profitPercent,
  owner,
}) => {
  const loading = dataSource != null
  const isOwnerFranchisor =
    owner?.isOwnerFranchisor && JSON.parse(owner?.isOwnerFranchisor)

  return (
    <Fragment>
      <div className="flex flex-wrap justify-end gap-2">
        {titles.map(title => {
          if (title.key == 'total' ? true : isOwnerFranchisor) {
            return (
              <div key={title.key} className={`w-full sm:w-1/3 lg:w-1/4`}>
                <div className="text-right">
                  <strong>{title.title}</strong>
                  {loading && (
                    <ProductsAndServicesFooter
                      recurringValue={
                        dataSource[title.key].totalRecurrenceValue
                      }
                      singleTotalAmount={dataSource[title.key].totalSingleValue}
                      locationValue={dataSource[title.key].totalLocationValue}
                      proposalType={proposalType}
                      loading={loading}
                      profitSingleValue={
                        dataSource[title.key].profitValueFranchisor
                      }
                      profitRecurringValue={
                        dataSource[title.key].profitValueFranchisee
                      }
                      profitPercent={profitPercent}
                    />
                  )}
                </div>
              </div>
            )
          }
        })}
      </div>
    </Fragment>
  )
}

ProductsAndServicesTotalizer.propTypes = {
  dataSource: PropTypes.array.isRequired,
}

export default ProductsAndServicesTotalizer
