import { lazy, type ComponentType } from 'react'

export type ToolCategory =
  | 'developer'
  | 'security'
  | 'generator'
  | 'everyday'

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

  {
    id: 'base64',
    title: 'Base 64 encoder/decoder',
    description: 'Generate instantly',
    icon: '64',
    path: '/tools/base64',
    category: 'developer',
    keywords: [
      'base64',
      'encoder',
      'decoder',
      'generator',
      'generate',
      'url',
      'link',
      'website',
      '64',
      'text'
    ],
    component: lazy(
      () => import('../tools/base64/Base64Tool')
    ),
  },
  
{
    id: 'random',
    title: 'Random Picker',
description:'Add your options and randomly pick a winner.',
    icon: '✦',
    path: '/tools/random',
    category: 'everyday',
    keywords: [
  'random',
  'picker',
  'random picker',
  'random choice',
  'random name',
  'name picker',
  'winner',
  'raffle',
  'decision',
  'choose',
],
    component: lazy(
      () => import('../tools/random/RandomPicker')
    ),
  },
{
  id: 'ascii-banner',
  icon: 'A',
  title: 'ASCII Banner',
  description:
    'Turn text into glorious ASCII art banners.',
  category: 'developer',
  path: '/ascii-banner',
  keywords: [
    'ascii',
    'ascii art',
    'ascii banner',
    'banner',
    'figlet',
    'text art',
    'terminal',
    'terminal banner',
  ],
    component: lazy(
        () => import('../tools/ascii/AsciiBanner')
    ),
},
]