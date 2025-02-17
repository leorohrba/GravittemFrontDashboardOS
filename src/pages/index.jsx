
/**
 * breadcrumb: Rotas
 */
import { Menu as AntdMenu, Tooltip } from 'antd'
import React from 'react'
import router from 'umi/router'

const { SubMenu, Item } = AntdMenu

const Menu = () => {
  const routes = typeof window !== 'undefined' && window.g_routes
  const handleClick = e => {
    router.push(`${e.key}`)
  }
  const systemRoutes = routes[0].routes
  const menuItems = systemRoutes
    .filter(menuItem => menuItem.type === 'Menu')
    .map(menuItem => (
      <SubMenu key={menuItem.path} title={menuItem.breadcrumb}>
        {systemRoutes
          .filter(
            childItem =>
              childItem.breadcrumb &&
              String(`${childItem.path}/`).includes(
                `${String(menuItem.path)}/`,
              ),
          )
          .map(
            childItem =>
              !childItem.hide && (
                <Item key={childItem.path}>
                  <Tooltip placement="top" title={childItem.breadcrumb}>
                    {childItem.breadcrumb}
                  </Tooltip>
                </Item>
              ),
          )}
      </SubMenu>
    ))
  return (
    <AntdMenu
      onClick={handleClick}
      style={{
        width: 256,
      }} 
      mode="inline"
    >
      {menuItems}
    </AntdMenu>
  )
}

export default Menu