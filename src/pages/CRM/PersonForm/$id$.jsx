/* eslint-disable react-hooks/exhaustive-deps */
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import PersonForm from './PersonForm';

export default function Index(props) {
  
  const { match } = props
  const [personId, setPersonId] = useState(isNaN(match.params.id) ? 0 : parseInt(match.params.id,10));
  
  if (personId === undefined || personId === null)
  {
     setPersonId(0)
  }

  return (
    <PersonForm isRouter personId={personId} setPersonId={setPersonId} />
  )
}

Index.propTypes = {
  match: PropTypes.any
}

