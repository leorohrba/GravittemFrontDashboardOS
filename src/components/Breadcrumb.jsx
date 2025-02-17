import ignoreCase from 'ignore-case'
import React from 'react'
import withBreadcrumbs from 'react-router-breadcrumbs-hoc'
import { Link } from 'react-router-dom'

export default withBreadcrumbs()(({ breadcrumbs }) => {
  const routes = typeof window !== 'undefined' && window.g_routes
  const filterRoutes = (routes, match, index) => {
    return routes[0].routes
      .filter(route => ignoreCase.equals(route.path, match.url) && !route.hide)
      .map(route => (
        <span key={match.url}>
          <Link to={match.url || ''}>{route.breadcrumb}</Link>
          {index < breadcrumbs.length - 1 && ' > '}
        </span>
      ))
  }
  return (
    <div className="mb-4">
      {breadcrumbs.map(({ match }, index) =>
        process.env.UMI_ENV === 'dev'
          ? filterRoutes(routes, match, index)
          : index > 0 && filterRoutes(routes, match, index),
      )}
    </div>
  )
})
