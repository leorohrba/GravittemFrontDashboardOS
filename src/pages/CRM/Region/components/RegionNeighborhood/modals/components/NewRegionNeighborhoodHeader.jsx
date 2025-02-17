import NewSimpleSearch from '@components/NewSimpleSearch'
import PropTypes from 'prop-types'
import React from 'react'

export default function NewRegionNeighborhoodHeader(
  { startSearch,
    tags,
    setTags,
    searchOptions,
  }) {

  return (
    <div>
      <NewSimpleSearch
        searchOptions={searchOptions}
        setTags={setTags}
        tags={tags}
        startSearch={startSearch}
        selectOptionsWidth={120}
        searchBoxWidth={350}
        getSelectLabel
        hideSaveSearch
      />
    </div>
  )
}

NewRegionNeighborhoodHeader.propTypes = {
  startSearch: PropTypes.func,
  setTags: PropTypes.func,
  tags: PropTypes.array,
  searchOptions: PropTypes.array,
}
