// ref: https://umijs.org/config/
import webpackConfig from '../plugin.config'

export default {
  chainWebpack: webpackConfig,
  sass: {},
  treeShaking: true,
  theme: {
    'primary-color': '#1976D2',
    'text-color': ' rgba(0, 0, 0, 0.85)',
  },
  define: {
    'process.env.UMI_WHATSAPP_SECRET_KEY': 'SOFTIN@GRAVITTEM',
    'process.env.UMI_API_HOST_GRAVITTEM': 'https://dev.gravittem.com.br',
    'process.env.UMI_API_LAYOUT_GENERATOR':
      'https://services.dev.gravittem.com.br/Gravittem/GeradorLayout',
    'process.env.UMI_API_FINANCIAL':
      'https://services.dev.gravittem.com.br/Gravittem/financeiro',
    'process.env.UMI_API_HOST_CRM':
      'https://services.dev.gravittem.com.br/Gravittem/CRM',
    // 'https://localhost:4201/gravittem/crm',
    'process.env.UMI_API_HOST_NOTIFICATION':
      'https://services.dev.gravittem.com.br/Gravittem/Notificacoes',
    'process.env.UMI_API_HOST_REGION': `https://services.dev.gravittem.com.br/Gravittem/Regiao`,
    'process.env.UMI_API_HOST_PERMISSION': `https://services.dev.gravittem.com.br/global/permission`,
    'process.env.UMI_API_HOST_COMMENT':
      // `https://localhost:5001`,
      // `http://localhost:5000/gravittem/comentarios`,
      `https://services.dev.gravittem.com.br/gravittem/comentarios`,
    'process.env.UMI_API_HOST_WHATSAPP':
      'https://wppconnect.dev.gravittem.com.br',
    'process.env.UMI_API_HOST_ATTACHMENT': `https://services.dev.gravittem.com.br/gravittem/anexos`,
    'process.env.UMI_ENV': 'sat',
    'process.env.UMI_API_HOST_SEARCH': `https://services.dev.gravittem.com.br/gravittem/pesquisas`,
    'process.env.UMI_API_HOST_ATTENDANCE':
      'https://services.dev.gravittem.com.br/gravittem/atendimento',
    'process.env.UMI_API_HOST_NEW_CONTRACT':
      'https://services.dev.gravittem.com.br/gravittem/contrato',
    'process.env.UMI_API_HOST_CONTRACT':
      'https://services.dev.gravittem.com.br/gravittem/contract',
    'process.env.UMI_API_HOST_QUESTIONNAIRE':
      'https://services.dev.gravittem.com.br/gravittem/questionario',
    'process.env.UMI_API_HOST_MATERIAL_REQUEST':
      'https://services.dev.gravittem.com.br/gravittem/request',
    'process.env.UMI_API_HOST_CHECKLIST':
      'https://services.dev.gravittem.com.br/gravittem/checklist',
    'process.env.UMI_API_HOST_SCHEDULE':
      'https://services.dev.gravittem.com.br/gravittem/Agenda',
    'process.env.UMI_API_HOST_SERVICES':
      'https://services.dev.gravittem.com.br/Gravittem/servicos',
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
