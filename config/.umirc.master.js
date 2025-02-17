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
    'process.env.UMI_API_HOST_CRM':
      'https://services.gravittem.com/Gravittem/CRM',
    'process.env.UMI_API_FINANCIAL':
      'https://services.gravittem.com.br/Gravittem/financeiro',
    'process.env.UMI_API_HOST_NOTIFICATION':
      'https://services.gravittem.com/Gravittem/Notificacoes',
    'process.env.UMI_ENV': 'master',
    'process.env.UMI_API_HOST_PERMISSION':
      'https://services.gravittem.com/global/permission',
    'process.env.UMI_API_HOST_SEARCH':
      'https://services.gravittem.com/gravittem/pesquisas',
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
