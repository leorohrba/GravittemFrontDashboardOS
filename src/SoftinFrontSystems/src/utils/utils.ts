import { notification } from 'antd'

export function handleAuthError(error) {
  if (
    error.response !== undefined &&
    (error.response.status === 403 || error.response.status === 401)
  ) {
    notification.error({
      message: 'Autenticação negada',
      description:
        'Ocorreu um erro de autenticação, tente sair e entrar na sua conta novamente',
    })
  } else {
    notification.error({
      message: 'Servidor não encontrado',
      description: 'Não foi possível conectar ao servidor, contate o suporte',
    })
  }
}

export function notNullUndefined<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined
}
