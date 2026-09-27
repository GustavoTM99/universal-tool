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
    component: lazy(
      () =>
        import(
          '../tools/password/PasswordGenerator'
        ),
    ),
  },

  {
    id: 'qr',
    title: 'QR Code',
    description: 'Generate instantly',
    icon: '▦',
    path: '/tools/qr',
    category: 'generator',
    component: lazy(
      () => import('../tools/qr/QrGenerator')
    ),
  },
]