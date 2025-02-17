// ref: https://umijs.org/config/
import webpackConfig from './plugin.config.js'

export default {
  chainWebpack: webpackConfig,
  treeShaking: true,
  theme: {
    'primary-color': '#1976D2',
    'text-color': ' rgba(0, 0, 0, 0.85)',
  },
  define: {
    'process.env.UMI_API_LAYOUT_GENERATOR':
      'https://services.ccbr.dev.gravittem.com.br/Gravittem/GeradorLayout',
    'process.env.UMI_API_FINANCIAL':
      'https://services.ccbr.dev.gravittem.com.br/Gravittem/financeiro',
    'process.env.UMI_API_HOST_CRM':
      'https://services.ccbr.dev.gravittem.com.br/Gravittem/CRM',
    'process.env.UMI_API_HOST_NOTIFICATION':
      'https://services.ccbr.dev.gravittem.com.br/Gravittem/Notificacoes',
    'process.env.UMI_API_HOST_REGION':
      'https://services.ccbr.dev.gravittem.com.br/Gravittem/Regiao',
    'process.env.UMI_ENV': 'sat',
    'process.env.UMI_API_HOST_PERMISSION':
      'https://services.ccbr.dev.gravittem.com.br/global/permission',
    'process.env.UMI_API_HOST_COMMENT':
      'https://services.ccbr.dev.gravittem.com.br/gravittem/comentarios',
    'process.env.UMI_API_HOST_ATTACHMENT':
      'https://services.ccbr.dev.gravittem.com.br/gravittem/anexos',
    'process.env.UMI_API_HOST_REGION':
      'https://services.ccbr.dev.gravittem.com.br/Gravittem/Regiao',
    'process.env.UMI_API_HOST_SEARCH':
      'https://services.ccbr.dev.gravittem.com.br/Gravittem/pesquisas',
    'process.env.UMI_API_HOST_ATTENDANCE':
      'https://services.ccbr.dev.gravittem.com.br/Gravittem/atendimento',
  },
  plugins: [
    // ref: https://umijs.org/plugin/umi-plugin-react.html
    [
      'umi-plugin-react',
      {
        antd: true,
        dva: false,
        title: 'my-app',
        dll: true,
        locale: {
          enable: true,
          default: 'pt-BR',
        },
        routes: {
          exclude: [/tabs\//, /modals\//, /components\//],
        },
        // dynamicImport: {},
      },
    ],
  ],
}
