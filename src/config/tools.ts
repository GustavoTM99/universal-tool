import { lazy, type ComponentType } from 'react'

export type ToolCategory =
  | 'developer'
  | 'security'
  | 'generator'

export type ToolComponentProps = {
  onBack: () => void
}

export type ToolDefinition = {
  id: string
  title: string
  description: string
  icon: string
  path: string
  category: ToolCategory
  keywords: string[]
  component: ComponentType<ToolComponentProps>
}

export const tools: ToolDefinition[] = [
  {
    id: 'json',
    title: 'JSON',
    description: 'Format & validate',
    icon: '{ }',
    path: '/tools/json',
    category: 'developer',
    keywords: [
      'json',
      'formatter',
      'format',
      'validator',
      'validate',
      'beautify',
      'beautifier',
      'pretty',
      'minify',
      'minifier',
      'developer',
      'data',
    ],
    component: lazy(
      () => import('../tools/json/JsonFormatter')
    ),
  },

  {
    id: 'xml',
    title: 'XML',
    description: 'Format & validate',
    icon: '</>',
    path: '/tools/xml',
    category: 'developer',
    keywords: [
      'xml',
      'formatter',
      'format',
      'validator',
      'validate',
      'beautify',
      'beautifier',
      'pretty',
      'minify',
      'minifier',
      'developer',
      'markup',
      'data',
    ],
    component: lazy(
      () => import('../tools/xml/XmlFormatter')
    ),
  },

  {
    id: 'password',
    title: 'Password',
    description: 'Generate securely',
    icon: '✦',
    path: '/tools/password',
    category: 'security',
    keywords: [
      'password',
      'passwords',
      'generator',
      'generate',
      'random',
      'secure',
      'security',
      'strong',
      'credentials',
      'characters',
      'symbols',
    ],
    component: lazy(
      () =>
        import(
          '../tools/password/PasswordGenerator'
        )
    ),
  },

  {
    id: 'qr',
    title: 'QR Code',
    description: 'Generate instantly',
    icon: '▦',
    path: '/tools/qr',
    category: 'generator',
    keywords: [
      'qr',
      'qr code',
      'qrcode',
      'generator',
      'generate',
      'url',
      'link',
      'website',
      'wifi',
      'text',
      'scan',
      'barcode',
    ],
    component: lazy(
      () => import('../tools/qr/QrGenerator')
    ),
  },
]