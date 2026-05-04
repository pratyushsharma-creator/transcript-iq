import type { Access } from 'payload'

export const adminOnly: Access = ({ req }) => req.user?.role === 'admin'

export const adminOrSelf: Access = ({ req }) => {
  if (req.user?.role === 'admin') return true
  if (!req.user) return false
  return { id: { equals: req.user.id } }
}
