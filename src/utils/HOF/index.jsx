import { hasPermission } from '@utils'

export const ComponentWithPermission = ({
  permissions,
  loadingPermissions,
  children,
}) => {
  if (loadingPermissions) {
    return (
      <div className="page-loading-wrap">
        <div className="ant-spin ant-spin-lg ant-spin-spinning">
          <span className="ant-spin-dot ant-spin-dot-spin">
            <i className="ant-spin-dot-item" />
            <i className="ant-spin-dot-item" />
            <i className="ant-spin-dot-item" />
            <i className="ant-spin-dot-item" />
          </span>
        </div>
      </div>
    )
  }
  const hasVisualizePermission = hasPermission(permissions, 'Visualize')
  if (!hasVisualizePermission) {
    return (
      <h2 className="mt-16 flex justify-center">
        Não há permissão para acessar a tela, solicite ao administrador do
        sistema!
      </h2>
    )
  }
  return children
}
